// var should = require('should')
//   , haiku = require('../../lib/haiku')
// ;
//
// describe('haiku.site', function(){
//   it('should exist', function(){
//     haiku.should.have.property('site');
//   });
//
//   it('should be a function', function(){
//     haiku.site.should.be.an.instanceof(Function);
//   });
//
//   it('should provide access the the Site class constructor', function(){
//     haiku.site.should.have.property('Site');
//     haiku.site.Site.should.be.an.instanceof(Function);
//   });
//
//   describe('haiku.site()', function(){
//     var site = haiku.site()
//     ;
//
//     it('should return an instance of haiku.Site');
//
//     it('should have the default options', function(){
//       var options = site.options
//       ;
//
//       options.should.exist;
//       options.source.should.equal(process.cwd());
//       options.baseURL.should.equal('/');
//       options.index.should.equal('index.html');
//     });
//
//     it('should have a directories object', function(){
//       var directories = site.directories
//       ;
//
//       directories.should.exist;
//       directories.build.should.include('build');
//       directories.content.should.include('content');
//       directories.templates.should.include('templates');
//       directories.public.should.include('public');
//     });
//
//     describe('.deploy()', function(){
//       it('should exist', function(){
//         haiku.site().deploy.should.exist;
//       });
//     }); // describe('description', ...
//   }); // describe('site object', ...
// }); // describe('haiku.site', ...