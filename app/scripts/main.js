/**
 * @todos
 * clip selection via url param
 * organize clips nav. have a title for each video, and multiple segments to the right
 */
const nav = require('./nav');
const player = require('./player');
const scrubber = require('./scrubber');
const utils = require('./utils');

(($) => {

  $(document).ready(function() {
    // const data = utils.getPlayerData(window.location);
    var data = [
      {vid: 'Qa4uI_50Bmk', segments: [[0, 100], [100, 105]]},
      {vid: 'glWKKOro8QU', segments: [[0, 5], [100, 105]]},
    ];

    player.init(data);
    nav.init(data);
    scrubber.init();

    nav.onChange(player.switchPlayer);
    player.onChange(nav.switchNav);

  });

})(jQuery);
