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

{{#content/people/jxson.md}}
* {{ name }}
* {{ github }}
{{/content/people/jxson.md}}
