const queryString = require('query-string');

module.exports.secondsToDisplayTime = function(seconds) {
  var minutes = Math.floor(seconds/60);
  var seconds = seconds - minutes*60;
  return `${minutes}:${seconds}`;
}

module.exports.getPlayerData = function(query) {
  return queryString.parse(query);
}

module.exports.getSegmentFromData = function(data, id) {
  var keys = id.split('.');
  return data[keys[0]].segments[keys[1]];
}
