/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const file = require('fs-utils');
const expect = require('chai').expect;
const plasma = require('../');


describe('processConfig:', function () {
  describe('when an object is passed:', function () {

    describe('when a `process` function is used:', function () {
      it('should normalize the value returned from the function.', function (done) {
        var fixture = {
          patterns: 'test/fixtures/*.{json,yml}',
          processConfig: function(config) {
            var files = file.expand(config.patterns);
            return {patterns: files};
          }
        };

        var actual = plasma.normalize(fixture);
        var expected = [{__normalized__: true, patterns: ['test/fixtures/a.yml', 'test/fixtures/b.json', 'test/fixtures/c.json']}];
        expect(actual).to.deep.equal(expected);
        done();
      });
    });

    describe('when a `process` function is used:', function () {
      it('should normalize the value returned from the function.', function (done) {

        // if there are files, add each file to its own object, using the
        // basename of the filepath otherwise return the original object.
        var fixture = {
          patterns: 'test/fixtures/*.{json,yml}',
          namespace: 'no-files',
          processConfig: function(config) {
            var files = [];
            file.expand(config.patterns).map(function(filepath) {
              var obj = {namespace: file.name(filepath), patterns: [filepath]};
              files = files.concat(obj);
            });
            if (files.length > 0) {return files; }
            return {namespace: config.name, patterns: config.patterns};
          }
        };

        var actual = plasma.normalize(fixture);

        var expected = [
          {__normalized__: true, __namespace__: true, namespace: 'a', patterns: ['test/fixtures/a.yml']},
          {__normalized__: true, __namespace__: true, namespace: 'b', patterns: ['test/fixtures/b.json']},
          {__normalized__: true, __namespace__: true, namespace: 'c', patterns: ['test/fixtures/c.json']},
        ];
        expect(actual).to.deep.equal(expected);
        done();
      });
    });

    describe('when matching files aren\'t found:', function () {
      it('should return the original patterns string in `nomatch`.', function (done) {

        // if there are files, add each file to its own object, using the
        // basename of the filepath. Otherwise return the original object.
        var fixture = {
          patterns: 'foo/bar/*.{json,yml}',
          name: 'no-files',
          processConfig: function(config) {
            var files = [];
            file.expand(config.patterns).map(function(filepath) {
              var obj = {namespace: file.name(filepath), patterns: [filepath]};
              files = files.concat(obj);
            });
            if (files.length > 0) {return files; }
            return {namespace: config.name, patterns: config.patterns};
          }
        };

        var actual = plasma.normalize(fixture);

        var expected = [
          {__normalized__: true, __namespace__: true, 'no-files': ['foo/bar/*.{json,yml}'], patterns: ['foo/bar/*.{json,yml}'], nomatch: ['foo/bar/*.{json,yml}']},
        ];
        expect(actual).to.deep.equal(expected);
        done();
      });
    });
  });
});
