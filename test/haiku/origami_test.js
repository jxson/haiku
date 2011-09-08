var helper = require('../test_helper')
  , Origami = require('haiku/origami')
  , testCase = require('nodeunit').testCase
;

exports['Origami'] = testCase({
  setUp: function(callback){
    this.properties = {
      isFolded: function(){ return this._folded; },
      fold: function(){
        this._folded = true;
        this.emit('fold');
      }
    };

    this.classProperties = {
      staticFunction: function(){ return true; }
    };

    this.Swan = Origami.extend(this.properties, this.classProperties);

    callback();
  },
  tearDown: function(callback){
    callback();
  },
  '.extend()': {
    'instance properties': function(test){
      var Swan = this.Swan
        , dollarSwan = new Swan({ paper: 'dollar bill' })
      ;

      test.ok(dollarSwan.isFolded);
      test.done();
    },
    'static/ class properties': function(test){
      var Swan = this.Swan;

      test.ok(Swan.staticFunction);
      test.ok(Swan.staticFunction());
      test.done();
    },
    'events': function(test){
      var Swan = this.Swan
        , graphPaperSwan = new Swan({ paper: 'graph paper' })
      ;

      test.expect(2);

      graphPaperSwan.on('fold', function(){
        test.ok(true);
        test.ok(this.isFolded());
        test.done();
      }).fold();
    }
  },
  '#get(attribute)': function(test){
    var snake = new Origami({
          rattles: 5,
          poison: true,
          name: 'Rattle Snake'
        });

    test.ok(snake.get);
    test.equal(snake.get('rattles'), 5);
    test.ok(snake.get('poison'));
    test.equal(snake.get('name'), 'Rattle Snake');
    test.done();
  },
  '#set(attributes)': function(test){
    var snake = new Origami();

    test.ok(snake.set);

    snake.set({ name: 'Diamondback' });

    test.ok(snake.attributes.name);
    test.equal(snake.get('name'), 'Diamondback');
    test.done();
  },
  'validations': {
    '#addError(hash)': function(test){
      var cat = new Origami();

      test.ok(cat.addError);

      cat.addError({ purr: 'This cat needs to purr' });

      test.ok(cat.errors);
      test.ok(cat.errors.purr);
      test.equal(cat.errors.purr, 'This cat needs to purr');
      test.done();
    },
    '#validate()': function(test){
      var tiger = new Origami();

      test.expect(5);

      // the validate method is not defined initially, it can be set as an
      // instance property when calling Origami.extend() or defined later
      test.ok(!tiger.validate);

      tiger.validate = function(attributes){
        if (!attributes.stripes) {
          this.addError({ stripes: "A tiger needs it's stripes!" });
        }

        test.ok(true);
      }

      // #validate() is automatically called when using #set()
      tiger.set({ stripes: false });

      test.ok(tiger.errors);
      test.ok(tiger.errors.stripes);
      test.equal(tiger.errors.stripes, "A tiger needs it's stripes!");
      test.done();
    },
    '#isValid()': function(test){
      var lion = new Origami();

      test.expect(3);

      test.ok(lion.isValid);
      test.ok(lion.isValid());

      lion.addError({ sound: "Lions don't bark!" });

      test.ok(! lion.isValid());
      test.done();
    }
  }
});

if (module == require.main) {
  var filename = __filename.replace(process.cwd(), '');

  require('nodeunit').reporters.default.run([filename]);
}