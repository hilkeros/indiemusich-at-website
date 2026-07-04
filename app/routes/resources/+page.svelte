<script lang="ts">
  let { data } = $props()
</script>

<svelte:head>
  <title>Resources · indiemusi.ch</title>
</svelte:head>

<div class="page">
  <h1 class="page-title">Resources</h1>
  <p class="page-subtitle">
    A curated collection of articles and links about AT Protocol, Bluesky, and the open social web —
    maintained on <a href="https://semble.so/profile/hilk.eu/collections/3madpvj3qt42z" target="_blank" rel="noopener">Semble</a>.
  </p>

  {#if data.resources.length === 0}
    <p class="empty-state">No resources yet.</p>
  {:else}
    <div class="resources-grid">
      {#each data.resources as resource (resource.uri)}
        <a class="resource-card" href={resource.url} target="_blank" rel="noopener noreferrer">
          {#if resource.imageUrl}
            <img class="resource-image" src={resource.imageUrl} alt="" loading="lazy" />
          {:else}
            <div class="resource-image-placeholder">🔗</div>
          {/if}
          <div class="resource-body">
            {#if resource.siteName}
              <div class="resource-site">{resource.siteName}</div>
            {/if}
            <div class="resource-title">{resource.title}</div>
            {#if resource.description}
              <div class="resource-desc">{resource.description}</div>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>
