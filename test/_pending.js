/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const file = require('fs-utils');
const plasma = require('../');

describe('when plasma.process() is used on a config object', function () {

  xit('should use the basename of each data file as the namespace for its config object', function (done) {
    var fixture = [{name: 'i18n.:dirname', src: ['test/fixtures/i18n/*.json'] }];
    var expected = file.readJSONSync('test/expected/i18n.json');
    expect(plasma.process(fixture)).to.deep.equal(expected);
    done();
  });
});