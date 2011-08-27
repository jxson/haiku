// Orgami provides a way to inherit, similar to backbone.js models, only using node.js conventions and eventemmiter 2

var Orgami = require('haiku/orgami')
  , colors = require('colors')
;

describe('Orgami', function() {
  describe('.extend(properties, classProperties)', function() {
    var Swan
      , eventTriggered
    ;

    beforeEach(function() {
      var properties = { wings: function(){ return 'paper'; } };
      var classProperties = { foo: function(){ return 'BAR'; } };

      Swan = Orgami.extend(properties, classProperties);
    });

    it('should have the specified INSTANCE properties', function() {
      var dollarSwan = new Swan();

      expect(dollarSwan.wings).toBeDefined();
      expect(dollarSwan.wings()).toBe('paper');
    });

    it('should have the specified CLASS properties', function() {
      expect(Swan.foo).toBeDefined();
      expect(Swan.foo()).toBe('BAR');
    });

    describe('events', function() {
      beforeEach(function() {
        Swan = Orgami.extend({
          fold: function(){ this.emit('fold'); }
        });
      });

      it('should support basic events', function() {
        graphPaperSwan = new Swan();
        graphPaperSwan.on('fold', function(){ eventTriggered = true; });

        graphPaperSwan.fold();

        expect(eventTriggered).toBe(true);
      });
    });
  });
});
