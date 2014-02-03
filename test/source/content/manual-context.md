= yaml =
title: Via h.render(key, ctx, callback)
= yaml =

<h1 class="page-title">{{ page.title }}</h1>

Rendering should allow `context` to be passed into the templates as custom template variables but not allow `context.content` or `context.page` to be overriden.

<ul class="content-list">
  {{#content}}
  <li>{{ title }}</li>
  {{/content}}
</ul>

This <span class="foo">{{ foo }}</span> should have <span class="bar">{{ bar }}</span> variables passed into the `h.render(key, ctx, callback)` method.
