= yaml =
title: Include pages inside other pages
expanded: haiku:content/lumpy-space-princess.md
= yaml =

# {{ page.title }}

<div class="expanded">
  {{#page.expanded}}
  <h2>{{ title }}</h2>

  <p>{{ foo }} {{ bar }} {{ baz }}.</p>
  {{/page.expanded}}
</div>
