var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var sinon = require('sinon');
var expect = chai.expect;

// 测试模块及其依赖
let app = require('../../server/app');

describe('server/app.js', function() {
  const USERNAME = 'test', PASSWORD = 'test'; 
  describe('get-->/', function() {
    var token, wrong_token;
    var agent = chai.request.agent(app);
    it('should return 403 if no token nor cookies', function(){
      agent.get('/')
        .end(function(err, res){
	  expect(res).to.have.status(403);
	});
    });
    it('should return 200 if login successfully', function(){
      agent.post('/api/user/login')
        .send({username: USERNAME, password: PASSWORD})
        .end(function(err, res){
	  expect(res).to.have.status(200);
	  expect(res.token).not.to.be.undefined;
	  expect(res).to.have.cookie('aura_token');
          token = res.token;
      });
    });
    it('should return 403 if given wrong token', function(){
      chai.request(app)
        .get('/')
        .send({token: wrong_token})
	.end(function(err, res) {
	  expect(res).to.have.status(403);
	});
    });
    it('should return 200 if given correct token', function(){
      chai.request(app)
        .get('/')
        .send({token: token})
	.end(function(err, res){
	  expect(res).to.have.status(200);
	});
    });
    it('should return 200 if given cookies only', function() {
      agent.get('/')
	.end(function(err, res){
	  expect(res).to.have.status(200);
        });
    });
    it('should return 200 if given both token and cookies', function(){
      agent.get('/') 
        .send({token: token})
	.end(function(err, res){
	  expect(res).to.have.status(200);
	});
    });
  });
});
