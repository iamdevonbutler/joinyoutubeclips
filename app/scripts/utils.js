const queryString = require('query-string');

function getSegmentFromData(data, id) {
  var keys = id.split('.');
  return data[keys[0]].segments[keys[1]];
}

function filterArrayDupes(array) {
  var set = new Set();
  array.forEach((item) => {
    if (Array.isArray(item)) {
      set.add(filterArrayDupes(item));
    }
    else {
      set.add(item);
    }
  });
  return [...set];
}

module.exports.getInitialTimeRange = function(data) {
  var startTime, endTime;
  if (!data) {
    startTime = 0;
    // endTime = player.getDuration
  }
  else {

  }
  return {startTime, endTime};
}

// @todo hours...
module.exports.secondsToDisplayTime = function(seconds) {
  var minutes, hoursAndMinutes, remainder;
  minutes = Math.floor(seconds/60);
  seconds = Math.floor(seconds - minutes*60);
  remainder = minutes % 60;
  seconds = seconds < 10 ? '0'+seconds : seconds;
  hoursAndMinutes = minutes > 60 ? Math.floor(minutes/60) + ':' + (remainder < 10 ? '0'+remainder : remainder) : minutes;
  return `${hoursAndMinutes}:${seconds}`;
}

module.exports.getPlayerData = (query) => {
  var parsed, keys, data;
  const segment = [0, null];
  parsed = queryString.parse(query);
  keys = Object.keys(parsed);
  data = keys.map((vid) => {
    var segments, obj;
    segments = [];
    obj = parsed[vid];
    if (!obj) return null;
    segments = obj.split(',').map(item => Object.assign([], segment, item.split('-')));
    segments = filterArrayDupes(segments);
    return {
      vid,
      segments,
    };
  }).filter(Boolean);
  return data.length ? data : null;
}

module.exports.getSegmentFromData = getSegmentFromData;

module.exports.filterArrayDupes = filterArrayDupes;

module.exports.getClipRange = (data, id) => {
  var segment = getSegmentFromData(data, id);
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
