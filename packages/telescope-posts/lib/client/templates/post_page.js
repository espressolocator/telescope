var doSEOStuff = function (post) {

  // clear previously added meta tags
  DocHead.removeDocHeadAddedTags();

  var link = {rel: "canonical", href: post.getPageUrl(true)};
  DocHead.addLink(link);
  
  // Set SEO properties
  
  var seoProperties = {meta: {}};

  // Set site name
  DocHead.addMeta({property: "og:site_name", content: Settings.get("title")});

  // Set title
  Telescope.SEO.setTitle(post.title);

  // Set description
  if (!!post.body) {
    var description = Telescope.utils.trimWords(post.body, 100);
    Telescope.SEO.setDescription(description);
  }

  // Set image
  var image = post.thumbnailUrl || Settings.get("siteImage");
  if (!!image) {
    DocHead.addMeta({property: "twitter:card", content: "summary_large_image"});
    Telescope.SEO.setImage(Telescope.utils.addHttp(image));
  }

  // Set Twitter username
  if (!!Settings.get("twitterAccount")) {
    DocHead.addMeta({property: "twitter:site", content: Settings.get("twitterAccount")});
  }
};

Template.post_page.onCreated(function () {

  var template = this;

  // initialize the reactive variables
  template.ready = new ReactiveVar(false);

  // Autorun 3: when subscription is ready, update the data helper's terms
  template.autorun(function () {
    var postId = FlowRouter.getParam("_id"); // ⚡ reactive ⚡

    template.ready.set(false);
    var postSubscription = Telescope.subsManager.subscribe('singlePost', postId);
    var postUsersSubscription = Telescope.subsManager.subscribe('postUsers', postId);
    var commentSubscription = Telescope.subsManager.subscribe('commentsList', {view: 'postComments', postId: postId});

    var subscriptionsReady = postSubscription.ready(); // ⚡ reactive ⚡
    // if subscriptions are ready, set terms to subscriptionsTerms and update SEO stuff
    if (subscriptionsReady) {
      template.ready.set(true);
      var post = Posts.findOne(postId);
      if (post) {
        doSEOStuff(post);
      } else {
        DocHead.addMeta({
          name: "name",
          property: "prerender-status-code",
          content: "404"
        });
        DocHead.addMeta({
          name: "name",
          property: "robots",
          content: "noindex, nofollow"
        });
      }
    }
  });

});

Template.post_page.helpers({
  ready: function () {
    return Template.instance().ready.get();
  },
  post: function () {
    return Posts.findOne(FlowRouter.getParam("_id"));
  },
  canView: function () {
    var post = this;
    return Users.can.viewPost(Meteor.user(), post);
  },
  isPending: function () {
    return this.status === Posts.config.STATUS_PENDING;
  }
});

Template.post_page.rendered = function(){
  $('body').scrollTop(0);
};
