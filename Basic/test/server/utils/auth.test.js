let auth = require('../../../server/utils/auth');
let chai = require('chai');
let expect = chai.expect;

describe('server/utils/auth.js', function() {
  const USERNAME = 'test';
  var token, wrong_token;

  it('should return null if not given username', function() {
    token = auth.encode();
    expect(token).to.be.null;
  });

  it('should return the token if given username', function() {
    token = auth.encode(USERNAME);
    expect(token).not.to.be.null;
  });

  it('should return null if given wrong token', function() {
    var decoded = auth.decode(wrong_token);
    expect(decoded).to.be.null;
  });

  it('should return username if given correct token', function() {
    var decoded = auth.decode(token);
    expect(decoded).not.to.be.null;
    expect(decoded.username).to.be.equal(USERNAME);
  });
});
