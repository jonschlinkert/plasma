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

  describe('options:', function () {
    describe('namespace:', function () {
      it('should namespace data from files by default:', function () {
        var actual = plasma.load(['test/fixtures/b.json']);
        actual.should.eql({b: {bbb: 'data from b.json'}});
      });

      it('should disable namespacing when set with plasma.disable()`:', function () {
        plasma.disable('namespace');
        var a = plasma.load(['test/fixtures/a.json']);
        a.should.eql({aaa: 'data from a.json'});
      });

      it('should re-enable namespacing with plasma.enable()`:', function () {
        // disable
        plasma.disable('namespace');
        var a = plasma.load(['test/fixtures/a.json']);
        a.should.eql({aaa: 'data from a.json'});

        // re-enable
        plasma.enable('namespace');
        var b = plasma.load(['test/fixtures/b.json']);
        b.should.eql({aaa: 'data from a.json', b: {bbb: 'data from b.json'}});
      });

      it('should allow a custom namespace option to be passed:', function () {
        plasma.option('namespace', function(fp) {
          return fp.replace(/[\\\/]+/g, '/');
        });

        var actual = plasma.load(['test/fixtures/*.json']);
        actual.should.eql({'test/fixtures/b.json': {bbb: 'data from b.json'}});
      });
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
