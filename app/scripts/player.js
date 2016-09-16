const player = require('youtube-player');
const utils = require('./utils');

var $playerWrapper,
  activeId = '0.0',
  players = [],
  data,
  _callback;

function cache(_data) {
  data = _data;
  $playerWrapper = $('#playerWrapper');
}

function bindEvents() {

}

function addItem(id, vid, active = false) {
  var item = `<li data-id="${id}" ${active ? 'class="active"' : ''}><div></div></li>`;
  $playerWrapper.append(item);
  var el = $playerWrapper.children().last().children()[0];
  players[id] = player(el, {
    videoId: vid,
  });
}

function addItems(data) {
  data.forEach((item, i) => {
    item.segments.forEach((segment, ii) => {
      let active = i === 0 && ii === 0;
      let id = `${i}.${ii}`;
      addItem(id, item.vid, active);
    });
  });
}

function getVideoById(id) {
  return $playerWrapper.find(`> [data-id="${id}"]`);
}

// @todo hack - this is an async operation and we really should return a promise.
function changeVideo(id) {
  var $el = getVideoById(id);
  console.log($el);
  $playerWrapper.children().removeClass('active');
  $el.addClass('active');
}

module.exports.init = function(data) {
  cache(data);
  addItems(data);
  // bindEvents();
}

module.exports.switch = function(id) {
  var segment = utils.getSegmentFromData(data, id);
  var startTime = segment[0];
  var endTime = segment[1];
  var player = players[id];
  players[activeId]
    .pauseVideo()
    .then(() => {
      activeId = id; // Update activeId in hacky closure state.
      player.seekTo(startTime).then(() => {
        player.playVideo().then(() => {
          changeVideo(id);
        });
      });

    });
}

module.exports.onChange = function(_callback) {
  callback = _callback;
}
