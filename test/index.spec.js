var assert = require('assert');
var status = require('http-status');
var request = require('superagent');
var jsonFile = require('jsonfile');
var reqList = jsonFile
    .readFileSync('./requests.json');
// extend with Request#proxy()
require('superagent-proxy')(request);

// HTTP, HTTPS, or SOCKS proxy to use
var proxy = 'http://127.0.0.1:3128';
describe('Carregando Lista...', (done) => {
    reqList.forEach((item, index) => {
        it('Get '+item.nome, (done) => {
            request
                .get(item.url)
                .proxy(proxy)
                .end(onresponse);
            function onresponse(err, res) {
                if (err) done(err);
                else {
                    let last = reqList[index].lastModified[reqList[index].lastModified.length - 1 ];
                    if (res.header['last-modified'] != last) {
                        reqList[index].lastModified.push(res.header['last-modified']);
                        reqList[index].erroDate.push(new Date());

                    }
                    reqList[index].count ++;
                    jsonFile.writeFileSync('./requests.json', reqList);
                    assert.equal(res.status, 200);
                    assert.equal(res.header['last-modified'], last);
                    done();
                }
            }
        }).timeout(20000);
    });

});