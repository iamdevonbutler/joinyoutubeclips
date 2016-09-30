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
    let playerKey = `${i}.0`;
    let videoInfo = info[i];
    let active = i === 0;
    let li = `<li ${active ? 'class="active"' : ''}>`;
    li += `<span data-id="${playerKey}" id="navItemTitle">${videoInfo.title}</span>`;
    li += `<a href="${videoInfo.url}"id="linkIcon" class="icon-link icon" target="_blank"></a>`;
    li += '<ul id="navItemClipsWrapper">';
    item.segments.forEach((segment, ii) => {
      let active = i === 0 && ii === 0;
      let id = `${i}.${ii}`;
      let {startTime, endTime} = utils.getClipRange(data, id);
      startTime = utils.secondsToDisplayTime(startTime);
      startTime = startTime === '0:00' ? '0' : startTime;
      endTime = utils.secondsToDisplayTime(endTime);
      li += `<li data-id="${id}" ${active ? 'class="navItem active"' : 'class="navItem"'}>${startTime} - ${endTime}</li>`;
    });
    html += li + '</ul></li>';
  });
  $navWrapper.html(html);
}

function changeTab($el) {
  $navWrapper.find('.navItem').removeClass('active');
  $el.addClass('active');
  // @todo this is kinda gross.
  $navWrapper.find('> li').removeClass('active');
  $el.parent().parent().addClass('active');
}

function bindEvents() {
  $navWrapper.on('click', '.navItem, #navItemTitle', (event) => {
    var $el;
    $el = $(event.target);
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
