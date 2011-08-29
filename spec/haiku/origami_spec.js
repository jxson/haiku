var Origami = require('haiku/origami')
  , colors = require('colors')
  , _ = require('underscore')
;

describe('Origami', function(){
  describe('.extend(properties, classProperties)', function(){
    var Swan
      , eventTriggered
    ;

    beforeEach(function(){
      var properties = { wings: function(){ return 'paper'; } };
      var classProperties = { foo: function(){ return 'BAR'; } };

      Swan = Origami.extend(properties, classProperties);
    });

    it('should have the specified properties on new instances', function(){
      var dollarSwan = new Swan();

      expect(dollarSwan.wings).toBeDefined();
      expect(dollarSwan.wings()).toBe('paper');
    });

    it('should have the specified classProperties', function(){
      expect(Swan.foo).toBeDefined();
      expect(Swan.foo()).toBe('BAR');
    });

    describe('events', function(){
      beforeEach(function(){
        Swan = Origami.extend({
          fold: function(){
            this._folded = true;
            this.emit('fold');
          }
        });
      });

      it('should support basic event emitting and listening', function(){
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

  describe('#get(attr)', function(){
    var snake;

    beforeEach(function(){
      snake = new Origami({
        rattles: 5,
        poison: true,
        name: 'Rattle Snake'
      });
    });

    it('should have the method #get()', function(){
      expect(snake.get).toBeDefined();
    });

    it('should return the attribute from the instance', function(){
      expect(snake.get('rattles')).toBe(5);
      expect(snake.get('poison')).toBe(true);
      expect(snake.get('name')).toBe('Rattle Snake');
    });
  });

  describe('#set(attrs)', function(){
    var snake;

    beforeEach(function(){
      snake = new Origami();
    });

    it('should have the method #set()', function(){
      expect(snake.set).toBeDefined();
    });

    it('should extend the instance\s `attributes` hash', function(){
      snake.set({ name: 'Diamond Back' });

      var hasNameAttribute = _(snake.attributes)
            .chain()
            .keys()
            .include('name')
            .value()
      ;

      expect(hasNameAttribute).toBeTruthy();
      expect(snake.attributes.name).toBe('Diamond Back');
      expect(snake.get('name')).toBe('Diamond Back');
    });
  });

  describe('validations', function(){
    var Animal, tiger, houseCat;

    describe('#addError(hash)', function(){
      beforeEach(function() {
        Animal = Origami.extend({
          validate: function(attrs){
            if (attrs.stripes === false && attrs.name === 'tiger'){
              this.addError({ stripes: "A tiger needs it's stripes!" });
            }

            if (attrs.sound === 'bark'){
              this.addError({ sound: "Cats don't make dog sounds" });
            }
          }
        });

        houseCat = new Animal();
      });

      it('should be defined', function(){
        expect(houseCat.addError).toBeDefined();
      });

      it('should populate the instances error object', function(){
        houseCat.addError({ purr: 'This cat needs to purr!' });

        expect(houseCat.errors).toBeDefined();
        expect(_.keys(houseCat.errors)).toContain('purr');
        expect(houseCat.errors.purr).toBe('This cat needs to purr!');
      });
    });

    describe('#validate(attrs)', function(){
      beforeEach(function() {
        tiger = new Animal();
      });

      it('should exist', function(){
        expect(tiger.validate).toBeDefined();
      });

      it('should be triggered on #set()', function(){
        spyOn(tiger, 'validate').andCallThrough();

        tiger.set({ stripes: false });

        expect(tiger.validate).toHaveBeenCalledWith({ stripes: false });
      });

      it('should check combined attrs and the attributes', function(){
        tiger.set({ name: 'tiger' });

        spyOn(tiger, 'addError').andCallThrough();

        tiger.set({ stripes: false });

        expect(tiger.addError)
          .toHaveBeenCalledWith({ stripes: "A tiger needs it's stripes!" });
      });
    });

    describe('#isValid(attrs)', function(){
      beforeEach(function() {
        lion = new Animal();
      });

      it('should be defined', function(){
        expect(lion.isValid).toBeDefined();
      });

      it('should be true if valid', function(){
         expect(lion.isValid()).toBeTruthy();
       });

      it('should be false if invalid', function(){
        lion.set({ sound: 'bark' });

        expect(lion.isValid()).toBeFalsy();
      });
    });
  });
});
