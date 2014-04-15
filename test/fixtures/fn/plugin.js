
module.exports = function(config) {
  var helpers = {};

  // var content = '<!-- include("foo") -->';
  // convert(content)
  helpers.convert = function(str) {
    return str.replace(/<!--\s*([\S]+)\(([\S]+)\)\s*-->/g, '{%= $1($2) %}');
  };

  return helpers;
};