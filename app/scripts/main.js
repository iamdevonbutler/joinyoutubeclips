/**
 * @todos
 * clip selection via url param
 * organize clips nav. have a title for each video, and multiple segments to the right
 * data from URL for text to display inbtw videos (single param to include generic inbtw text)
 * get segment from data is unnecessary. could return an obj and use deconstruction to get start and end times
 */
const nav = require('./nav');
const player = require('./player');
const Playbar = require('./playbar');
const utils = require('./utils');

var data = [
  {vid: 'Qa4uI_50Bmk', segments: [[0, 5], [100, 105]]},
  {vid: 'glWKKOro8QU', segments: [[0, 5], [100, 105]]},
];

var playbarOpts = {
  cursorColor: '#f12b24',
  canvasId: 'playbarWrapper',
  startTime: 0,
  endTime: 5,
};

(($) => {

  $(document).ready(function() {
    // Get data.
    // const data = utils.getPlayerData(window.location);

    // Init playbar.
    var playbar = new Playbar(playbarOpts);

    // Register events.
    nav.onTabChange(player.switchPlayer);

    player.onPlay((id, time) => {
      var currentTime = player.getCurrentTime();
      playbar.start(currentTime);
    });
    player.onPause((id, time) => playbar.pause());
    player.onPlayerChange((id, time) => {
      // Reset playbar.
      const {startTime, endTime} = utils.getClipRange(data, id);
      playbar.reset(startTime, endTime);
      // Update nav.
      nav.switchNav(id);
    });

    // Init nav.
    nav.init(data);

    // Init player.
    player.init(data);

  });

})(jQuery);
