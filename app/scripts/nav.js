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

function buildNav(data, info) {
  var html = '';
  data.forEach((item, i) => {
    let li = '<li>';
    let playerKey = `${i}.0`;
    let videoInfo = info[i];
    li += `<a href="${videoInfo.url}" id="navItemTitle" target="_blank">${videoInfo.title}</a>`;
    li += '<ul id="navItemClipsWrapper">';
    item.segments.forEach((segment, ii) => {
      var active, id, duration;
      active = i === 0 && ii === 0;
      id = `${i}.${ii}`;
      duration = utils.secondsToDisplayTime(segment[1] - segment[0]);
      li += `<li data-id="${id}" ${active ? 'class="navItem active"' : 'class="navItem"'}>${duration}</li>`
    });
    html += li + '</ul></li>';
  });
  $navWrapper.html(html);
}

function changeTab($el) {
  $navWrapper.find('.navItem').removeClass('active');
  $el.addClass('active');
}

function bindEvents() {
  $navWrapper.on('click', '.navItem', (e) => {
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
  return $navWrapper.find(`.navItem[data-id="${id}"]`);
}

module.exports.init = (data) => {
  cache();
  getVideoInfo().then((info) => {
    buildNav(data, info);
    bindEvents();
  });

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
