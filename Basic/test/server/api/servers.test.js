"use strict";
let XMLHttpRequest=require('xmlhttprequest').XMLHttpRequest;
global.XMLHttpRequest = XMLHttpRequest;
import { describe, it } from 'mocha';
var chai = require('chai');
var expect = chai.expect;

var res = chai.spy();

let api= require('../../../server/api/servers');

describe('server/api/servers.js', function(){

  describe('list_all_workspaces', function () {
    it('no user should return empty', function () {
      api.list_all_workspaces({}, res).then(message => {
       expect(spy).to.be.called.with('[]');
        }
      );

        .to.be.eql([]);
    });

    it('user with no active server should return empty', function () {
      api.list_all_workspaces({user:'test'}).then( res => {
        expect(res).to.be.eql([]);
      });
    });

  });

});
