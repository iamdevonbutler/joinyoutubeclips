/**
 * @todos
 *
 * clip selection via url param.
 * data from URL for text to display inbtw videos (single param to include generic inbtw text).
 * unbinding (not needed for this use case but necessary for webapps and such).
 * error handling for player requests, e.g. getPlayerData & getVideoUrl.
 * cross browser testing.
 * docs page is github page.
 * edit / create new page.
 * soundwidget name to volumewidget
 * change homepage to playerPage
 * fullscreen should be fyull white not ccc
 */
const Nav = require('./nav');
const Player = require('./player');
const Playbar = require('./playbar');
const Soundbar = require('./soundbar');
const Timer = require('./timer');

const utils = require('./utils');
const screenfull = require('screenfull');

// @todo might be a good idea to add the video title to this object.
var data = [
  {vid: 'W77h1Gf8wZg', segments: [[0, 10800]]},
  {vid: 'glWKKOro8QU', segments: [[0, 5], [100, 105]]},
];


;(($) => {

  $(document).ready(function() {
    /**
     * Get data from URL.
     */
    // const data = utils.getPlayerData(window.location);
    var startTime, endTime;
    startTime = data[0].segments[0][0];
    endTime = data[0].segments[0][1];

    /**
     * Init player.
     */
    var player = new Player(data);

    /**
     * Init nav.
     */
    var nav = new Nav(data);

    /**
     * Init playbar.
     */
    var playbar = new Playbar({
      canvasId: 'playbarCanvas',
      startTime: startTime,
      endTime: endTime,
    });

    /**
     * Init soundbar.
     */
    var soundbar = new Soundbar();

    /**
     * Init timer.
     */
    var timer = new Timer({
      startTime: startTime,
      endTime: endTime,
    });

    /**
     * Register events.
     */
    playbar.onPlaybarChange(::player.seekTo);
    playbar.onTimeRequest(::player.getCurrentTime);
    soundbar.onVolumeRequest(::player.getVolume);
    soundbar.onSetVolumeRequest(::player.setVolume);
    soundbar.onMuteRequest(::player.mute);
    soundbar.onUnMuteRequest(::player.unMute);
    timer.onTimeRequest(::player.getCurrentTime);
    nav.onTabChange(::player.switchPlayer);
    nav.onVideoInfoRequest(::player.getVideoInfo);

    player.onPlay((id, time) => {
      playbar.start(time);
      timer.start();
    });

    player.onPause((id, time) => {
      playbar.pause();
      timer.pause();
    });

    player.onPlayerChange((id, time) => {
      const {startTime, endTime} = utils.getClipRange(data, id);
      playbar.reset(startTime, endTime);
      timer.reset(startTime, endTime);
      nav.switchNav(id);
    });

    /**
     * Init player.
     */
    player.init(data);

    /**
     * Init nav.
     */
    nav.init(data);

    /**
     * Update soundbar once player has init.
     */
    soundbar.syncVolume();

    /**
     * Fullscreen mode.
     */
    $('#fullscreen').on('click', () => {
      const target = $('#playerShell')[0];
      if (screenfull.enabled) {
        screenfull.request(target);
      }
    });

  });

})(jQuery);
