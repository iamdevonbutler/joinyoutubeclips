/**
 * @todos
 * clip selection via url param
 */
const nav = require('./nav');
const player = require('./player');
const utils = require('./utils');

(($) => {

  $(document).ready(function() {
    const data = utils.getPlayerData(window.location);
    player.init(data);
    scrubber.init(data);
  });

})(jQuery);
