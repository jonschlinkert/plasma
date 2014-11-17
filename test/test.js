/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var should = require('should');
var Plasma = require('..');
var plasma;

describe('plasma.load()', function () {
  beforeEach(function() {
    plasma = new Plasma();
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

  describe('array of files:', function () {
    it('should load an array of files:', function () {
      plasma.option('namespace', function(fp) {
        return path.basename(fp, path.extname(fp));
      });

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
