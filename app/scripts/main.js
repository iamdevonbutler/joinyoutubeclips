/**
 * @todos
 * clip selection via url param
 * organize clips nav. have a title for each video, and multiple segments to the right
 * data from URL for text to display inbtw videos (single param to include generic inbtw text)
 * get segment from data is unnecessary. could return an obj and use deconstruction to get start and end times
 * unbinding (not needed for this use case but necessary for webapps and such)
 * need to get time on hover on playbar.
 * full URL (make clip title a link)
 * add time to UI.
 * sound bar.
 * fullscreen (https://github.com/sindresorhus/screenfull.js/)
 * name 'clips' or 'videos' - ask corey.
 * cross browser testing
 * license.
 * docs page is github page.
 * error handling for player requests, e.g. getPlayerData & getVideoUrl.
 */
const nav = require('./nav');
const player = require('./player');
const Playbar = require('./playbar');
const utils = require('./utils');

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

  });

})(jQuery);
