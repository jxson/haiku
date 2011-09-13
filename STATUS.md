# Status Of This Branch

I know ... that sounds like a slogan for a small town bank. I did some stuff a bit differently than the current master branch and wanted to explain it.

## Goals

The main thing I wanted to accomplish was to really encapsulate different types of content: a file corresponds to a page, a directory to a collection of pages. (I guess because you called a page "content" I did, too, so a file ended up being encapsulated by a Content object, but the idea is the same.)

I wanted to try and simplify the `read` logic that's in the haiku object in master. I wanted to get rid of the need for the read queue. I wanted to get rid of some of the redundant logic in functions like `isInPartialsDir` or, in the content object, `_getCollectionFromFile`. Basically, I primarily wanted to see if I could create a reflection of directory and files in an object model that was a bit cleaner than the initial implementation.

I had a few secondary goals. I wanted to see if I could move away from having mustache hardcoded. I wasn't totally happy with the Origami interface - much like some of the code for dealing with content, it seemed to introduce an inversion of control I found troubling. I didn't want the "public" interface dictated by the client. I wanted it to encapsulate something specific, like a file or directory, and have the knowledge of what that means inside the class.

I also wanted to experiment a bit with some coding conventions. I prefer to have very consistent naming conventions for variables. It already bugs me that, for some reason, in Node.js, standard library objects are typically referenced with lowercase variables (ex: http, fs, etc.). Similarly, I prefer to use camelcase for variables everywhere if we're doing it anywhere. So something like `templatedir` I'd prefer to see as `templateDir` or even better, `templateDirectory`, since that way no one has to guess as to when we used some sort of abbreviation.

Lastly, and this wasn't really a goal as much as something I added because I wanted it, I moved to using Javascript conf files. You can see this if you look at the basic example conf. I like this approach because it is very flexible, you can add a ton of options simply and easily, and you can do things like pass in your logger if you want. I modified the bin and cli.js code to incorporate this, so now you simply pass in the command and the config.

## Results

Although it was a bit trickier than I had hoped it would be, I think I have a solid foundation in terms of encapsulating content. I was able to get rid of the read queue and some of the IoC stuff. I ended up just using straight up Javascript "classes" that are completely encapsulated. To construct a class, you pass in the options appropriate. If you need a data-oriented view, you just call `toJSON`, which is analogous to `toView` - I felt it was more generic to think of it in terms of `toJSON`.

I'm going to call this a win in the end. I think the code is quite clean and DRY and is close to as simple as it can be. I didn't end up implement the `build` function, but I don't think that presents a big problem. I just didn't get to it. A more serious problem isn't really design-related, but has to do with what the interface to the templates ought to be. More on that in second. I'm also not thrilled with how parallel the getIndex and toJSON code seems to be. It feels redundant somehow.

I have a very generic way of dealing with templates now. Mustache has no special designation. In theory, you could mix and match, say, dust templates with Mustache with no problem, so long as content that uses one doesn't try to include partials using the other. I say "in theory" because dust uses a callback for it's template processing, which this code doesn't support. But it could easily be added and I'd like to do that.

I think the naming conventions strike the right balance between following Node.js conventions while being consistent, clear, and easy for other people to follow. For example, the directory preferences are now an option under "directories." You reference them via `site.directories.templates`, for example, which is the same way you pass them in.

Which brings me to the conf approach, which I think is a big success. The CLI code is simplified as a result and the interface to the server and site classes is straightforward - just pass it the options object. I did lose some functionality here, in that you were able to detect when the source and destination were the same, and I can't because I get three directories passed into me directly. That isn't a problem with the conf approach itself, just with the way I structured the options. (Even so, it occurred to me that the current check only checks for a top-level overlap. I'm not sure how we can do much better, though.)

I also felt pretty good about refactoring some things so that there is now a Haiku.Site and a Haiku.Server instead of having Haiku be a sort of psuedo-site object and sever being this orphan class. You can see how this worked out just by looking at the cli.js. You `require("haiku")` and it exports a Site class and a Server class, each of which take the same options object you get from the conf file, taking whatever they need from it.

The casualties were the docs and the tests, neither of which I've updated. I did try to be sure and comment the code to try and make the logic easier to understand.

## What Works And What Doesn't

As I said, `build` isn't implemented, and the tests and docs need updating. Also, `render` doesn't _quite_ work. So ... what the hell, right? But `render` actually does work pretty well. Layouts and partials all work fine. The difficulty is accessing collections or attributes from within a template. And I think this actually reflects a more basic problem, which I'll address in the next section. I can render rocket.ly and the basic example up to a point. I just can't iterate though blog posts. Or, more specifically, I could, but I'd lose the ability to deal with more deeply nested content. Which I don't think is a problem with this implementation, but rather something we need to decide about how the template interface works.

# The Template Interface

Currently, we're making an assumption that I can get a collection from the site and then that will return me an array of content objects. But what if that contains another directory? What if I want to do site.posts.archives? If posts is an array, I can't do that. But if it's not, I can't just do {{#posts}} in mustache and expect it to iterate through my posts.

In reality, a collection can contain both other collections and pages. I ran into this because site.posts works fine, specifically:

    {{#site}}
      {{#posts}}
      
which gives me the collection object for the `posts` directory. But that is another hash. It has entries like `01-first-post`. 

I could fix this with an attribute called `entries` (as one possibility) that would be returned by `toJSON`. So then you'd have:

    {{#site}}
      {{#posts}}
        {{#entries}}
        
I figure you'll hate that, but the alternative is to lose the ability to have subdirectories. (This is also where dust's chaining is nice, since I can do site.posts.entries directly.) And that isn't a limitation of any given implementation, but rather on the interface we're imposing on it.

I stopped short of fixing the problem because I ran out of time and because I figure it's one of those things we probably need to talk about.

# Going Forward

I didn't merge this branch into master because it seemed premature. The `build` function needs to be added and the tests and documentation updated. In addition, the template interface needs to be finalized, although I think that actually is an issue for both branches.

Furthermore, this ended up being such a radical departure from what you had in some areas that I didn't want to do the merge without giving you the opportunity to study the code a bit and form your own opinion. It might be that the best thing is to use this as a reference implementation for certain things. (That said, I used master as a reference implementation for quite a bit of this code. A lot of the nasty stuff had already been figured out, so I was able to focus on the structural issues. Hopefully, that paid off, and so it will make more sense to use this code going forward.)

One last thing, a sort of minor point. I think the Content class should be renamed to Page. This way there is less overloading of the word "content". So then there would Collections and Pages. It's all content. And the site.content is specifically the Collection corresponding to your content directory (and has nothing to do with the Content class, which would now be Page).
  




