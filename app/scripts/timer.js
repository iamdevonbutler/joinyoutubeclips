const utils = require('./utils');

class Timer {

  constructor(params) {
    const {startTime, endTime} = params;

    this._clipStartTime = startTime;
    this._clipEndTime = endTime;
    this._getTimeCallback;
    this._timerInterval;

    this._$currentTime;
    this._$duration;

    this._cache();
    this.reset(startTime, endTime);
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
    this._clipStartTime = startTime;
    this._clipEndTime = endTime;

    this._updateDuration();

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

  start() {
    this._timerInterval = setInterval(::this._updateCurrentTime, 250);
  }

  pause() {
    clearInterval(this._timerInterval);
  }

  onTimeRequest(callback) {
    this._getTimeCallback = callback;
  }

}

/**
 * Constructor function.
 */
module.exports = Timer;
