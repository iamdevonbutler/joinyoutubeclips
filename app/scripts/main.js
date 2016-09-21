/**
 * @todos
 *
 * clip selection via url param.
 * data from URL for text to display inbtw videos (single param to include generic inbtw text).
 * unbinding (not needed for this use case but necessary for webapps and such).
 * error handling for player requests, e.g. getPlayerData & getVideoUrl.
 *
 * add time to UI.
 * sound bar.
 * name 'clips' or 'videos' - ask corey.
 * cross browser testing.
 * docs page is github page.
 * edit / create new page.
 * license.
 * refactor code (styling into smaller files).
 */
const nav = require('./nav');
const player = require('./player');
const Playbar = require('./playbar');
const utils = require('./utils');
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
     * Register events.
     */
    playbar.onPlayerTimeRequest(player.getCurrentTime);
    playbar.onPlaybarChange(player.seekTo);

    nav.onTabChange(player.switchPlayer);

    player.onPlay((id, time) => playbar.start(time));

    player.onPause((id, time) => playbar.pause());

    player.onPlayerChange((id, time) => {
      const {startTime, endTime} = utils.getClipRange(data, id);
      playbar.reset(startTime, endTime);
      nav.switchNav(id);
    });

    /**
     * Init player.
     */
    player.init(data);

    /**
     * Init nav.
     */
    nav.onVideoInfoRequest(player.getVideoInfo);
    nav.init(data);

    /**
     * Fullscreen mode.
     */
    const target = $('#homepage')[0];
    $(document).on('click', () => {
      if (screenfull.enabled) {
        screenfull.request(target);
      }
    });

  });

})(jQuery);
