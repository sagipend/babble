'use strict';

let assert = require('assert');
let messages = require('../../server/messages-util');

describe('Message', function() {
  it('should load the messages module', function() {
    assert.notEqual(null, messages);
  });
  it('should be able to add a new message and return id', function() {
    let message = {message: '1'};
    let id = messages.addMessage(message);
    assert.notEqual(null, id);
  });
  it('should return new messages', function() {
    let all = messages.getMessages(0);
    let newMessage = {message: '2'};
    messages.addMessage(newMessage);
    let newMessages = messages.getMessages(all.length);
    assert.deepEqual(newMessages, [newMessage]);
  });
  it('should be able to delete a message', function() {
    let message = {message: '3'};
    let id = messages.addMessage(message);
    messages.deleteMessage(id);
    assert.equal(null, messages.getMessages(0).find(m => m.id === id));
  });
});

// var module = require('./testYourServerSide.js');
var module = require('../../server/main.js');

var chai = require('chai')
var  chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;

describe('Check server listening functions:', function () {
  beforeEach(function () {
    module.serverFunc.listen(9000);
  });

var url = 'http://localhost:9000';

  describe('request Check reuqest errors:', function () {
    it('Post user message', function (done) {
      chai.request(url)
        .post('/messages')
        .send({ name: "Shuki", email: "shuki@gmail.com", message: "I am Shuki!", timestamp: 1502991635 })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          assert.equal(true, (module.msgObjects).some(m => m.name === "Shuki" && m.email === "shuki@gmail.com" && m.message === "I am Shuki!" && m.timestamp === 1502991635 && m.id === JSON.parse(res.text).id), " user message not find");
          done();
        });
    });

    it('Delete shuki message', function (done) {
      chai.request(url)
        .delete('/messages/0')
        .end(function (err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('Status should be 405', function (done) {

      chai.request('http://localhost:9000')
        .get('/messages')
        .end(function (err, res) {
          expect(res).to.have.status(405);
          done();
        });

    });



  });




  afterEach(function () {

    // runs after each test in this block

    module.serverFunc.close();

  });

});

