const {debounce, throttle} = require('./utils');

module.exports = function(player) {
  var $playerFooter, $playerMask, $body;

  $body = $('body');
  $playerFooter = $('#playerFooter');
  $playerMask = $('#playerMask');

  const hideControls = debounce(() => { $body.removeClass('nav-exposed'); }, 5000);

  // playerFooter > z-index than the player mask.
  // Must keep the footer exposed.
  $playerFooter.on('mouseenter', () => {
    $body.addClass('nav-exposed-1');
  });
  $playerFooter.on('mouseleave', () => {
    $body.addClass('nav-exposed'); // prevents nav from hiding -> exposing very quicky.
    $body.removeClass('nav-exposed-1');
  });

  // Caputring mousemoves in an iframe is a no go. Hence, we sample
  // mousemoves over an invisible div, and simluate iframe clicks.
  $playerMask.on('mousemove', throttle(() => {
    $body.addClass('nav-exposed');
    hideControls();
  }, 80));
  $playerMask.on('click', (event) => {
    player.getPlayerState().then((state) => {
      var isPlaying = state === 1;
      if (isPlaying) {
        player.pause();
      }
      else {
        player.play();
      }
    });
  });

};
