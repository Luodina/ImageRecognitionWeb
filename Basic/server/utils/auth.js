'use strict';
let jwt = require('jsonwebtoken');
let UUID = require('uuid');
let SECRET = '1234';
const THREE_HOURS = 60 * 60 * 3; // Seconds in 3 hours

function init() {
  // TODO: a more complex SECRET??
  let opts = {
    msec: new Date('2017-09-15').getTime(),
    nsecs: 5390
  };
  SECRET = UUID.v1('123456');
}

// init();

module.exports =  {
  encode: function(username) {
    if(!username) {
      return null;
    }
    let plaintext = {
      username: username,
      iat: Date.now()/1000,
      exp: Date.now()/1000 + THREE_HOURS
    };
    let ciphertext = jwt.sign(plaintext, SECRET);
    return ciphertext;
  },
  decode: function(ciphertext) {
    if(!ciphertext) {
      return null;
    }
    try {
      let plaintext = jwt.verify(ciphertext, SECRET);
      if(plaintext.username) {
        return plaintext;
      }else {
        return null;
      }
    }catch(err) {
      return null;
    }
  }
};

