Meteor.startup(function () {
  Template.post_categories.helpers({
    categoriesArray: function(){
      var postcategories = _.map(this.categories, function (categoryId) { // note: this.categories maybe be undefined
        return Categories.findOne(categoryId);
      });
      postcategories = _.filter(postcategories, function (category){
        return !category.disabled;
      });
      return postcategories;
    },
    categoryLink: function(){
      return Categories.getUrl(this);
    }
  });
});
