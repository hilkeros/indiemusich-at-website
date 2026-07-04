<script lang="ts">
  let { data } = $props();

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
</script>

<svelte:head>
  <title>Articles · indiemusi.ch</title>
</svelte:head>

<div class="page">
  <h1 class="page-title">Articles</h1>
  <p class="page-subtitle">
    Writing in English on
    <a href="https://hilkeu.leaflet.pub" target="_blank" rel="noopener">leaflet.pub</a>
    and in German on
    <a href="https://hilkeu.pckt.blog" target="_blank" rel="noopener">pckt.blog</a>.
  </p>

  <div class="two-col-feeds">
    <!-- English column -->
    <div class="feed-col">
      <div class="feed-col-header">
        <span class="lang-badge lang-en">EN</span>
        <a href="https://hilkeu.leaflet.pub" target="_blank" rel="noopener" class="feed-col-source">
          hilke thinks · leaflet.pub
        </a>
      </div>
      {#if data.en.length === 0}
        <p class="empty-state" style="padding: 1.5rem 0;">No articles yet.</p>
      {:else}
        <div class="feed-list">
          {#each data.en as article (article.uri)}
            <a class="feed-item" href="/articles/{article.rkey}">
              <span class="article-date">{formatDate(article.publishedAt)}</span>
              <h2 class="article-title">{article.title}</h2>
              {#if article.description}
                <p class="article-desc">{article.description}</p>
              {/if}
              {#if article.tags.length > 0}
                <div class="article-tags">
                  {#each article.tags as tag}
                    <span class="tag">{tag}</span>
                  {/each}
                </div>
              {/if}
            </a>
          {/each}
        </div>
      {/if}
    </div>

    <!-- German column -->
    <div class="feed-col">
      <div class="feed-col-header">
        <span class="lang-badge lang-de">DE</span>
        <a href="https://hilkeu.pckt.blog" target="_blank" rel="noopener" class="feed-col-source">
          Hilke schreibt · pckt.blog
        </a>
      </div>
      {#if data.de.length === 0}
        <p class="empty-state" style="padding: 1.5rem 0;">No articles yet.</p>
      {:else}
        <div class="feed-list">
          {#each data.de as article (article.uri)}
            <a class="feed-item" href="/articles/{article.rkey}">
              <span class="article-date">{formatDate(article.publishedAt)}</span>
              <h2 class="article-title">{article.title}</h2>
              {#if article.description}
                <p class="article-desc">{article.description}</p>
              {/if}
              {#if article.tags.length > 0}
                <div class="article-tags">
                  {#each article.tags as tag}
                    <span class="tag">{tag}</span>
                  {/each}
                </div>
              {/if}
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
