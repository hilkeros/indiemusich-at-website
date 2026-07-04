<script lang="ts">
  import "../app.css";
  import { page } from "$app/state";

  let { children } = $props();

  const isActive = (path: string) => page.url.pathname === path;
</script>

<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="nav-logo">indiemusi.ch</a>
    <ul class="nav-links">
      <li><a href="/articles" class:active={isActive('/articles')}>Articles</a></li>
      <li><a href="/resources" class:active={isActive('/resources')}>Resources</a></li>
      <li><a href="/about" class:active={isActive('/about')}>About</a></li>
    </ul>
  </div>
</nav>

{@render children()}

<footer class="footer">
  <p>
    Built on <a href="https://atproto.com" target="_blank" rel="noopener">AT Protocol</a> ·
    <a href="https://mu.social/profile/hilk.eu" target="_blank" rel="noopener">@hilk.eu</a>
  </p>
</footer>
