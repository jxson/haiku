var Content = require('haiku/content')
  , colors = require('colors')
  , _ = require('underscore')
  , path = require('path')
  , Haiku = require('haiku')
;

describe('Content', function(){
  var index
    , content
    , haiku
    , mi6
    , oscarMike
    , indexpath
    , postpath
  ;

  beforeEach(function() {
    indexpath = path.resolve(path.join('examples'
                  , 'basic'
                  , 'content'
                  , 'index.mustache'));

    postpath = path.resolve(path.join('examples'
                  , 'basic'
                  , 'content'
                  , 'posts'
                  , '01-first-post.markdown'));


    oscarMike = false;

    mi6 = {
        spy: function(){}
      , asyncSpy: function(){ oscarMike = true; }
    }

    spyOn(mi6, 'spy');
    spyOn(mi6, 'asyncSpy').andCallThrough();

    haiku = new Haiku({
      source: path.resolve(path.join('examples', 'basic'))
    });
  });

  describe('#read()', function(){
    beforeEach(function() {
      index = new Content({ file: indexpath }, haiku);
    });

    it('should be defined', function(){
      expect(index.read).toBeDefined();
    });

    it('should emit a "ready" function', function(){
      index.on('ready', mi6.asyncSpy);

      index.read();

      waitsFor(function(){
        return oscarMike;
      }, 'haiku ready event', 10000);

      runs(function(){
        expect(mi6.asyncSpy).toHaveBeenCalled();
      });
    });
  });

  describe('#extractAttributesFromFile(callback)', function(){
    beforeEach(function(){
      index = new Content({
        file: indexpath
      }, haiku);
    });

    it('should exist', function(){
      expect(index.extractAttributesFromFile).toBeDefined();
    });

    describe('on successful file read', function(){
      it('should trigger a callback', function(){
        index.extractAttributesFromFile(mi6.asyncSpy);

        waitsFor(function(){
          return oscarMike;
        }, '#extractAttributesFromFile(callback) to trigger callback', 10000);

        runs(function(){
          expect(mi6.asyncSpy).toHaveBeenCalled();
        });
      });

      it('should set attributes defined in the yaml front matter', function(){
        index.extractAttributesFromFile(mi6.asyncSpy);

        waitsFor(function(){
          return oscarMike;
        }, '#extractAttributesFromFile(callback) to trigger callback', 10000);

        runs(function(){
          expect(mi6.asyncSpy).toHaveBeenCalled();

          expect(index.get('title')).toBe('This is the homepage');
        });
      });
    });
  });

  describe('#parser()', function(){
    beforeEach(function(){ index = new Content(); });

    it('should be defined', function(){
      expect(index.parser).toBeDefined();
    });

    describe('when the `file` attribute is set', function(){
      describe('with markdown extensions', function(){
        _.each(['.md', '.markdown', '.mdown', '.mkdn', '.mkd'], function(ext){
          it('should return "markdown"', function(){
            index.set({ file: 'markdown-file' + ext });

            expect(index.parser()).toBe('markdown');
          });
        });
      });

      describe('with textile extensions', function(){
        beforeEach(function(){
          index.set({ file: 'textile-file.textile' });
        });

        it('should return "textile"', function(){
          expect(index.parser()).toBe('textile');
        });
      });

      describe('with html extensions', function(){
        _.each(['.mustache', '.html'], function(ext){
          it('should return "none"', function(){
            index.set({ file: 'markdown-file' + ext });

            expect(index.parser()).not.toBeDefined();
          });
        });
      });
    });

    describe('when the `file` attribute is not set', function(){
      it('should return undefined', function(){
        expect(index.parser()).not.toBeDefined();
      });
    });
  });

  describe('#parse()', function(){
    beforeEach(function(){
      content = new Content({
        file: postpath
      }, haiku);
    });

    it('should be defined', function(){
      expect(content.parse).toBeDefined();
    });

    describe('when the parser is defined', function(){
      describe('when the parser is markdown', function(){
        beforeEach(function(){
          spyOn(content, 'parser').andReturn('markdown');
        });

        it('should return markdown generated html', function(){
          var input = 'this is _markdown_ \n\nparagraph\n'
            , output = '<p>this is <em>markdown</em></p>\n\n<p>paragraph</p>'
          ;

          expect(content.parse(input)).toBe(output);
        });
      });

      describe('when the parser is textile', function(){
        beforeEach(function(){
          spyOn(content, 'parser').andReturn('textile');
        });

        it('should return textile generated html', function(){
          var input = 'this is *textile* \n\nparagraph\n'
            , output = '<p>this is <strong>textile</strong> </p>\n<p>paragraph</p>\n'
          ;

          expect(content.parse(input)).toBe(output);
        });
      });
    });

    describe('when the parser is NOT defined', function(){
      beforeEach(function(){
        spyOn(content, 'parser').andReturn(undefined);
      });

      it('should set the content directly', function(){
        var input = 'nothing \n\n'
          , output = 'nothing \n\n'
        ;

        expect(content.parse(input)).toBe(output);
      });
    });
  });

  describe('#url()', function(){
    beforeEach(function(){
      index = new Content({ file: indexpath });
    });

    it('should be defined', function(){
      expect(index.url).toBeDefined();
    });

    describe('when the file attribute is set', function(){
      it('should return the path from the haiku public dir', function(){
        expect(index.url()).toBe('index.html');
      });
    });

    describe('when the file attribute is NOT set', function(){
      beforeEach(function(){
        index.set({ file: null });
      });

      it('should return undefined', function(){
        expect(index.url()).not.toBeDefined();
      });
    });
  });

  describe('#_extension()', function(){
    beforeEach(function(){ index = new Content(); });

    it('should be defined', function(){
      expect(index._extension).toBeDefined();
    });

    describe('when the file attribute is set', function(){
      describe('when it does not have a secondary extension', function(){
        beforeEach(function(){ index.set({ file: 'handlebar.mustache' }); });

        it('should return "html"', function(){
          expect(index._extension()).toBe('.html');
        });
      });

      describe('when it does have a pre extension', function(){
        _.each(['.xml', '.css', '.js', '.html'], function(prext){
          it('should return "' + prext + '"', function(){
            index = new Content();
            index.set({ file: 'a' + prext + '.mustache' });

            expect(index._extension()).toBe(prext);
          });
        })

        it('should return the second to last pre extension', function(){
          index = new Content();
          index.set({ file: 'a.b.c.xml.mustache' });

          expect(index._extension()).toBe('.xml');
        });
      });
    });

    describe('when the file attribute is NOT set', function(){
      beforeEach(function(){ index.set({ file: null }); });

      it('should return undefined', function(){
        expect(index.url()).not.toBeDefined();
      });
    });
  });

  // TODO: comeback to this, I think it can only be tested thoroughly thru the
  // haiku_spec.js
  describe('#render(callback)', function(){
    beforeEach(function() {
      index = new Content({
        file: indexpath
      });
    });

    it('should be defined', function(){
      expect(index.render).toBeDefined();
    });

    it('should trigger a callback', function(){
      // index.render(mi6.asyncSpy);
      //
      // waitsFor(function(){
      //   return oscarMike;
      // }, '#render(callback) to trigger callback', 10000);
      //
      // runs(function(){
      //   expect(mi6.asyncSpy).toHaveBeenCalled();
      //
      //   // expect(index.get('title')).toBe('This is the homepage');
      // });
    });

    it('should render the content wrapped in a layout', function(){

    });
  });

  describe('#isInCollection()', function(){
    beforeEach(function(){
      haiku = new Haiku({
        source: path.resolve(path.join('examples', 'basic'))
      });

      content = new Content({}, haiku);
    });

    it('should be defined', function(){
      expect(content.isInCollection).toBeDefined();
    });

    describe('when in a collection', function(){
      beforeEach(function(){
        content.set({ file: postpath });
      });

      it('should return `true`', function(){
        expect(content.isInCollection()).toBe(true);
      });

      it('should set it\'s collection', function(){
        expect(content.collection()).toBe('posts');
      });
    });

    describe('when not in a collection', function(){
      beforeEach(function(){
        content.set({ file: indexpath});
      });

      it('should return `false`', function(){
        expect(content.isInCollection()).toBe(false);
      });

      it('should not set it\'s collection', function(){
        expect(content.collection()).not.toBeDefined();
      });
    });
  });
});
