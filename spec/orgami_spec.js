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

    it('should have the specified properties on new instances', function() {
      var dollarSwan = new Swan();

      expect(dollarSwan.wings).toBeDefined();
      expect(dollarSwan.wings()).toBe('paper');
    });

    it('should have the specified classProperties', function() {
      expect(Swan.foo).toBeDefined();
      expect(Swan.foo()).toBe('BAR');
    });

    describe('events', function() {
      beforeEach(function() {
        Swan = Orgami.extend({
          fold: function(){
            this._folded = true;
            this.emit('fold');
          }
        });
      });

      it('should support basic event emitting and listening', function() {
        graphPaperSwan = new Swan();
        graphPaperSwan.on('fold', function(){
          eventTriggered = true;

          expect(this._folded).toBe(true);
        });

        graphPaperSwan.fold();

        expect(eventTriggered).toBe(true);
      });
    });
  });
});
