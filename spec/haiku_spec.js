
var Haiku = require('haiku')
  , _ = require('underscore')
  , path = require('path')
;

describe('Haiku', function(){
  var source
    , haiku
    , mi6 = { spy: function(){} }
  ;

  beforeEach(function() {
    spyOn(mi6, 'spy');
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

  describe('#read()', function(){
    beforeEach(function() {
      haiku = new Haiku({
        source: path.resolve(path.join('..', 'examples', 'basic'))
      });
    });

    it('should be defined', function(){
      expect(haiku.read).toBeDefined();
    });

    it('should emit a "ready" function', function(){
      haiku.on('ready', mi6.spy);

      haiku.read();

      expect(mi6.spy).toHaveBeenCalled();
    });
  });

  // describe('#find(iterator)', function(){
  //   // beforeEach(function() {
  //   //   haiku = new Haiku({
  //   //     source: path.resolve(path.join('examples', 'basic'))
  //   //   });
  //   // });
  //   //
  //   // it('should be defined', function(){
  //   //
  //   // });
  //   //
  //   // it('should return an array of content', function(){
  //   //
  //   // });
  //   //
  //   // it('should have a #first() method', function(){
  //   //
  //   // });
  //
  //   // it('description', function(){
  //   //   console.log('config', Haiku.config);
  //   // });
  // });
});
