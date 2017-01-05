'use strict';

var fs = require('fs');
var path = require('path');
var File = require('vinyl');
var extend = require('extend-shallow');
var exists = require('fs-exists-sync');
var utils = require('./utils');

module.exports = function(filename, options) {
  var opts = extend({cwd: process.cwd()}, options);
  var fp = path.resolve(opts.cwd, filename);

  var file = new File({path: fp});
  file.cwd = opts.cwd;
  file.base = opts.cwd;

  Object.defineProperty(file, 'ext', {
    configurable: true,
    set: function(ext) {
      this._ext = ext;
    },
    get: function() {
      return this._ext || (this._ext = utils.formatExt(this.extname));
    }
  });

  Object.defineProperty(file, 'orig', {
    configurable: true,
    get: function() {
      return this.history[0];
    }
  });

  Object.defineProperty(file, 'stat', {
    configurable: true,
    get: function() {
      return exists(this.orig) ? fs.statSync(this.orig) : null;
    }
  });

  file.isDirectory = function() {
    return file.stat.isDirectory();
  };

  Object.defineProperty(file, 'contents', {
    configurable: true,
    get: function() {
      return this.stat.isFile() ? fs.readFileSync(this.path) : null;
    }
  });

  return file;
};
