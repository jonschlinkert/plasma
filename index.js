/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const file = require('fs-utils');
const glob = require('globule');
const log = require('verbalize');
const _ = require('lodash');
const utils = require('./lib/utils');
const plasma = module.exports = {};

log.runner = 'plasma';

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
  var patterns = [];
  var noPaths = [];


  // If a 'config.data' property exists
  if (data) {
    // if there is a src property
    if (data.src) {
      // If a src is found, push it to patterns array
      patterns.push({src: data.src});
      // then remove it
      delete data.src;
    }
    // if there isn't a src property, and it's an array
    if (_.isArray(data) || _.isString(data)) {
      if (_.isString(data)) {
        patterns.push({src: data});
      } else {
        data.forEach(function(item) {
          if (item.src) {
            // If a src is found, push it to patterns array
            patterns.push({src: item.src});
            delete item.src;
          } else {
            noPaths.push(item);
          }
        });
      }
    } else {
      // Now push the remaining object into the noPaths array
      noPaths.push(data);
    }
  }

  // if a 'config.src' property exists
  if (config.src) {
    patterns.push({src: config.src});
    delete config.src;
    noPaths.push(config);
  }

  if(!data && !config.src) {
    new Error(log.error('No data object or "src" property found.'));
  }

  patterns = _.flatten(patterns);
  noPaths =_.flatten(noPaths);

  // Return an object with an array of raw data,
  // and an array of objects that have src
  // properties. We keep these separate so that
  // globule doesn't try to find filepaths on
  // objects that don't have any.

  return {
    noPaths: noPaths || [],
    data: _.difference(patterns, noPaths)
  };
};


/**
 * Pass globbing an array or string of
 * patterns to options.src
 *
 * @param {Object} options Globule options
 * @return {Array} Returns an array of filepaths.
 */

plasma.find = function (options) {
  var files = {};
  var data = _.cloneDeep(options || {});
  files.src = glob.find(data.src, options);
  return files;
};


/**
 * Expand globbing patterns from normalized
 * config.
 *
 * @param {Object} options
 * @return {Object}
 */

plasma.expand = function (data) {
  var metadata = plasma.normalize(data);

  if (Array.isArray(metadata.data)) {
    return {
      data: metadata.data.map(plasma.find),
      noPaths: metadata.noPaths
    };
  } else {
    data = plasma.find(metadata.data);
  }
  return {
    data: utils.arrayify(data),
    noPaths: metadata.noPaths
  };
};


/**
 * Actually read-in data from each file
 * in the given array
 *
 * @param   {Object}  config
 * @param   {Object}  options
 * @return  {Object}
 */

plasma.load = function (config, options) {
  var cloned = _.cloneDeep(config);

  options = options || {},
    data = {},
    opts = _.extend({
    merge: false,
    group: false,
    verbose: false
  }, options);

  log.mode.verbose = opts.verbose;

  // Expand globbing patterns into an array of files
  var expanded = plasma.expand(config);

  expanded.data.forEach(function (obj) {
    // Empty files should already have already been
    // omitted, but we'll check here to make sure.
    obj.src.filter(function (filepath) {
      if (file.isEmptyFile(filepath)) {
        log.inform('skipping', 'empty file', filepath);
      } else {
        return true;
      }
    }).map(function (filepath) {
      log.inform('loading', filepath, log.green('OK'));

      // Create an object for each file, using the
      // basename of the file as the object name.
      var name = file.name(filepath).toLowerCase();
      var buffer = file.readDataSync(filepath);
      if (!opts.merge) {
        data[name] = buffer;
      } else {
        data = buffer;
      }
    });
  });
  return _.extend(cloned, data);
};


/**
 * Coerce the output data to either an array
 * or an object.
 *
 * @param   {Object}  config
 * @param   {Object}  options
 * @return  {Object}
 */

plasma.coerce = function (config, options) {
  options = options || {};

  var data = plasma.load(config, options);
  var output = _.cloneDeep(data);

  if(options.toArray) {
    output = utils.formatAsArray(output);
  } else if(options.flatten) {
    output = utils.flattenObject(output);
  }

  log.verbose.inform('coerced');
  return output;
};

