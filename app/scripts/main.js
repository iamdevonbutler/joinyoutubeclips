const scrubber = require('./scrubber');
const player = require('./player');
const utils = require('./utils');

(($) => {

  $(document).ready(function() {
    const data = utils.getPlayerData(window.location);
    player.init(data);
    scrubber.init(data);
  });

})(jQuery);
