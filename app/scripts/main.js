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
const PlayPauseIcon = require('./playPauseIcon');
const utils = require('./utils');



/**
* Get data from URL.
*/

// const data = utils.getPlayerData(window.location.search);
// const {startTime, endTime} = utils.getInitialTimeRange(data);


// ?W77h1Gf8wZg=0-10,10-20
// @todo might be a good idea to add the video title to this object.
var data = [
  {vid: 'AX7hyidzkNs', segments: [[0, 10800]]},
  {vid: 'W77h1Gf8wZg', segments: [[0, 10800]]},
  {vid: 'glWKKOro8QU', segments: [[0, 5], [100, 105]]},
];
const startTime = data[0].segments[0][0];
const endTime = data[0].segments[0][1];

(($) => {

  $(document).ready(function() {
    var startTime, endTime;

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

    var playPauseIcon = new PlayPauseIcon('#playPauseIconWrapper');

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

    playPauseIcon.onPlay(::player.play);
    playPauseIcon.onPause(::player.pause);


    player.onPlay((id, time) => {
      playbar.start(time);
      timer.start();
      playPauseIcon.showPauseIcon();
    });

    player.onPause((id, time) => {
      playbar.pause();
      timer.pause();
      playPauseIcon.showPlayIcon();
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

  });

})(jQuery);
