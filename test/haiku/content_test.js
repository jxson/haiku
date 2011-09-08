var helper = require('../test_helper')
  , Haiku = require('haiku')
  , Content = require('haiku/content')
  , path = require('path')
  , _ = require('underscore')
  , testCase = require('nodeunit').testCase
;

exports['Content'] = testCase({
  setUp: function(callback){
    var source = path.resolve(path.join('examples', 'basic'))
      , indexpath = path.join(source, 'content', 'index.mustache')
      , haiku = new Haiku({ source: source })
    ;

    this.content = new Content({ file: indexpath }, haiku);

    callback();
  },
  tearDown: function(callback){
    callback();
  },
  '#read()': function(test){
    var index = this.content;

    test.expect(2);
    test.ok(index.read, "index.read doesn't exist");

    index.on('ready', function(){
      test.ok(true, 'ready event not fired');
      test.done();
    });

    index.read();
  },
  '#parser()': {
    'when the file attribute is set': {
      'with markdown extensions': function(test){
        var index = this.content;

        _.each(['.md', '.markdown', '.mdown', '.mkdn', '.mkd'], function(ext){
          index.set({ file: 'markdown-file' + ext });

          test.equal(index.parser(), 'markdown');
        });

        test.done();
      },
      'with textile extensions': function(test){
        var index = this.content;

        index.set({ file: 'textile-file.textile' });

        test.equal(index.parser(), 'textile');
        test.done();
      },
      'with html extensions': function(test){
        var index = this.content;

        _.each(['.mustache', '.html'], function(ext){
          index.set({ file: 'html-file' + ext });

          test.equal(index.parser(), undefined);
        });

        test.done();
      }
    },
    'when the file attribute is NOT set': function(test){
      test.ok(this.content.parser);
      test.equal(this.content.parser(), undefined);
      test.done();
    }
  },
  '#parse(markdown)': {
    'when the parser is defined': {
      'when the parser is "markdown"': function(test){
        var index = this.content
          , input = 'this is _markdown_ \n\nparagraph\n'
          , output = '<p>this is <em>markdown</em></p>\n\n<p>paragraph</p>'
        ;

        index.parser = function(){ return 'markdown'; }

        test.equal(index.parse(input), output);
        test.done();
      },
      'when the parser is textile': function(test){
        var index = this.content
          , input = 'this is *textile* \n\nparagraph\n'
          , output = '<p>this is <strong>textile</strong> </p>\n<p>paragraph</p>\n'
        ;

        index.parser = function(){ return 'textile'; }

        test.equal(index.parse(input), output);
        test.done();
      },
      'when the parser is NOT defined': function(test){
        var index = this.content
          , input = 'nothing \n\n'
          , output = 'nothing \n\n'
        ;

        index.parser = function(){ return; }

        test.equal(index.parse(input), output);
        test.done();
      }
    }
  },
  '#buildpath': {
    'when the file attribute is set to': {
      'index.mustache': function(test){
        test.equal(this.content.buildpath(), 'index.html');
        test.done();
      },
      'atom.xml.mustache': function(test){
        var feed = this.content;

        feed.set({ file: 'somedir/atom.xml.mustache'});

        test.equal(this.content.buildpath(), 'somedir/atom.xml');
        test.done();
      },
      'foo.html.mustache': function(test){
        var feed = this.content;

        feed.set({ file: 'foo.html.mustache'});

        test.equal(this.content.buildpath(), 'foo.html');
        test.done();
      },
      'foo.html': function(test){
        var feed = this.content;

        feed.set({ file: 'foo.html'});

        test.equal(this.content.buildpath(), 'foo.html');
        test.done();
      }
    },
    'when the file attribute is NOT set': function(test){
      var index = this.content;

      index.set({ file: null});

      test.equal(index.buildpath(), undefined);
      test.done();
    }
    //
    //   describe('when the file attribute is NOT set', function(){
    //     beforeEach(function(){
    //       index.set({ file: null });
    //     });
    //
    //     it('should return undefined', function(){
    //       expect(index.url()).not.toBeDefined();
    //     });
    //   });
    // });
    //
  }
  // '#url()': function(test){
  //   // should simply append the hostname or '/' to the buildpath
  //   test.done();
  // }
});

exports['Content #extractAttributesFromFile(callback)'] = testCase({
  setUp: function(callback){
    var source = path.resolve(path.join('examples', 'basic'))
      , indexpath = path.join(source, 'content', 'index.mustache')
      , haiku = new Haiku({ source: source })
    ;

    this.content = new Content({ file: indexpath }, haiku);

    callback();
  },
  tearDown: function(callback){
    callback();
  },
  'on successful file read': {
    'when there is front matter': function(test){
      var index = this.content;

      test.equal(index.get('title'), undefined);

      test.expect(3);

      index.extractAttributesFromFile(function(){
        test.ok(true, 'index.extractAttributesFromFile callback triggered');
        test.equal(index.get('title'), 'This is the homepage');
        test.done();
      });
    }
  }
});

if (module == require.main) {
  var filename = __filename.replace(process.cwd(), '');

  require('nodeunit').reporters.default.run([filename]);
}
