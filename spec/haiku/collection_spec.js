var Collection = require('haiku/collection')
  , colors = require('colors')
  , _ = require('underscore')
;

describe('Collection', function(){
  var collection
    , stamp
    , stormtroopers
    , droids
    , iterator
  ;

  beforeEach(function() {
    collection = new Collection();

    stamp = { valuable: false, nerdy: true }

    stormtroopers = [
        { id: 'TK-2134145' }
      , { id: 'TK-9538624' }
      , { id: 'TK-1386564' }
    ];

    droids =  [
        { name: 'C3PO' }
      , { name: 'R2D2' }
    ];
  });

  describe('#add(item)', function(){
    it('should be defined', function(){
      expect(collection.add).toBeDefined();
    });

    it('should add to the contents array', function(){
      collection.add(stamp)
      expect(collection.contents).toContain(stamp)
    });

    it('should return the collection instance', function(){
      expect(collection.add(stamp)).toBe(collection)
    });

    describe('when `item` is an array', function(){
      it('should add each of the items in the array', function(){
        collection.add(droids);

        expect(collection.contents).toEqual(droids);
      });
    });
  });

  describe('#all()', function(){
    beforeEach(function() {
      collection = new Collection();
      collection.add(stormtroopers);
    });

    it('should be defined', function(){
      expect(collection.all).toBeDefined();
    });

    it('should return everything that has been added', function(){
      expect(collection.all()).toEqual(stormtroopers);
    });
  });

  describe('#first()', function(){
    beforeEach(function() {
      collection = new Collection();
      collection.add(stormtroopers);
    });

    it('should be defined', function(){
      expect(collection.first).toBeDefined();
    });

    it('should return the first trooper', function(){
      expect(collection.first()).toEqual(stormtroopers[0]);
    });
  });

  describe('#last()', function(){
    beforeEach(function() {
      collection = new Collection();
      collection.add(stormtroopers);
    });

    it('should be defined', function(){
      expect(collection.last).toBeDefined();
    });

    it('should return the last troooper', function(){
      expect(collection.last()).toEqual(stormtroopers[2]);
    });
  });

  describe('#find(iterator)', function(){
    beforeEach(function() {
      iterator = function(trooper){
        return trooper.id === 'TK-9538624'
      };

      collection = new Collection();
      collection.add(stormtroopers);
    });

    it('should be defined', function(){
      expect(collection.find).toBeDefined();
    });

    it('should retrieve anything that passes the iterator', function(){
      expect(collection.find(iterator).value())
        .toEqual([ { id: 'TK-9538624' } ]);
    });

    it('should be chainable with _', function(){
      expect(collection.find(iterator).first().value())
        .toEqual({ id: 'TK-9538624' });
    });
  });
});
