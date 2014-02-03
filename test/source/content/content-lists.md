= yaml =
title: Template Variables For Content Iterators
= yaml =

Pages in --content-dir:

<ul class="content-list">
  {{#content}}
  <li>{{ title }}</li>
  {{/content}}
</ul>

Sub-directories of --content-dir:

<ul class="posts-list">
  {{#content.posts}}
  <li>{{ title }}</li>
  {{/content.posts}}
</ul>
