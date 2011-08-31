
var Haiku = require('haiku')
  , _ = require('underscore')
  , path = require('path')
;

describe('Haiku', function(){
  var source
    , haiku
    , mi6 = {
          spy: function(){}
        , asyncSpy: function(){ oscarMike = true; }
      }
    , oscarMike
  ;

  beforeEach(function() {
    spyOn(mi6, 'spy');
    spyOn(mi6, 'asyncSpy').andCallThrough();
  });

  // describe('.configure(configObject)', function(){
  //   it("should have .configure", function(){
  //     expect(Haiku.configure).toBeDefined();
  //   });
  //
  //   it('should have .config after calling .configure()', function(){
  //     var config = Haiku.configure({source: 'foo'});
  //
  //     expect(Haiku.config).toBeDefined();
  //     expect(Haiku.config.get('source')).toBe('foo')
  //   });
  // });
  //
  // describe('new Haiku(config);', function(){
  //   describe('without configuration object', function(){
  //
  //   });
  //
  //   describe('with configuration object', function(){
  //     beforeEach(function() {
  //       haiku = new Haiku({
  //         source: 'thetempleofdoom'
  //       });
  //     });
  //
  //     it('should set the Haiku.config object', function(){
  //       expect(Haiku.config.get('source')).toBe('thetempleofdoom');
  //     });
  //
  //     it('should set the instances config object', function(){
  //       expect(haiku.config).toBe(Haiku.config);
  //     });
  //   });
  // });

  describe('#read()', function(){
    beforeEach(function() {
      haiku = new Haiku({
        source: path.resolve(path.join('examples', 'basic'))
      });
    });

    it('should be defined', function(){
      expect(haiku.read).toBeDefined();
    });

    // NOTE: Jasmine is really pissing me off, really strange stuff with the
    // async, more than on desc block cannot have it statements with async
    // checks working the same variables, this is bad form but I am testing
    // everything in this single it statement...
    it('should emit a ready event, populate partials and layouts', function(){
      haiku.on('ready', mi6.asyncSpy);

      haiku.read();

      waitsFor(function(){ return oscarMike; }, 'haiku ready event', 10000);

      runs(function(){
        expect(mi6.asyncSpy).toHaveBeenCalled();

        expect(_.size(haiku.partials)).toBe(1);
        expect(haiku.partials.post).toBeDefined();

        expect(_.size(haiku.layouts)).toBe(1);
        expect(haiku.layouts.default).toBeDefined();
      });
    });
  });
});
