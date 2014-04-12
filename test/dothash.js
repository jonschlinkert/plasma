/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const file = require('fs-utils');
const plasma = require('../');



/**
 * Expand {'foo.bar': 'baz'} to {foo: {bar: 'baz'}}
 *
 * Requires > v0.2.0 of expand-hash
 */

describe('when "dot hash" strings are used', function () {
  it('should return an object with the name from the `name` property', function (done) {
    var fixture = [{dothash: true, name: 'foo.bar.baz', src: ['test/fixtures/*.{json,yml}'], one: {two: 'three'} }];
    var actual = plasma.load(fixture).data;

    var expected = {foo: {bar: {baz: {aaa: 'bbbb', ccc: 'dddd', eee: 'ffff'} } }, one: {two: 'three'}};
    expect(actual).to.deep.equal(expected);
    done();
  });

  describe('when mixed data is passed in:', function () {
    it('should return an object', function (done) {
      var fixture = {dothash: true, a: 'b', c: 'd', name: 'e.f.g', src: 'test/fixtures/b.json'};
      var actual = plasma.load(fixture).data;

      var expected = {a: 'b', c: 'd', e: {f: {g: {ccc: 'dddd'} } } };
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  it('should return an object with the name from the `name` property', function (done) {
    var fixture = {dothash: true, name: 'foo.bar', src: ['test/fixtures/*.{json,yml}'], one: {two: 'three'}};
    var actual = plasma.load(fixture).data;

    var expected = {foo: {bar: {aaa: 'bbbb', ccc: 'dddd', eee: 'ffff'} }, one: {two: 'three'} };
    expect(actual).to.deep.equal(expected);
    done();
  });


  it('should return an object with the name from the `name` property', function (done) {
    var fixture = {name: ':dirname.:basename', src: ['test/fixtures/i18n/*.json']};
    var actual = plasma.load(fixture).data;

    var expectedi18n = {
      ':dirname.:basename': {
        'select-language': 'மொழி தேர்வு',
        es: '<%= es %>',
        de: '<%= de %>',
        fi: '<%= fi %>',
        he: '<%= he %>',
        hi: '<%= hi %>',
        ja: '<%= ja %>',
        ml: '<%= ml %>',
        nl: '<%= nl %>',
        ta: '<%= ta %>'
      }
    };

    expect(actual).to.deep.equal(expectedi18n);
    done();
  });

  it('should return an object with the name from the `name` property', function (done) {
    var fixture = {dothash: true, name: ':dirname.:basename', src: ['test/fixtures/i18n/*.json']};
    var actual = plasma.load(fixture).data;

    var expectedi18n = {
      i18n: {
        en: {
          'es': '<%= es %>',
          'es': '<%= es %>',
          'de': '<%= de %>',
          'fi': '<%= fi %>',
          'he': '<%= he %>',
          'hi': '<%= hi %>',
          'ja': '<%= ja %>',
          'ml': '<%= ml %>',
          'nl': '<%= nl %>',
          'ta': '<%= ta %>'
        },
        de: {'select-language': 'Wählen Sie eine Sprache'},
        es: {'select-language': 'Seleccione el idioma'},
        fi: {'select-language': 'Valitse kieli'},
        he: {'select-language': 'בחר את השפה'},
        hi: {'select-language': 'भाषा चुनें'},
        ja: {'select-language': '言語を選択する'},
        ml: {'select-language': 'ഭാഷ തിരഞ്ഞെടുക്കുക'},
        nl: {'select-language': 'Selecteer taal'},
        ta: {'select-language': 'மொழி தேர்வு'}
      }
    };
    expect(actual).to.deep.equal(expectedi18n);
    done();
  });
});