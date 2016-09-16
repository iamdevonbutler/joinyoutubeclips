var $navWrapper, callback;

function cache() {
  $navWrapper = $('#navWrapper');
}

function addItem(id, duration, active = false) {
  var item = `<li data-id="${id}" ${active ? 'class="active"' : ''}>${duration}</li>`;
  $navWrapper.append(item);
}

function addItems(data) {
  data.forEach((item, i) => {
    // set the first item as active.
    addItem(item.id, item.duration, i === 0);
  });
}

function updateItemState($el) {
  $navWrapper.children().removeClass('active');
  $el.addClass('active');
}

function bindEvents() {
  $navWrapper.on('click', 'li', (e, el) => {
    let $el = $(el);
    let active = $el.hasClass('active');
    if (!active) {
      updateItemState($el);
    }
    if (callback) {
      let id = $el.attr('data-id');
      callback.call(null, id);
    }
  });
}

module.exports.init = function(data) {
  cache();
  addItems(data);
  bindEvents();
}

module.exports.onChange = function(callback) {

}
