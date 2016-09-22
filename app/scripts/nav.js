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

// @todo meh...
function buildNav(data, info) {
  var html = '';
  data.forEach((item, i) => {
    let li = '<li>';
    let playerKey = `${i}.0`;
    let videoInfo = info[i];
    let active = i === 0;
    li += `<a href="${videoInfo.url}" id="navItemTitle" target="_blank" ${active ? 'class="active"' : ''}>${videoInfo.title}</a>`;
    li += '<ul id="navItemClipsWrapper">';
    item.segments.forEach((segment, ii) => {
      let active = i === 0 && ii === 0;
      let id = `${i}.${ii}`;
      let {startTime, endTime} = utils.getClipRange(data, id);
      startTime = utils.secondsToDisplayTime(startTime);
      endTime = utils.secondsToDisplayTime(endTime);
      li += `<li data-id="${id}" ${active ? 'class="navItem active"' : 'class="navItem"'}>${startTime} - ${endTime}</li>`;
    });
    html += li + '</ul></li>';
  });
  $navWrapper.html(html);
}

function changeTab($el) {
  $navWrapper.find('.navItem').removeClass('active');
  $navWrapper.find('#navItemTitle').removeClass('active');
  $el.addClass('active');
  // @todo this is kinda gross.
  $el.parent().parent().find('> a').addClass('active');
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
