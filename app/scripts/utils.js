const queryString = require('query-string');

const self = module.exports;

self.throttle = function(callback, delay, callFirst = true) {
  var waiting, calledFirst;
  return function(...args) {
    if (!waiting) {
      waiting = true;
      if (!calledFirst && callFirst) {
        waiting = false;
        calledFirst = true;
        return callback.apply(null, args);
      }
      setTimeout(() => {
        waiting = false;
        return callback.apply(null, args);
      }, delay);
    }
  }
}

self.debounce = function(callback, timeout) {
  var clear;
  return function(...args) {
    clearTimeout(clear);
    clear = setTimeout(() => {
      return callback.apply(null, args);
    }, timeout);
  }
}

self.getSegmentFromData = function(data, id) {
  var keys = id.split('.');
  return data[keys[0]].segments[keys[1]];
};

self.filterArrayDupes = function filterArrayDupes(array) {
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
};

self.getInitialTimeRange = function(data) {
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
self.secondsToDisplayTime = function(seconds) {
  var minutes, hoursAndMinutes, remainder;
  if (!seconds && seconds != 0) return '';
  minutes = Math.floor(seconds/60);
  seconds = Math.floor(seconds - minutes*60);
  remainder = minutes % 60;
  seconds = seconds < 10 ? '0'+seconds : seconds;
  hoursAndMinutes = minutes > 60 ? Math.floor(minutes/60) + ':' + (remainder < 10 ? '0'+remainder : remainder) : minutes;
  return `${hoursAndMinutes}:${seconds}`;
}

self.getPlayerData = (query) => {
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

self.getClipRange = (data, id) => {
  var segment = self.getSegmentFromData(data, id);
  return {
    startTime: segment[0],
    endTime: segment[1],
  };
}

self.getDurationFromData = (data, id) => {
  var segments = self.getSegmentFromData(data, id);
  return segments[1] - segments[0];
}

self.getNextIdFromData = (data, id) => {
  var keys = id.split('.');
  var nextSegment = data[keys[0]].segments[parseInt(keys[1], 10) + 1];
  if (nextSegment) return keys[0] + '.' + (parseInt(keys[1], 10) + 1).toString();
  var nextVideo = data[parseInt(keys[0], 10) + 1];
  if (nextVideo) return (parseInt(keys[0], 10) + 1).toString() + '.0';
  return null;
}

self.debounce = (func, wait, immediate) => {
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
