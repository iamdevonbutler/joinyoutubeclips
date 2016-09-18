const utils = require('./utils');

var $navWrapper,
  __callback__;

function cache() {
  $navWrapper = $('#navWrapper');
}

function addItem(id, duration, active = false) {
  var item = `<li data-id="${id}" ${active ? 'class="active"' : ''}>${duration}</li>`;
  $navWrapper.append(item);
}

function addItems(data) {
  data.forEach((item, i) => {
    item.segments.forEach((segment, ii) => {
      let active = i === 0 && ii === 0;
      let id = `${i}.${ii}`;
      let duration = utils.secondsToDisplayTime(segment[1] - segment[0]);
      addItem(id, duration, active);
    });
  });
}

function changeTab($el) {
  $navWrapper.children().removeClass('active');
  $el.addClass('active');
}

function bindEvents() {
  $navWrapper.on('click', 'li', (e) => {
    let $el = $(e.target);
    let active = $el.hasClass('active');
    if (!active) {
      changeTab($el);
    }
    if (__callback__) {
      let id = $el.attr('data-id');
      __callback__.call(null, id);
    }
  });
}

function getTabById(id) {
  return $navWrapper.find(`> [data-id="${id}"]`);
}

module.exports.init = (data) => {
  cache();
  addItems(data);
  bindEvents();
}

module.exports.onTabChange = (callback) => {
  __callback__ = callback;
}

module.exports.switchNav = (id) => {
  var $el = getTabById(id);
  changeTab($el);
}
