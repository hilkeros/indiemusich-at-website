<script lang="ts">
  import ArticleDetail from "$lib/ArticleDetail.svelte";
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.article.title} · indiemusi.ch</title>
</svelte:head>

<ArticleDetail article={data.article} />
