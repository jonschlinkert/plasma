
module.exports = function(config) {
  var plugins = {};

  plugins.lowercase = function(str) {
    return str.toLowerCase(str);
  };

  return plugins;
};