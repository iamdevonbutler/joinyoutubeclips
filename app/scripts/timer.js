const utils = require('./utils');

class Timer {

  constructor(params) {
    this._clipStartTime;
    this._clipEndTime;
    this._getTimeCallback;
    this._onDurationCallback;
    this._timerInterval;

    this._$currentTime;
    this._$duration;

    this._cache();
  }

  _cache() {
    this._$currentTime = $('#currentTime');
    this._$duration = $('#duration');
  }

  _getCurrentTime() {
    if (!this._getTimeCallback) {
      throw new Error('Callback not specified. Add callback using .onTimeRequest()');
    }
    return this._getTimeCallback.call(null);
  }

  reset(startTime, endTime) {
    this._clipStartTime = startTime || 0;
    this._clipEndTime = endTime || '';

    if (endTime) {
      this._updateDuration();
    }
    else {
      this._fetchDuration(this._updateDuration);
    }

    if (this._getTimeCallback) {
      this._updateCurrentTime();
    }
    else {
      this._$currentTime.html('0:00');
    }
  }

  _updateCurrentTime() {
    return this._getCurrentTime().then((time = 0) => {
      time = Math.round(time - this._clipStartTime);
      time = utils.secondsToDisplayTime(time);
      this._$currentTime.html(time);
    });
  }

  _updateDuration() {
    var duration;
    duration = this._clipEndTime - this._clipStartTime;
    duration = utils.secondsToDisplayTime(duration);
    this._$duration.html(duration);
  }

  _fetchDuration(callback) {
    if (!this._onDurationCallback) {
      throw new Error('Callback not specified. Add callback using .onDurationRequest()');
    }
    this._onDurationCallback.call(null).then((duration) => {
      this._clipEndTime = duration;
      callback.call(this);
    });
  }

  start() {
    this._timerInterval = setInterval(this._updateCurrentTime.bind(this), 100);
  }

  pause() {
    clearInterval(this._timerInterval);
  }

  onTimeRequest(callback) {
    this._getTimeCallback = callback;
  }

  onDurationRequest(callback) {
    this._onDurationCallback = callback;
  }

}

/**
 * Constructor function.
 */
module.exports = Timer;
