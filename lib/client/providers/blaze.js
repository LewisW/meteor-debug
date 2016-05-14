BlazeProvider = {};

// Events
BlazeProvider.events = function(original) {
  return function(dict) {
    var self = this;
    _.each(dict, function(fn, name) {
      dict[name] = function() {
        var that = this;
        var args = arguments;
        var info = {
          name: name,
          view: self.viewName
        };
        StoreManager.trackEvent('event', info);
        return fn.apply(that, args);
      };
    });

    return original.call(self, dict);
  };
};

var Template;

if (Package['templating']) {
  var Template = Package['templating'].Template;
} else if (Package['peerlibrary:blaze-components']) {
  var Template = Package['peerlibrary:blaze-components'].Template;
}

if (Template) {
  Utils.override(Template.prototype, 'events', BlazeProvider.events);
}
