const queryString = require('query-string');

function getSegmentFromData(data, id) {
  var keys = id.split('.');
  return data[keys[0]].segments[keys[1]];
}

// @todo hours...
module.exports.secondsToDisplayTime = function(seconds) {
  var minutes, remainder;
  minutes = Math.floor(seconds/60);
  seconds = Math.floor(seconds - minutes*60);
  remainder = minutes % 60;
  seconds = seconds < 10 ? '0'+seconds: seconds;
  minutes = minutes > 60 ? Math.floor(minutes/60) + ':' + (remainder < 10 ? '0'+remainder : remainder) : minutes;
  return `${minutes}:${seconds}`;
}

module.exports.getPlayerData = (query) => {
  var parsed, data;
  parsed = queryString.parse(query);
  data = Object.keys(parsed).map((vid) => {
    var segments;
    segments = Array.isArray(parsed[vid]) ? [...new Set(parsed[vid].join(',').split(','))] : parsed[vid].split(',');
    segments = segments.map(time => time.split('-'));
    return {
      vid,
      segments,
    };
  });
  return data;
}

module.exports.getSegmentFromData = getSegmentFromData;

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
