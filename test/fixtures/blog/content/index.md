= yaml =
title: Just a blog for testing.
= yaml =

# {{ page.title }}

Hello and welcome. Here is some stuff:

{{#content.posts}}
* [{{ title }}]({{ url }})
{{/content.posts}}
