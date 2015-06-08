var SubHandlers = {
  timeline: [],
  listeners: []
};
var uniqueId = 0;

Meteor.methods({
  "kadira.debug.updateTimeline": function(browserId, clientId, data) {
    check(browserId, String);
    check(clientId, String);
    check(data, Object);

    // update timeline
    SubHandlers.timeline.forEach(function(sub) {
      var id = "id" + ++uniqueId;
      sub.added('kdTimeline', id, {
        browserId: browserId,
        clientId: clientId,
        data: data
      });
      sub.removed('kdTimeline', id);
    });
  }
});

Meteor.publish('kadira.debug.timeline', function() {
  this.ready();
  var sub = this;

  SubHandlers.timeline.push(sub);
  updateListenersCount();
  sub.onStop(function() {
    var index = SubHandlers.timeline.indexOf(sub);
    SubHandlers.timeline.splice(index, 1);
    updateListenersCount();
  });
});

Meteor.publish('kadira.debug.listeners', function() {
  var sub = this;
  var listenerCount = SubHandlers.listeners.length;
  sub.added('kdInfo', 'listeners-count', {count: listenerCount});
  sub.ready();

  SubHandlers.listeners.push(sub);
  sub.onStop(function() {
    var index = SubHandlers.listeners.indexOf(sub);
    SubHandlers.timeline.splice(index, 1);
  });
});

function updateListenersCount() {
  SubHandlers.listeners.forEach(function(sub) {
    var listenerCount = SubHandlers.listeners.length;
    sub.changed('kdInfo', 'listeners-count', {count: listenerCount});
  });
}