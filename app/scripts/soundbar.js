const utils = require('./utils');

class Soundbar {

  constructor() {
    this._$soundbarWrapper;
    this._$soundIcon;
    this._$soundbar;

    this._soundbarWidth = '95';
    this._getVolumeCallback;
    this._setVolumeCallback;
    this._unMuteVolumeCallback;
    this._muteVolumeCallback;

    this._cache();
    this._bindEvents();
    this._initSoundIcon();
  }

  _getVolume() {
    if (!this._getVolumeCallback) {
      throw new Error('Callback not specified. Add callback using .onVolumeRequest()');
    }
    return this._getVolumeCallback.call(null);
  }

  _setVolume(volume) {
    if (!this._setVolumeCallback) {
      throw new Error('Callback not specified. Add callback using .onSetVolumeRequest()');
    }
    return this._setVolumeCallback.call(null, volume);
  }

  _initSoundIcon() {
    // this._$soundIcon.class();
  }

  _cache() {
    this._$soundWidget = $(`#soundWidget`);
    this._$soundIcon = $(`#soundIcon`);
    this._$soundbar = $(`#soundbar`);
  }

  _bindEvents() {
    this._$soundIcon.on('click', ((event) => {
      var $el, mute;
      $el = $(event.target);
      mute = !!$el.hasClass('icon-mediumvolume');
      if(mute) {
        $el.removeClass('icon-mediumvolume').addClass('icon-mute');
        this._$soundbar.hide();
        if (this._muteVolumeCallback) {
          this._muteVolumeCallback.call(null);
        }
      }
      else {
        $el.removeClass('icon-mute').addClass('icon-mediumvolume');
        this._$soundbar.show();
        if (this._unMuteVolumeCallback) {
          this._unMuteVolumeCallback.call(null);
        }
      }
    }).bind(this));

    this._$soundWidget.on('click', '.soundbar', ((event) => {
      var leftXPos, mouseXPos, volumePercentage, width, volume = 100;

      leftXPos = this._$soundbar[0].getBoundingClientRect().left;
      mouseXPos = event.pageX;
      volumePercentage = (mouseXPos - leftXPos) / this._soundbarWidth;
      width = (this._soundbarWidth * volumePercentage) + 'px';
      volume = Math.round(volume * volumePercentage);

      this._$soundbar.css('width', width);
      this._setVolume(volume); // @todo this is async.

    }).bind(this));
  }

  syncVolume() {
    this._getVolume().then(((volume) => {
      var width;
      width = (volume / 100) * this._soundbarWidth;
      width = width + 'px';
      this._$soundbar.css('width', width);
    }).bind(this));
  }

  onVolumeRequest(callback) {
    this._getVolumeCallback = callback;
  }

  onSetVolumeRequest(callback) {
    this._setVolumeCallback = callback;
  }

  onMuteRequest(callback) {
    this._muteVolumeCallback = callback;
  }

  onUnMuteRequest(callback) {
    this._unMuteVolumeCallback = callback;
  }

}

/**
 * Constructor function.
 */
module.exports = Soundbar;
