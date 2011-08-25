# Haiku

Haiku is a work in progress and aims to be a static site generator which is highly configurable, expandable, and easy to use.

All content is written in simple text files using either markdown or textile combined with Mustache.

Get started by [reviewing the wiki](https://github.com/borderstylo/haiku/wiki)

# Dependencies

You need node >= 0.4.10 and npm

# Development

To get started you will need to make sure you have all of the npm packages installed

    npm install
    npm link # wire up the bin

Right now the only command that works is:

    haiku --source examples/basic --destination build

This will build the html for any pages or posts that exist in the examples/basic directory of this project.

More is coming this is just a proof of concept at this stage

# Inspiration

* [jekyll](https://github.com/mojombo/jekyll)
* [toto](https://github.com/cloudhead/toto)
* [nanoc](http://nanoc.stoneship.org/)
* [Marco's Second Crack](http://www.marco.org/secondcrack)

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
