var Origami = require('haiku/origami')
  , _ = require('underscore')
;

var Collection = Origami.extend({
  initialize: function(){
    this.contents = [];
  }

  // Add an item to the collection
  , add: function(item){
    var collection = this;



    if (_.isArray(item)){
      _.each(item, function(i){
        collection.contents.push(i);
      });
    } else {
      collection.contents.push(item);
    }

    return this;
  }

  // retrieve all items from the collection
  , all: function(){
    return this.contents;
  }

  // retrieve the first item in the collection
  , first: function(){
    return _.first(this.contents);
  }

  , last: function(){
    return _.last(this.contents);
  }

  // find anything that passes the iterator function
  , find: function(iterator){
    return _(this.contents).chain().select(iterator);
  }
});

exports = module.exports = Collection;
