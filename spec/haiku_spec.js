
var Haiku = require('haiku')
  , _ = require('underscore')
;

describe('Haiku', function(){
  var source
    , haiku
  ;

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

  describe('new Haiku(config);', function(){
    describe('without configuration object', function(){

    });

    describe('with configuration object', function(){
      beforeEach(function() {
        haiku = new Haiku({
          source: 'thetempleofdoom'
        });
      });

      it('should set the Haiku.config object', function(){
        expect(Haiku.config.get('source')).toBe('thetempleofdoom');
      });

      it('should set the instances config object', function(){
        expect(haiku.config).toBe(Haiku.config);
      });
    });
  });
});
