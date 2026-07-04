<script lang="ts">
  import type { ArticleDetail, TextSpan } from "./atproto";

  let { article }: { article: ArticleDetail } = $props();

  const sourceName = $derived(article.source === "leaflet" ? "leaflet.pub" : "pckt.blog");

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(article.lang === "de" ? "de-CH" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
</script>

{#snippet spans(list: TextSpan[])}
  {#each list as span}
    {#if span.href}
      <a href={span.href} target="_blank" rel="noopener noreferrer">
        {#if span.bold}<strong>{span.text}</strong>
        {:else if span.italic}<em>{span.text}</em>
        {:else if span.code}<code>{span.text}</code>
        {:else}{span.text}{/if}
      </a>
    {:else if span.bold}
      <strong>{span.text}</strong>
    {:else if span.italic}
      <em>{span.text}</em>
    {:else if span.code}
      <code>{span.text}</code>
    {:else}
      {span.text}
    {/if}
  {/each}
{/snippet}

<div class="article-page">
  <div class="article-header">
    <div class="article-header-meta">
      <a href="/articles" class="back-link">← Articles</a>
      <span class="lang-badge lang-{article.lang}">{article.lang.toUpperCase()}</span>
      <span class="article-date">{formatDate(article.publishedAt)}</span>
    </div>

    <h1 class="article-page-title">{article.title}</h1>

    {#if article.description}
      <p class="article-page-desc">{article.description}</p>
    {/if}

    <a class="original-link" href={article.externalUrl} target="_blank" rel="noopener noreferrer">
      Read on {sourceName} ↗
    </a>
  </div>

  <div class="article-body">
    {#each article.blocks as block}
      {#if block.type === "break"}
        <div class="block-break"></div>
      {:else if block.type === "heading"}
        {#if block.level <= 2}
          <h2 class="block-heading">{@render spans(block.spans)}</h2>
        {:else if block.level === 3}
          <h3 class="block-heading">{@render spans(block.spans)}</h3>
        {:else}
          <h4 class="block-heading">{@render spans(block.spans)}</h4>
        {/if}
      {:else}
        <p class="block-text" class:center={block.center}>
          {@render spans(block.spans)}
        </p>
      {/if}
    {/each}
  </div>

  {#if article.tags.length > 0}
    <div class="article-footer-tags">
      {#each article.tags as tag}
        <span class="tag">{tag}</span>
      {/each}
    </div>
  {/if}
</div>
