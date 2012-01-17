var should = require('should')
  , path = require('path')
  , haiku = require('../../lib/haiku/index.js')
  , bin = path.join(haiku.directories, 'bin', 'haiku')
  , exec = require('child_process').exec
;

describe('haiku deploy # command', function(){
  describe('--help', function(){
    var command
    ;

    before(function(done){
      exec(bin + ' deploy --help', function(error, stdout, stderr){
        command = { error: error
        , stdout: stdout
        , stderr: stderr
        };

        done();
      });
    });

    it('should not crash', function(){
      should.not.exist(command.error);
    });

    it('should not spill anything to stderr', function(){
      command.stderr.should.be.empty;
    });

    it('should display the help', function(){
      command.stdout.should.not.be.empty;
      command.stdout.should.include('Usage: deploy [options]');
    });
  }); // describe('--help', ...

  describe('when there is no config', function(){
    describe('with options', function(){
      describe('for s3', function(){

        describe('that are invalid', function(){

        }); // describe('that are invalid', ...
      }); // describe('for s3', ...

      describe('for ftp', function(){

        describe('that are invalid', function(){

        }); // describe('that are invalid', ...
      }); // describe('for ftp', ...
    }); // describe('with options', ...

    describe('without options', function(){
      it('should ask you which deploy recipe to use');

      describe('using s3', function(){
        it('should ask you for your s3 credentials and ask to save them');
      }); // describe('using s3', ...

      describe('using ftp', function(){
        it('should ask you for your ftp credentials and ask to save them');
      }); // describe('using ftp', ...
    }); // describe('without options', ...
  }); // describe('when there is no config', ...

  describe('when there is a config', function(){
    describe('for only the default deploy target', function(){
      describe('using s3', function(){

      }); // describe('using s3', ...

      describe('using ftp', function(){

      }); // describe('using ftp', ...
    }); // describe('# for only the default deploy target', ...

    describe('with multiple deploy targets', function(){
      it('should show the help with the deploy commands');

      describe('deploying to a target', function(){
        it('should beam the site using the config specified recipe');
      }); // describe('deploying to a target', ...
    }); // describe('with multiple deploy targets', ...
  }); // describe('when there is a config', ...
}); // describe('haiku deploy # command', ...
