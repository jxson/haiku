var Content = require('haiku/content')
  , colors = require('colors')
  , _ = require('underscore')
  , path = require('path')
;

describe('Content', function(){
  var mi6
    , oscarMike
    , indexpath
  ;

  beforeEach(function() {
    indexpath = path.resolve(path.join('examples'
                  , 'basic'
                  , 'content'
                  , 'index.mustache'));

    oscarMike = false;

    mi6 = {
        spy: function(){}
      , asyncSpy: function(){ oscarMike = true; }
    }

    spyOn(mi6, 'spy');
    spyOn(mi6, 'asyncSpy').andCallThrough();
  });

  describe('#read()', function(){
    beforeEach(function() {
      index = new Content({
        file: indexpath
      });
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
      });
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
});
