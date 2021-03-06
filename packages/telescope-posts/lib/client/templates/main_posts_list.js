Template.main_posts_list.helpers({
  customTemplate: function () {
    var currentView = FlowRouter.getQueryParam("view") || Session.get("defaultView") || Settings.get("defaultView", "top");
    var currentMenuItem = _.findWhere(Telescope.menuItems.viewsMenu, {name: currentView});
    return currentMenuItem && currentMenuItem.viewTemplate;
  },
  arguments: function () {
    FlowRouter.watchPathChange();
    var terms = _.clone(FlowRouter.current().queryParams);
    terms.enableCache = true;

    // if user is logged in, add their id to terms
    if (Meteor.userId()) {
      terms.currentUserId = Meteor.userId();
    }

    if (!terms.view) {
      terms.view = Session.get("defaultView") || Settings.get('defaultView', 'top');
    }

    return {
      terms: terms,
      options: {
        loadMoreBehavior: Settings.get("loadMoreBehavior", "button")
      }
    };
  }
});
