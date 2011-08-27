(function(){
  var path = require('path');

  require.paths.unshift(path.join(__dirname, '..', 'lib'));

  // var haiku = require('haiku')



  // beforeEach(function(){
  //   this.addMatchers({
  //     toHaveProperty: function(prop) {
  //       try {
  //         return prop in this.actual;
  //       }
  //       catch (e) {
  //         return false;
  //       }
  //     }
  //   });
  // });

})();