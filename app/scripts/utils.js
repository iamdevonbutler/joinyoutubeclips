const queryString = require('query-string');

module.exports.getPlayerData = function(query) {

  return queryString.parse(query);

}
