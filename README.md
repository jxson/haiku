# Haiku

Haiku is a work in progress and aims to be a static site generator which is highly configurable, expandable, and easy to use.

All content is written in simple text files using either markdown or textile combined with Mustache.

# Dependencies

You need node >= 0.4.10 and npm

# Development

get set up:

    npm install
    npm link # wire up the bin

Once you do that the haiku command line will be available, you can check it out by running:

    haiku --help

To build a haiku site use:

    haiku build

To run a server that lets you see your work locally:

    haiku server

More is coming this is just a proof of concept at this stage

# Inspiration

* [jekyll](https://github.com/mojombo/jekyll)
* [toto](https://github.com/cloudhead/toto)
* [Marco's Second Crack](http://www.marco.org/secondcrack)

# Other Static Site Generators

* [nanoc](http://nanoc.stoneship.org/)
* [ace](https://github.com/botanicus/ace)
* [tinysite](https://github.com/niko/TinySite)
* [stasis](http://stasis.me/)
* [petrify](https://github.com/caolan/petrify)


# License

(The MIT License)

Copyright (c) 2011 Border Stylo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
