/*!
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var Base = require('base');
var mm = require('micromatch');
var plugins = require('base-plugins');
var csv = require('parser-csv');
var yaml = require('js-yaml');
var glob = require('matched');
var utils = require('./utils');
var toFile = require('./to-file');

function Plasma(options) {
  Base.call(this, {isApp: true}, options);
  this.context = this.options.context || {};
  this.loaders = [];
  this.use(plugins());
}

Base.extend(Plasma);

Plasma.prototype.dataLoader = function(patterns, fn) {
  this.loaders.push({
    patterns: patterns,
    isMatch: mm.matcher(patterns, this.options),
    fn: fn
  });
  return this;
};

Plasma.prototype.matchLoader = function(file) {
  for (var i = 0; i < this.loaders.length; i++) {
    var loader = this.loaders[i];
    if (loader.isMatch(file.extname)) {
      return loader.fn;
    }
  }

  return function(file) {
    try {
      return JSON.parse(file.contents);
    } catch (err) {
      return {};
    }
  };
};

Plasma.prototype.load = function(patterns, options, cb) {
  var self = this;

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  glob(patterns, options, function(err, files) {
    if (err) {
      cb(err);
      return;
    }

    var data = {};
    for (var i = 0; i < files.length; i++) {
      var file = toFile(files[i], options);
      var fn = self.loaders[file.ext] || self.matchLoader(file);
      var obj = fn.call(self, file, options);

      data = utils.merge({}, data, obj);
      files[i] = file;
    }

    cb(null, data, files);
  });
};

Plasma.prototype.loadSync = function(patterns, options) {
};

/**
 * Expose `plasma`
 */

module.exports = Plasma;
var loader = {};

loader.json = function(options) {
  return function(plasma) {
    plasma.dataLoader(/\.json$/, function(file) {
      return JSON.parse(file.contents);
    });
  };
};

loader.yaml = function(options) {
  return function(plasma) {
    plasma.dataLoader(/\.ya?ml$/, function(file) {
      return yaml.safeLoad(file.contents);
    });
  };
};

loader.csv = function(options) {
  return function(plasma) {
    plasma.dataLoader(/\.csv$/, function(file) {
      var data = csv.parseSync(file.contents.toString());
      var obj = {};
      obj[file.stem] = data;
      return obj;
    });
  };
};

loader.js = function(options) {
  return function(plasma) {
    plasma.dataLoader(/\.js$/, function(file, options) {
      var data = require(file.path);
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var val = data[key];
          if (typeof val === 'function') {
            data[key] = val(this.context);
          }
        }
      }
      return data;
    });
  };
};

var plasma = new Plasma();
plasma
  .use(loader.json())
  .use(loader.yaml())
  .use(loader.csv())
  .use(loader.js())

plasma.load('test/fixtures/*.*', function(err, data, files) {
  console.log(data);
});
