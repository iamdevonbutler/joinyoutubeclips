const utils = require('./utils');

var $navWrapper,
  __tabChangeCallback__;

function cache() {
  $navWrapper = $('#navWrapper');
}

function addItem(id, duration, active = false) {
  var item;
  item = `<li data-id="${id}" ${active ? 'class="active"' : ''}>${duration}</li>`;
  $navWrapper.append(item);
}

function addItems(data) {
  data.forEach((item, i) => {
    item.segments.forEach((segment, ii) => {
      var active, id, duration;
      active = i === 0 && ii === 0;
      id = `${i}.${ii}`;
      duration = utils.secondsToDisplayTime(segment[1] - segment[0]);
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
  addItems(data);
  bindEvents();
}

module.exports.onTabChange = (callback) => {
  __tabChangeCallback__ = callback;
}

module.exports.switchNav = (id) => {
  var $el;
  $el = getTabById(id);
  changeTab($el);
}
