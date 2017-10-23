var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var sinon = require('sinon');
var expect = chai.expect;

// 测试模块及其依赖
let apiUser = require('../../../server/api/user');
let sequelize = require('../../../server/sequelize');
let Sequelize = require('sequelize');
let User = require('../../../server/model/USER_INFO')(sequelize, Sequelize);

describe('server/api/user.js', function() {
  const USERNAME = 'test', PASSWORD = 'test';
  // 固定数据库的返回值
  var stub;
  before(function() {
    stub = sinon.stub(User,'findOne').returns({USER_NAME:USERNAME, PASSWORD:PASSWORD});
  });
  after(function() {
    stub.restore();
  });
  // 测试登录
  describe('post-->/login', function() {
    it('should return 403 if username is not given', function(){
      chai.request(apiUser)
        .post('/login')
	.send({password: PASSWORD})
	.end(function(err, res){
	  expect(res).to.have.status(403);
	});
    });
    it('should return 403 if password is not given', function() {
      chai.request(apiUser)
        .post('/login')
	.send({username: USERNAME})
	.end(function(err, res){
	  expect(res).to.have.status(403);
	});
    });
    it('should return 403 if username not found', function(){
      chai.request(apiUser)
        .post('/login')
	.send({username: 'not_found', password: PASSWORD})
	.end(function(err, res) {
	  expect(res).to.have.status(403);
	});
    });
    it('should return 403 if invalid password', function(){
      chai.request(apiUser)
        .post('/login')
	.send({username: USERNAME, password:'invalid_password'})
	.end(function(err, res){
	  expect(res).to.have.status(403);
	});
    });
    it('should return 200, token and cookie `aura_token` if login successfully', function(){
      chai.request(apiUser)
        .post('/login')
	.send({username: USERNAME, password: PASSWORD})
	.end(function(err, res){
	  expect(res).to.have.status(200);
	  expect(res.token).not.to.be.undefined;
	  expect(res).to.have.cookie('aura_token');
	});
    });
  });
});
