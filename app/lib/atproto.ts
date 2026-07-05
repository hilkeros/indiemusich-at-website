import { callXrpc } from "$hatk";

const DID = "did:plc:giaakn4axmr5dhfnvha6r6wn";
const PDS = "https://northsky.social";
const SEMBLE_COLLECTION_URI = `at://${DID}/network.cosmik.collection/3madpvj3qt42z`;

// Maps site.standard.publication rkey → blog identity
const PUBLICATIONS: Record<
  string,
  { source: "leaflet" | "pckt"; lang: "en" | "de"; baseUrl: string }
> = {
  "3lwrqixxbqk2m": {
    source: "leaflet",
    lang: "en",
    baseUrl: "https://hilkeu.leaflet.pub",
  },
  "3mih77lnd65ht": {
    source: "pckt",
    lang: "de",
    baseUrl: "https://hilkeu.pckt.blog",
  },
};

// ── Article list types ───────────────────────────

export interface Article {
  rkey: string;
  uri: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  lang: "en" | "de";
  externalUrl: string;
  source: "leaflet" | "pckt";
}

// ── Rich text types ──────────────────────────────

export interface TextSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  href?: string;
}

export interface TextBlock {
  type: "text";
  spans: TextSpan[];
  center?: boolean;
}

export interface HeadingBlock {
  type: "heading";
  level: number;
  spans: TextSpan[];
}

export interface ImageBlock {
  type: "image";
  url: string;
  alt: string;
  placeholder?: string;
  center?: boolean;
}

export interface BreakBlock {
  type: "break";
}

export type Block = TextBlock | HeadingBlock | ImageBlock | BreakBlock;

export interface ArticleDetail extends Article {
  coverImage?: string;
  blocks: Block[];
}

// ── Resource types ───────────────────────────────

export interface Resource {
  uri: string;
  url: string;
  title: string;
  description: string;
  siteName: string;
  imageUrl?: string;
  addedAt: string;
  note?: string;
}

// ── Internal helpers ─────────────────────────────

function extractRkey(uri: string): string {
  return uri.split("/").pop() ?? "";
}

function blobUrl(cid: string): string {
  return `${PDS}/xrpc/com.atproto.sync.getBlob?did=${DID}&cid=${cid}`;
}

function extractBlobCid(blob: any): string | null {
  return blob?.ref?.["$link"] ?? null;
}

function pubRkey(siteUri: string): string {
  return extractRkey(siteUri);
}

function pubInfo(siteUri: string) {
  return PUBLICATIONS[pubRkey(siteUri)] ?? null;
}

// Applies byte-offset facets to a plaintext string → array of styled spans
function applyFacets(plaintext: string, facets: any[]): TextSpan[] {
  if (!facets?.length) return [{ text: plaintext }];

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const bytes = encoder.encode(plaintext);
  const sorted = [...facets].sort((a, b) => a.index.byteStart - b.index.byteStart);
  const spans: TextSpan[] = [];
  let cursor = 0;

  for (const facet of sorted) {
    const { byteStart, byteEnd } = facet.index;
    if (byteStart > cursor) {
      spans.push({ text: decoder.decode(bytes.slice(cursor, byteStart)) });
    }
    const facetText = decoder.decode(bytes.slice(byteStart, byteEnd));
    const span: TextSpan = { text: facetText };
    for (const f of facet.features ?? []) {
      if (f.$type.endsWith("#bold")) span.bold = true;
      else if (f.$type.endsWith("#italic")) span.italic = true;
      else if (f.$type.endsWith("#code")) span.code = true;
      else if (f.$type.endsWith("#link") && f.uri) span.href = f.uri;
    }
    spans.push(span);
    cursor = byteEnd;
  }

  if (cursor < bytes.length) {
    spans.push({ text: decoder.decode(bytes.slice(cursor)) });
  }
  return spans;
}

// Parses site.standard.document content into Block[]
// Handles both pub.leaflet.content (pages→blocks) and blog.pckt.content (items)
function parseContent(content: any): Block[] {
  if (!content) return [];
  const blocks: Block[] = [];

  if (content.$type === "pub.leaflet.content") {
    for (const page of content.pages ?? []) {
      for (const entry of page.blocks ?? []) {
        const b = entry.block ?? entry;
        // Image block
        const imageCid = extractBlobCid(b.image ?? b.blob ?? b.attrs?.blob);
        if (b.$type === "pub.leaflet.blocks.image" || imageCid) {
          if (imageCid) {
            blocks.push({
              type: "image",
              url: blobUrl(imageCid),
              alt: b.alt ?? b.attrs?.alt ?? "",
              placeholder: b.placeholder ?? b.attrs?.placeholder,
              center: true,
            });
          }
          continue;
        }
        const plaintext: string = b.plaintext ?? b.text ?? "";
        if (!plaintext.trim()) {
          blocks.push({ type: "break" });
          continue;
        }
        const spans = applyFacets(plaintext, b.facets ?? []);
        if (b.$type === "pub.leaflet.blocks.header") {
          blocks.push({ type: "heading", level: b.level ?? 2, spans });
        } else {
          blocks.push({
            type: "text",
            spans,
            center: b.alignment?.endsWith("textAlignCenter") ?? false,
          });
        }
      }
    }
  } else {
    // blog.pckt.content or unknown — flat items array
    for (const item of content.items ?? []) {
      // Image block: blog.pckt.block.image
      if (item.$type === "blog.pckt.block.image") {
        const cid = extractBlobCid(item.attrs?.blob);
        if (cid) {
          blocks.push({
            type: "image",
            url: blobUrl(cid),
            alt: item.attrs?.alt ?? "",
            placeholder: item.attrs?.placeholder,
            center: item.attrs?.align === "center",
          });
        }
        continue;
      }
      const plaintext: string = item.plaintext ?? item.text ?? "";
      if (!plaintext.trim()) {
        blocks.push({ type: "break" });
        continue;
      }
      blocks.push({
        type: "text",
        spans: applyFacets(plaintext, item.facets ?? []),
        center: item.alignment?.endsWith("textAlignCenter") ?? false,
      });
    }
  }

  // Trim trailing breaks
  while (blocks.length && blocks[blocks.length - 1].type === "break") blocks.pop();
  return blocks;
}

// Builds an Article from a hatk record item (has { uri, value: { ... } })
function articleFromItem(item: any): Article | null {
  const v = item.value;
  if (!v?.title || !v?.publishedAt || !v?.site) return null;
  const pub = pubInfo(v.site);
  if (!pub) return null;
  const key = extractRkey(item.uri);
  const path: string = v.path ?? key;
  return {
    rkey: key,
    uri: item.uri,
    title: v.title.trim(),
    description: v.description ?? "",
    publishedAt: v.publishedAt,
    tags: v.tags ?? [],
    lang: pub.lang,
    externalUrl: `${pub.baseUrl}/${path.replace(/^\//, "")}`,
    source: pub.source,
  };
}

// ── Public API ───────────────────────────────────

export async function getAllArticles(): Promise<Article[]> {
  const result = await callXrpc("dev.hatk.getRecords", {
    collection: "site.standard.document",
    limit: 100,
  } as any);
  return (result.items as any[])
    .map(articleFromItem)
    .filter((a): a is Article => a !== null)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getArticleDetail(key: string): Promise<ArticleDetail | null> {
  const uri = `at://${DID}/site.standard.document/${key}`;
  let result: any;
  try {
    result = await callXrpc("dev.hatk.getRecord", { uri });
  } catch {
    return null;
  }
  const rec = result?.record;
  if (!rec?.value?.title || !rec.value.site) return null;
  const pub = pubInfo(rec.value.site);
  if (!pub) return null;
  const path: string = rec.value.path ?? key;
  return {
    rkey: key,
    uri: rec.uri,
    title: rec.value.title.trim(),
    description: rec.value.description ?? "",
    publishedAt: rec.value.publishedAt,
    tags: rec.value.tags ?? [],
    lang: pub.lang,
    externalUrl: `${pub.baseUrl}/${path.replace(/^\//, "")}`,
    source: pub.source,
    coverImage: extractBlobCid(rec.value.coverImage)
      ? blobUrl(extractBlobCid(rec.value.coverImage)!)
      : undefined,
    blocks: parseContent(rec.value.content),
  };
}

export async function getResources(): Promise<Resource[]> {
  const [linksResult, cardsResult] = await Promise.all([
    callXrpc("dev.hatk.getRecords", {
      collection: "network.cosmik.collectionLink",
      limit: 100,
    } as any),
    callXrpc("dev.hatk.getRecords", { collection: "network.cosmik.card", limit: 100 } as any),
  ]);

  // Find collectionLinks belonging to our Semble collection → uri → addedAt
  const collectionLinks = new Map<string, string>(); // cardUri → addedAt
  for (const l of linksResult.items as any[]) {
    if (l.value?.collection?.uri === SEMBLE_COLLECTION_URI && l.value?.card?.uri) {
      collectionLinks.set(l.value.card.uri, l.value.addedAt);
    }
  }

  // Split cards into URL cards and note cards
  const urlCards = new Map<string, any>(); // uri → card item
  const notes = new Map<string, string>(); // parentCard uri → note text
  for (const card of cardsResult.items as any[]) {
    const content = card.value?.content;
    if (content?.["$type"] === "network.cosmik.card#noteContent" && card.value?.parentCard?.uri) {
      notes.set(card.value.parentCard.uri, content.text ?? "");
    } else if (content?.["$type"] === "network.cosmik.card#urlContent") {
      urlCards.set(card.uri, card);
    }
  }

  const resources: Resource[] = [];
  for (const [cardUri, addedAt] of collectionLinks) {
    const card = urlCards.get(cardUri);
    if (!card?.value?.content?.url) continue;
    const meta = card.value.content.metadata ?? {};
    resources.push({
      uri: card.uri,
      url: card.value.content.url,
      title: meta.title ?? card.value.content.url,
      description: meta.description ?? "",
      siteName: meta.siteName ?? "",
      imageUrl: meta.imageUrl ?? undefined,
      addedAt,
      note: notes.get(cardUri),
    });
  }

  return resources.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
}
