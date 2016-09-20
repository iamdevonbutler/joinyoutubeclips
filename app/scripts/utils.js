const queryString = require('query-string');

module.exports.secondsToDisplayTime = function(seconds) {
  var minutes = Math.floor(seconds/60);
  var seconds = seconds - minutes*60;
  seconds = seconds < 10 ? '0'+seconds: seconds;
  return `${minutes}:${seconds}`;
}

module.exports.getPlayerData = (query) => {
  return queryString.parse(query);
}

module.exports.getSegmentFromData = (data, id) => {
  var keys = id.split('.');
  return data[keys[0]].segments[keys[1]];
}

module.exports.getClipRange = (data, id) => {
  var segment = this.getSegmentFromData(data, id);
  return {
    startTime: segment[0],
    endTime: segment[1],
  };
}

module.exports.getDurationFromData = (data, id) => {
  var segments = this.getSegmentFromData(data, id);
  return segments[1] - segments[0];
}

module.exports.getNextIdFromData = (data, id) => {
  var keys = id.split('.');
  var nextSegment = data[keys[0]].segments[parseInt(keys[1], 10) + 1];
  if (nextSegment) return keys[0] + '.' + (parseInt(keys[1], 10) + 1).toString();
  var nextVideo = data[parseInt(keys[0], 10) + 1];
  if (nextVideo) return (parseInt(keys[0], 10) + 1).toString() + '.0';
  return null;
}

module.exports.debounce = (func, wait, immediate) => {
	var timeout;
	return () => {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};

}
