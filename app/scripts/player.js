const YT = require('youtube-player');
const utils = require('./utils');

// @todo use more DI, and more setters/getters.
class Player {

  constructor(data) {
    this._data = data;
    this._$player;
    this._activeId = '0.0';
    this._players = [];

    this._onPlayerChangeCallback;
    this._onTimeChangeCallback;
    this._onPauseCallback;
    this._onPlayCallback;
  }

  _cache() {
    this._$player = $('#player');
  }

  _addPlayer(id, vid, active = false) {
    var item, el;
    const {startTime, endTime} = utils.getClipRange(this._data, id);

    item = `<li data-id="${id}" ${active ? 'class="active"' : ''}><div></div></li>`;

    // Add item to DOM.
    this._$player.append(item);
    el = this._$player.children().last().children()[0];

    this._players[id] = YT(el, {
      videoId: vid,
      playerVars: {
        autoplay: 0,
        controls: 0,
        fs: 0,
        showinfo: 0,
        start: startTime,
        end: endTime,
      }
    });

    // note: calling .seekTo() will trigger the 'playing' event even if the video is paused...why...no fucking clue.
    this._players[id].on('stateChange', ((event) => {
      var player, id, ended, playing, paused, currentTime;

      player = event.target;
      id = $(player.a).parent().attr('data-id');

      ended = event.data === 0;
      playing = event.data === 1;
      paused = event.data === 2;

      // Usually an async operation - not in this callback tho...
      currentTime = player.getCurrentTime();

      if (playing) {
        if (this._onPlayCallback) this._onPlayCallback.call(null, id, currentTime);
      }

      if (paused) {
        if (this._onPauseCallback) this._onPauseCallback.call(null, id, currentTime);
      }

      if (ended) {
        const nextId = utils.getNextIdFromData(this._data, id);
        this.switchPlayer(nextId || '0.0', !!nextId);
      }
    }).bind(this));
  }

  _addPlayers(data) {
    data.forEach((item, i) => {
      item.segments.forEach(((segment, ii) => {
        var active, id;
        active = i === 0 && ii === 0;
        id = `${i}.${ii}`;
        this._addPlayer(id, item.vid, active);
      }).bind(this));
    });
  }

  _getVideoById(id) {
    return this._$player.find(`> [data-id="${id}"]`);
  }

  _changePlayerDisplay(id) {
    var $el;
    $el = this._getVideoById(id);
    this._$player.children().removeClass('active');
    $el.addClass('active');
  }

  _getCurrentPlayer() {
    // @todo add error handling.
    return this._players[this._activeId];
  }

  _getPlayer(id) {
    // @todo add error handling.
    return this._players[id];
  }

  _bufferPlayers(players) {
    var keys;
    keys = Object.keys(players);
    keys.forEach((key, i) => {
      var player;
      player = players[key];
      if (i === 0) return;
      player.playVideo();
      player.pauseVideo();
    });
  }

  // @todo async (.playVideo()) not handled properly.
  switchPlayer(id, playVideo = true) {
    var currentPlayer, nextPlayer;

    currentPlayer = this._getCurrentPlayer();
    nextPlayer = this._getPlayer(id);
    this._activeId = id; // important.

    this._changePlayerDisplay(id);
    currentPlayer.pauseVideo();

    nextPlayer.getCurrentTime().then((currentTime) => {
      if (this._onPlayerChangeCallback) {
        this._onPlayerChangeCallback.call(null, id, currentTime);
      }
      if (playVideo) {
        const {startTime, endTime} = utils.getClipRange(this._data, id);
        if (currentTime >= endTime) nextPlayer.seekTo(startTime);
        nextPlayer.playVideo();
      }
    });
  }

  onPlayerChange(callback) {
    this._onPlayerChangeCallback = callback;
  }

  seekTo(time) {
    return this._getCurrentPlayer().seekTo(time);
  }

  getVolume() {
    return this._getCurrentPlayer().getVolume();
  }

  setVolume(volume) {
    return this._getCurrentPlayer().setVolume(volume);
  }

  mute() {
    return this._getCurrentPlayer().mute();
  }

  unMute() {
    return this._getCurrentPlayer().unMute();
  }

  getCurrentTime() {
    return this._getCurrentPlayer().getCurrentTime();
  }

  getVideoInfo(id) {
    var ids, player;
    ids = id ? [id.split('.')[0]] : this._data.map((item, key) => key.toString());

    function getInfo(player) {
      return new Promise((resolve, reject) => {
        Promise.all([
          player.getVideoData(),
          player.getVideoUrl(),
        ]).then((values) => {
          resolve({
            ...values[0],
            url: values[1],
          });
        });
      });
    }

    return new Promise(((resolve, reject) => {
      var promises;
      promises = ids.map((id) => getInfo(this._players[`${id}.0`]));
      Promise.all(promises).then(resolve, reject);
    }).bind(this));

  }

  getDuration() {
    var player;
    player = this._getCurrentPlayer();
    return player.getDuration();
  }  

  play() {
    var player;
    player = this._getCurrentPlayer();
    player.playVideo();
    this._onPlayCallback.call(null, this._activeId, player.getCurrentTime());
  }

  pause() {
    var player;
    player = this._getCurrentPlayer();
    player.pauseVideo();
    this._onPauseCallback.call(null, this._activeId, player.getCurrentTime());
  }

  onPause(callback) {
    this._onPauseCallback = callback;
  }

  onPlay(callback) {
    this._onPlayCallback = callback;
  }

  init(data) {
    this._cache();
    this._addPlayers(data);
    this._bufferPlayers(this._players);
  }

}

module.exports = Player;
