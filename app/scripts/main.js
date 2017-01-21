/**
 * @deploy to gh-pages `gulp deploy`
 */

const Nav = require('./nav');
const Player = require('./player');
const Playbar = require('./playbar');
const Soundbar = require('./soundbar');
const Timer = require('./timer');
const PlayPauseIcon = require('./playPauseIcon');
const {getClipRange, getPlayerData} = require('./utils');
const screenfull = require('screenfull');
const exposeControls = require('./exposeControls');

/**
* Get data from URL.
* e.g. ?vid=0-10,10-20
*/
if (!window.location.search) {
  window.location.search = '?' + 'felDULf1voY=55-3:30,36:05-39:33&AV1jKBrw0ck=6:45-10:20&puSkP3uym5k';
}
const data = getPlayerData(window.location.search);
const startTime = data[0].segments[0][0];
const endTime = data[0].segments[0][1];

(($) => {

  $(document).ready(function() {

    /**
     * Instantiate components.
     */
    var player = new Player(data);
    var nav = new Nav(data);
    var soundbar = new Soundbar();
    var timer = new Timer();
    var playbar = new Playbar({canvasId: 'playbarCanvas'});
    var playPauseIcon = new PlayPauseIcon('#playPauseIconWrapper');

    /**
     * Register events.
     */
    playbar.onPlaybarChange(::player.seekTo);
    playbar.onTimeRequest(::player.getCurrentTime);
    playbar.onDurationRequest(::player.getDuration);
    soundbar.onVolumeRequest(::player.getVolume);
    soundbar.onSetVolumeRequest(::player.setVolume);
    soundbar.onMuteRequest(::player.mute);
    soundbar.onUnMuteRequest(::player.unMute);
    timer.onTimeRequest(::player.getCurrentTime);
    timer.onDurationRequest(::player.getDuration);
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
      const {startTime, endTime} = getClipRange(data, id);
      playbar.reset(startTime, endTime);
      timer.reset(startTime, endTime);
      nav.switchNav(id);
    });

    /**
     * Init components.
     */
    player.init(data);
    nav.init(data);
    timer.reset(startTime, endTime);
    playbar.reset(startTime, endTime);
    soundbar.syncVolume(); // Update soundbar once player has init.

    /**
     * Fullscreen mode.
     */
    $('#fullscreen').on('click', () => {
      if (screenfull.enabled) {
        screenfull.request();
      }
    });

    /**
     * Hide/show controls.
     */
    exposeControls(player);



  });

})(jQuery);
