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
 * fullscreen should be fyull white not ccs
 * mobile
 * default page w/o url params.
 * prob make it iframeable w/ overlays for content.
 * probably do some kinda nav thing overlay and replace the ugly boxes.
 */
const Nav = require('./nav');
const Player = require('./player');
const Playbar = require('./playbar');
const Soundbar = require('./soundbar');
const Timer = require('./timer');

const utils = require('./utils');
const screenfull = require('screenfull');

// ?W77h1Gf8wZg=0-10,10-20
// @todo might be a good idea to add the video title to this object.
var data = [
  {vid: 'W77h1Gf8wZg', segments: [[0, 10800]]},
  {vid: 'glWKKOro8QU', segments: [[0, 5], [100, 105]]},
];


(($) => {

  $(document).ready(function() {
    var startTime, endTime;
    startTime = data[0].segments[0][0];
    endTime = data[0].segments[0][1];

    /**
    * Get data from URL.
    */
    data = utils.getPlayerData(window.location.search);
    console.log(data);

    /**
     * Instantiate objects.
     */
    var player = new Player(data);
    var nav = new Nav(data);
    var soundbar = new Soundbar();

    var playbar = new Playbar({
      canvasId: 'playbarCanvas',
      startTime: startTime,
      endTime: endTime,
    });

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
     * Init objects.
     */
    player.init(data);
    nav.init(data);

    /**
     * Update soundbar once player has init.
     */
    soundbar.syncVolume();

    /**
     * Fullscreen mode.
     */
    $('#fullscreenIcon').on('click', () => {
      const target = $('#playerShell')[0];
      if (screenfull.enabled) {
        screenfull.request(target);
      }
    });

  });

})(jQuery);
