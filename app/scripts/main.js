/**
 * @todos
 *
 * clip selection via url param.
 * data from URL for text to display inbtw videos (single param to include generic inbtw text).
 * unbinding (not needed for this use case but necessary for webapps and such).
 * error handling for player requests, e.g. getPlayerData & getVideoUrl.
 *
 * make nav items a little bit smaller - maybe.
 * sound bar.
 * name 'clips' or 'videos' - ask corey.
 * cross browser testing.
 * docs page is github page.
 * abstract out time widget.
 * edit / create new page.
 * onHover u can position things ontop of the video and hide them like the top right icons in the player do by default.
 */
const nav = require('./nav');
const player = require('./player');
const Playbar = require('./playbar');
const Soundbar = require('./soundbar');
const utils = require('./utils');
const Timer = require('./timer');
const screenfull = require('screenfull');

// @todo might be a good idea to add the video title to this object.
var data = [
  {vid: 'Qa4uI_50Bmk', segments: [[0, 20], [100, 105]]},
  {vid: 'glWKKOro8QU', segments: [[0, 5], [100, 105]]},
];

var playbarOpts = {
  cursorColor: '#f12b24',
  canvasId: 'playbarCanvas',
  startTime: 0,
  endTime: 20,
  playbarHeight: 20,
};

(($) => {

  $(document).ready(function() {
    /**
     * Get data from URL.
     */
    // const data = utils.getPlayerData(window.location);

    /**
     * Init playbar.
     */
    var playbar = new Playbar(playbarOpts);

    /**
     * Init soundbar.
     */
    var soundbar = new Soundbar();

    /**
     * Init timer.
     */
    var timer = new Timer({
      startTime: playbarOpts.startTime,
      endTime: playbarOpts.endTime,
    });

    /**
     * Register events.
     */
    playbar.onPlaybarChange(player.seekTo);
    playbar.onTimeRequest(player.getCurrentTime);
    soundbar.onVolumeRequest(player.getVolume);
    soundbar.onSetVolumeRequest(player.setVolume);
    timer.onTimeRequest(player.getCurrentTime);
    nav.onTabChange(player.switchPlayer);
    nav.onVideoInfoRequest(player.getVideoInfo);

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
     * Update soundbar.
     */
    soundbar.syncVolume();

    /**
     * Init player.
     */
    player.init(data);

    /**
     * Init nav.
     */
    nav.init(data);


    /**
     * Fullscreen mode.
     */
    // const target = $('#homepage')[0];
    // $(document).on('click', () => {
    //   if (screenfull.enabled) {
    //     screenfull.request(target);
    //   }
    // });

  });

})(jQuery);
