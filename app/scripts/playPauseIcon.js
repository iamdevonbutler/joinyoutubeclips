class PlauPauseIcon {

  constructor(iconSelector) {
    this._onPlayCallback;
    this._onPauseCallback;
    this._cache(iconSelector);
    this._bindEvents();
  }

  _cache(iconSelector) {
    this._$icon = $(iconSelector);
  }

  _bindEvents() {
    this._$icon.on('click', (e) => {
      var isPlaying;
      isPlaying = this._$icon.hasClass('pause');
      if (isPlaying) {
        if (this._onPauseCallback) {
          this._onPauseCallback.call(null);
        }
      }
      else {
        if (this._onPlayCallback) {
          this._onPlayCallback.call(null);
        }
      }
    });
  }

  showPlayIcon() {
    this._$icon.removeClass('pause');
  }

  showPauseIcon() {
    this._$icon.addClass('pause');
  }

  onPlay(callback) {
    this._onPlayCallback = callback;
  }

  onPause(callback) {
    this._onPauseCallback = callback;
  }
}

/**
 * Constructor function.
 */
module.exports = PlauPauseIcon;
