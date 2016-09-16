const player = require('youtube-player');

module.exports.init = function() {
  const player1 = player('player1', {
    videoId: 'M7lc1UVf-VE'
  });

  // player1
  //   .playVideo()
  //   .then(function () {
  //       console.log('Starting to play player1. It will take some time to buffer video before it starts playing.');
  //   });
}
