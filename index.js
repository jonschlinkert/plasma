const async = require('async');
const chalk = require('chalk');
const file = require('fs-utils');
const glob = require('globule');
const _ = require('lodash');

// Local libs
const utils = require('./lib/utils');

// Logging
const success = chalk.green;
const info = chalk.cyan;
const warn = chalk.yellow;
const error = chalk.red;


var plasma = module.exports = {};

/**
 * Pass globbing an array or string of
 * patterns to options.src
 *
 * @param {Object} options Globule options
 * @return {Array} Returns an array of filepaths.
 */

plasma.find = function (options) {
  var files = {};
  var opts = _.cloneDeep(options);
  files.src = glob.find(opts.src, opts);
  return files;
};

/**
 * Normalize config formats for source files,
 * so that any of the following will work
 *
 *   * {src: ''}
 *   * {data:  {src: ''}}
 *   * {data: [{src: ''}, {src: ''}]}
 *
 * Until additional formats are added, globule
 * will only attempt to process patterns on
 * the `src` property.
 *
 * @param   {Object} config  [description]
 * @return  {Object}
 */

plasma.normalize = function (config) {
  var data = config.data;
  var exp = [];
  var raw = [];
  if (data) {
    if (data.src) {exp.push(data);}
    if (_.isArray(data)) {
      if (typeof data[0] === 'string') {
        exp.push({
          src: data
        });
      } else {
        data.forEach(function(obj) {
          if(_.isPlainObject(obj) && !obj.src) {
            raw.push(obj);
          }
        });
        exp.push(data);
      }
    }
  }
  if (config.src) {
    exp.push(config);
  }

  if(!data && !config.src) {
    new Error(error('No data or "src" found.'));
  }

  // Coerce to flattened arrays
  exp = utils.arrayify(exp);
  raw = utils.arrayify(raw);

  // Return an object with an array of raw data,
  // and an array of objects that have src
  // properties. We keep these separate so that
  // globule doesn't try to find filepaths when
  // they don't exist.
  return {
    raw: raw || [],
    data: _.difference(exp, raw)
  };
};


/**
 * Expand globbing patterns from normalized
 * config.
 *
 * @param {Object} options
 * @return {Object}
 */

plasma.expand = function (options) {
  var metadata = plasma.normalize(options);
  if (Array.isArray(metadata.data)) {
    return {
      data: metadata.data.map(plasma.find),
      raw: metadata.raw
    };
  } else {
    var data = plasma.find(metadata.data);
    return {
      data: utils.arrayify(data),
      raw: metadata.raw
    };
  }
};


/**
 * Actually read-in data from each file
 * in the given array
 *
 * @param   {Object}  config
 * @param   {Object}  options
 * @return  {Object}
 */

plasma.load = function(config, options) {
  var opts = _.extend({merge: false, group: false}, options);
  opts.verbose = opts.verbose || plasma.verbose;
  var data = {};

  // Expand globbing patterns into an array of files
  var expanded = plasma.expand(config);

  async.forEach(expanded.data, function(obj, callback) {
    // Empty files should already have already been
    // omitted, but we'll check here to make sure.
    obj.src.filter(function(filepath) {
      if (file.isEmptyFile(filepath)) {
        if(opts.verbose) {
          console.warn(warn('>> Skipping empty file:'), filepath);
        }
      } else {
        return true;
      }
    }).map(function(filepath) {
      if(opts.verbose) {
        console.log(info('>> Loading:'), filepath, success('OK'));
      }

      // Create an object for each file, using the
      // basename of the file as the object name.
      var name = file.base(filepath).toLowerCase();
      var buffer = file.readDataSync(filepath);
      if(!opts.merge) {
        data[name] = buffer;
      } else {
        data = buffer;
      }
    });
    callback();
  });

  return data;
};



plasma.coerce = function (config, options) {
  options = options || {};

  var data = plasma.load(config, options);
  var output = _.cloneDeep(data);

  if(options.toArray) {
    output = utils.formatAsArray(output);
  } else if(options.flatten) {
    output = utils.flattenObject(output);
  }

  return output;
};