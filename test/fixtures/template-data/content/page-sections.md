= yaml =
title: Page 1
description: Access a page directly
author: haiku:content/people/jxson.md
= yaml =

WTF

{{#author}}
* name
* github
{{/author}}

{{#page}}

{{/page}}

{{#haiku:content/people/jxson.md}}
* {{ name }}
* {{ github }}
{{/haiku:content/people/jxson.md}}
