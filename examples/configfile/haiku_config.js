
module.exports = {
  host: "127.0.0.1",
  port: 1337,
  root: __dirname,
  contentDir: "app/markdown",
  templatesDir: "assets/templates",
  publicDir: "public",
  baseURL: 'http://domain.tld/',
  attributes: {
    title: 'Awesome Site, Crazy Directory Structure',
    recent: function(){
      var site = this;

      return site.collections.posts.pages.slice(0, 2)
    }
  }
};
