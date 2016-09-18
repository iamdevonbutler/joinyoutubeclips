/**
 * @todos
 * clip selection via url param
 * organize clips nav. have a title for each video, and multiple segments to the right
 */
const nav = require('./nav');
const player = require('./player');
const Scrubber = require('./scrubber');
const utils = require('./utils');

(($) => {

  $(document).ready(function() {
    // const data = utils.getPlayerData(window.location);
    var data = [
      {vid: 'Qa4uI_50Bmk', segments: [[0, 10], [100, 105]]},
      {vid: 'glWKKOro8QU', segments: [[0, 5], [100, 105]]},
    ];

    nav.onTabChange(player.switchPlayer);
    player.onPlayerChange((id) => {
      var segments = utils.getSegmentFromData(data, id);
      var duration = segments[1] - segments[0];
      var scrubber = new Scrubber(segments[0], segments[1]);
      scrubber.start(0);
      nav.switchNav(id);
    });

    nav.init(data);
    player.init(data);

  });

})(jQuery);
