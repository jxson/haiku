
var Haiku = require('haiku')
  , _ = require('underscore')
;

describe('Haiku', function(){
  var source
    , haiku
  ;

  // read the haiku source content and return a new haiku instance
  describe('.read(source)', function(){
    // NOTE: This would be a nicer syntax:
    //
    //    its('read').shouldBeDefined();
    it("should have the class property `read`", function(){
      expect(Haiku.read).toBeDefined();
    });

    describe('when `source` is NOT defined', function(){
      // it should throw an err if no source is defined
    });


    describe('when `source` is defined', function(){
      // it should return an instance of a haiku
    });
  });

  describe('.configure(configObject)', function(){
    it("should have .configure", function(){
      expect(Haiku.configure).toBeDefined();
    });

    it('should have .config after calling .configure()', function(){
      var config = Haiku.configure({source: 'foo'});

      expect(Haiku.config).toBeDefined();
      expect(Haiku.config.get('source')).toBe('foo')
    });
  });
});
