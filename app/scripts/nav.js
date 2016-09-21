const utils = require('./utils');

var $navWrapper,
  __tabChangeCallback__,
  __getVideoInfoCallback__;

function cache() {
  $navWrapper = $('#navWrapper');
}

function getVideoInfo(playerKey) {
  return __getVideoInfoCallback__.call(null, playerKey);
}

function getNavItemHTML(id, duration, active = false) {
  var item;
  item = `<li data-id="${id}" ${active ? 'class="active"' : ''}>${duration}</li>`;
  return item;
}

function buildNav(data) {
  var html = '<ul>';
  data.forEach((item, i) => {
    let li = '<li>';
    let playerKey = `${i}.0`;
    getVideoInfo(playerKey).then((info) => {
      console.log(info); 
    });
    item.segments.forEach((segment, ii) => {
      var active, id, duration;
      active = i === 0 && ii === 0;
      id = `${i}.${ii}`;
      duration = utils.secondsToDisplayTime(segment[1] - segment[0]);
      getNavItemHTML(id, duration, active);
    });
    html += li + '</ul>';
  });
  $navWrapper.append(html);
}

function changeTab($el) {
  $navWrapper.children().removeClass('active');
  $el.addClass('active');
}

function bindEvents() {
  $navWrapper.on('click', 'li', (e) => {
    var $el, active;
    $el = $(e.target);
    active = $el.hasClass('active');
    if (!active) {
      changeTab($el);
    }
    if (__tabChangeCallback__) {
      let id = $el.attr('data-id');
      __tabChangeCallback__.call(null, id);
    }
  });
}

function getTabById(id) {
  return $navWrapper.find(`> [data-id="${id}"]`);
}

module.exports.init = (data) => {
  cache();
  buildNav(data);
  bindEvents();
}

module.exports.switchNav = (id) => {
  var $el;
  $el = getTabById(id);
  changeTab($el);
}

module.exports.onTabChange = (callback) => {
  __tabChangeCallback__ = callback;
}

module.exports.onVideoInfoRequest = (callback) => {
  __getVideoInfoCallback__ = callback;
}
