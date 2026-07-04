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

export interface BreakBlock {
  type: "break";
}

export type Block = TextBlock | HeadingBlock | BreakBlock;

export interface ArticleDetail extends Article {
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
}

// ── Internal helpers ─────────────────────────────

function extractRkey(uri: string): string {
  return uri.split("/").pop() ?? "";
}

function pubRkey(siteUri: string): string {
  // "at://did:.../site.standard.publication/3xxx" → "3xxx"
  return extractRkey(siteUri);
}

function pubInfo(siteUri: string) {
  return PUBLICATIONS[pubRkey(siteUri)] ?? null;
}

async function listRecords(collection: string, limit = 50): Promise<any[]> {
  try {
    const res = await fetch(
      `${PDS}/xrpc/com.atproto.repo.listRecords?repo=${DID}&collection=${encodeURIComponent(collection)}&limit=${limit}`,
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.records ?? [];
  } catch {
    return [];
  }
}

async function getRecord(collection: string, key: string): Promise<any | null> {
  try {
    const res = await fetch(
      `${PDS}/xrpc/com.atproto.repo.getRecord?repo=${DID}&collection=${encodeURIComponent(collection)}&rkey=${key}`,
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
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

// Builds an Article from a raw site.standard.document record (no content fetched)
function articleFromRecord(r: any): Article | null {
  const v = r.value;
  if (!v.title || !v.publishedAt || !v.site) return null;
  const pub = pubInfo(v.site);
  if (!pub) return null;
  const key = extractRkey(r.uri);
  const path: string = v.path ?? key;
  return {
    rkey: key,
    uri: r.uri,
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

export async function getLeafletArticles(): Promise<Article[]> {
  const records = await listRecords("site.standard.document");
  return records
    .map(articleFromRecord)
    .filter((a): a is Article => a !== null && a.source === "leaflet")
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPcktArticles(): Promise<Article[]> {
  const records = await listRecords("site.standard.document");
  return records
    .map(articleFromRecord)
    .filter((a): a is Article => a !== null && a.source === "pckt")
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getAllArticles(): Promise<Article[]> {
  const records = await listRecords("site.standard.document");
  return records
    .map(articleFromRecord)
    .filter((a): a is Article => a !== null)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getArticleDetail(key: string): Promise<ArticleDetail | null> {
  const rec = await getRecord("site.standard.document", key);
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
    blocks: parseContent(rec.value.content),
  };
}

export async function getResources(): Promise<Resource[]> {
  const links = await listRecords("network.cosmik.collectionLink");
  const relevant = links.filter((l) => l.value.collection?.uri === SEMBLE_COLLECTION_URI);
  const resources: Resource[] = [];

  await Promise.all(
    relevant.map(async (link) => {
      const cardUri = link.value.card?.uri;
      if (!cardUri) return;
      const card = await getRecord("network.cosmik.card", extractRkey(cardUri));
      if (!card?.value?.content?.url) return;
      const meta = card.value.content.metadata ?? {};
      resources.push({
        uri: card.uri,
        url: card.value.content.url,
        title: meta.title ?? card.value.content.url,
        description: meta.description ?? "",
        siteName: meta.siteName ?? "",
        imageUrl: meta.imageUrl ?? undefined,
        addedAt: link.value.addedAt,
      });
    }),
  );

  return resources.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
}
