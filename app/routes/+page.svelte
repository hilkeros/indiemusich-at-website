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

<section class="hero">
  <h1>indiemusi.ch<br />music players united in doubt</h1>
  <p class="tagline">
    The current state of social media leaves us with a lot of questions. How can we stay united as music players amidst of platform monopolies?
  </p>
   <p class="tagline">
    Via this website, we try to stay connected as a music scene. Hilke writes in German and English about new evolutions in the Open Social Web.
  </p>
</section>

<div class="page">
  <div class="section">
    <div class="section-header">
      <h2>Recent Articles</h2>
      <a href="/articles">All articles →</a>
    </div>

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
                <h3 class="article-title">{article.title}</h3>
                {#if article.description}
                  <p class="article-desc">{article.description}</p>
                {/if}
                {#if article.tags.length > 0}
                  <div class="article-tags">
                    {#each article.tags.slice(0, 3) as tag}
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
                <h3 class="article-title">{article.title}</h3>
                {#if article.description}
                  <p class="article-desc">{article.description}</p>
                {/if}
                {#if article.tags.length > 0}
                  <div class="article-tags">
                    {#each article.tags.slice(0, 3) as tag}
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

  <div class="section">
    <div class="section-header">
      <h2>Resources</h2>
      <a href="/resources">All resources →</a>
    </div>

    {#if data.resources.length === 0}
      <p class="empty-state">No resources yet.</p>
    {:else}
      <div class="resource-preview-list">
        {#each data.resources as resource (resource.uri)}
          <a class="resource-preview-item" href={resource.url} target="_blank" rel="noopener noreferrer">
            {#if resource.imageUrl}
              <img class="resource-preview-thumb" src={resource.imageUrl} alt="" loading="lazy" />
            {:else}
              <div class="resource-preview-thumb resource-preview-thumb--empty">🔗</div>
            {/if}
            <div class="resource-preview-body">
              <span class="resource-site">{resource.siteName || new URL(resource.url).hostname}</span>
              <span class="resource-title">{resource.title}</span>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>
