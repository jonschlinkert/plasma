/*!
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/* deps: mocha */
require('should');
var fs = require('fs');
var csv = require('parse-csv');
var path = require('path');
var yaml = require('js-yaml');
var Plasma = require('..');
var plasma;

describe('plasma.load()', function () {
  beforeEach(function() {
    plasma = new Plasma();

    plasma.dataLoader('yml', function(fp, opts) {
      var str = plasma.dataLoader('read')(fp);
      return yaml.safeLoad(str, opts);
    });

    plasma.dataLoader('yaml', function(fp, opts) {
      return plasma.dataLoader('yml')(fp, opts);
    });

    plasma.dataLoader('csv', function(fp, opts) {
      var str = plasma.dataLoader('read')(fp);
      var res = csv.jsonDict(str, {headers: {included: true}});
      return JSON.parse(res);
    });
  });

  describe('formats:', function () {
    it('should read ".csv":', function () {
      var actual = plasma.load('test/fixtures/a.csv');
      actual.a.should.have.properties('1', '2', '3');
    });

    it('should read ".json":', function () {
      var actual = plasma.load('test/fixtures/b.json');
      actual.should.eql({b: {bbb: 'data from b.json'}});
    });

    it('should read ".yml":', function () {
      var actual = plasma.load('test/fixtures/e.yml');
      actual.e.should.have.property('name', 'data from e.yml');
    });

    it('should read ".yaml":', function () {
      var actual = plasma.load('test/fixtures/e.yaml');
      actual.e.should.have.property('name', 'data from e.yml');
    });
  });

  describe('string:', function () {
    describe('and when the string is a file path', function () {
      it('should detect the format, YAML or JSON, and load the file:', function () {
        plasma.load('test/fixtures/a.json').should.have.property('a', {aaa: 'data from a.json'});
        plasma.load('test/fixtures/b.json').should.have.property('b', {bbb: 'data from b.json'});
      });

      it('should load yaml files:', function () {
        plasma.load('test/fixtures/d.yml').d.should.have.property('name', 'data from d.yml');
      });

      it('should load a glob of files:', function () {
        var actual = plasma.load('test/fixtures/*.{json,yml}');
        actual.should.have.properties('a', 'b', 'c', 'd');
      });
    });
  });

  describe('array of objects:', function () {
    it('should load data from an array of objects:', function () {
      var actual = plasma.load([
        {foo: 'foo', bar: 'bar', baz: 'baz'},
        {bar: 'bar', baz: 'foo', bang: 'boom'}
      ]);

      actual.should.eql({
        bang: 'boom',
        bar: 'bar',
        baz: 'foo',
        foo: 'foo'
      });
    });
  });

  describe('array of files:', function () {
    it('should load an array of files:', function () {
      var actual = plasma.load(['test/fixtures/a.yml', 'test/fixtures/b.json']);
      actual.should.eql({b: {bbb: 'data from b.json'}});
    });
  });

  describe('array of strings:', function () {
    it('should return the array of strings as is:', function () {
      var actual = plasma.load(['foo', 'bar', 'baz']);
      actual.should.eql(['foo', 'bar', 'baz']);
    });
  });
});

describe('options:', function () {
  beforeEach(function() {
    plasma = new Plasma();

    plasma.dataLoader('yml', function(fp, opts) {
      var str = plasma.dataLoader('read')(fp);
      return yaml.safeLoad(str, opts);
    });

    plasma.dataLoader('yaml', function(fp, opts) {
      return plasma.dataLoader('yml')(fp, opts);
    });

    plasma.dataLoader('csv', function(fp, opts) {
      var str = plasma.dataLoader('read')(fp);
      var res = csv.jsonDict(str, {headers: {included: true}});
      return JSON.parse(res);
    });
  });

  describe.only('namespace:', function () {
    it('should namespace data from files by default:', function () {
      var actual = plasma.load(['test/fixtures/b.json']);
      actual.should.eql({b: {bbb: 'data from b.json'}});
    });

    it('should disable namespacing on the constructor', function () {
      plasma = new Plasma({namespace: false});
      var actual = plasma.load('test/fixtures/a.json');
      actual.should.eql({aaa: 'data from a.json'});
    });

    it('should disable namespacing on the load method', function () {
      var actual = plasma.load('test/fixtures/a.json', {namespace: false});
      actual.should.eql({aaa: 'data from a.json'});
    });

    it('should merge data onto the root of the data obect:', function () {
      plasma.load('test/fixtures/data.json');
      plasma.data.should.eql({ '_root': 'I should be at the root!' });
      plasma.data = {};
      plasma.load('test/fixtures/not-data.json');
      plasma.data.should.not.eql({ '_root': 'I should be at the root!' });
    });

    it('should allow a custom namespace option to be passed:', function () {
      plasma.option('namespace', function(fp) {
        return fp.replace(/[\\\/]+/g, '/');
      });

      var actual = plasma.load(['test/fixtures/b.json']);
      actual.should.eql({'test/fixtures/b.json': {bbb: 'data from b.json'}});
    });
  });
});
