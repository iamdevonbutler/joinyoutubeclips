const utils = require('./utils');

class Nav {

  constructor(data) {
    this._data = data;
    this._$navWrapper;
    this._tabChangeCallback;
    this._getVideoInfoCallback;
  }

  _cache() {
    this._$navWrapper = $('#navWrapper');
  }

  _getVideoInfo(playerKey) {
    if (!this._getVideoInfoCallback) {
      throw new Error('Callback not specified. Add callback using .onVideoInfoRequest()');
    }
    return this._getVideoInfoCallback.call(null, playerKey);
  }

  // @todo meh...
  _buildNav(data, info) {
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
    this._$navWrapper.html(html);
  }

  _changeTab($el) {
    this._$navWrapper.find('.navItem').removeClass('active');
    $el.addClass('active');
    // @todo this is kinda gross.
    this._$navWrapper.find('> li').removeClass('active');
    $el.parent().parent().addClass('active');
  }

  _bindEvents() {
    this._$navWrapper.on('click', '.navItem, #navItemTitle', ((event) => {
      var $el;
      $el = $(event.target);
      if (this._tabChangeCallback) {
        let id = $el.attr('data-id');
        this._tabChangeCallback.call(null, id);
      }
    }).bind(this));
  }

  _getTabById(id) {
    return this._$navWrapper.find(`.navItem[data-id="${id}"]`);
  }

  onVideoInfoRequest(callback) {
    this._getVideoInfoCallback = callback;
  }

  onTabChange(callback) {
    this._tabChangeCallback = callback;
  }

  switchNav(id) {
    var $el;
    $el = this._getTabById(id);
    this._changeTab($el);
  }

  init() {
    this._cache();
    this._getVideoInfo().then(((info) => {
      this._buildNav(this._data, info);
      this._bindEvents();
    }).bind(this));
  }

}

module.exports = Nav;
