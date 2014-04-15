/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const plasma = require('../');


describe('plasma.load():', function () {
  describe('when an object of functions is passed', function () {
    it('should return the functions on the data object', function (done) {
      var fixture = {
        uppercase: function(str) {
          return str.toUpperCase();
        },
        lowercase: function(str) {
          return str.toLowerCase();
        }
      };
      var actual = plasma.load(fixture);
      expect(actual.data.lowercase).to.be.a('function');
      expect(actual.data.uppercase).to.be.a('function');
      done();
    });
  });

  describe('when an array of objects of functions is passed', function () {
    it('should return the functions on the data object', function (done) {
      var fixture = [{
        uppercase: function(str) {
          return str.toUpperCase();
        }
      },{
        lowercase: function(str) {
          return str.toLowerCase();
        }
      }];
      var actual = plasma.load(fixture);
      expect(actual.data.lowercase).to.be.a('function');
      expect(actual.data.uppercase).to.be.a('function');
      done();
    });
  });
});