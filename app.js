

var path_module = require('path');
const fs = require('fs');
let config = JSON.parse(fs.readFileSync('./config/config.json'));

var module_holder = {};
var module_loaded = [];
Object.entries(config.devices).forEach(entry => {
    Object.entries(entry[1].capabilities).forEach(entry => {
        if (!module_loaded.includes(entry[1])) {
            require("./cap_interfaces/" + entry[1])(module_holder);
            module_loaded.push(entry[1]);
        };
    });
});

console.log("starting  -----");
console.log("modules loaded:" );
Object.entries(module_loaded).forEach(entry => {
    console.log("-%s", entry[1]);
});

let AlexaResponse = require("./common/Alexa");
let helper = require('./common/helperfunctions');

const request = require('request');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(config.server.path, (request, result) => {

    console.log("index.handler request  -----");
    console.log(JSON.stringify(request.body));

    if ((!'directive' in request.body)) {
        let alexaerrorresponse = new AlexaResponse(helper.geterror_DIRECTIVEMISSING());
        sendResponse(result, 200, alexaerrorresponse.get());
        return;
    };

    let headernamespace = (((request.body || {}).directive || {}).header || {}).namespace;

    switch (headernamespace) {
        case 'Alexa.Authorization':
            alexaAuthorization(request, result);
            return;

        case 'Alexa.Discovery':
            alexaDiscovery(request, result);
            return;

        case 'Alexa':
            //TO-DO
            //State
            sendResponse(result, 200, helper.createError(request, helper.geterror_OOPS()));
            return;            

        default:
            if ((!module_loaded.includes(headernamespace))) {
                sendResponse(result, 200, helper.createError(request, helper.geterror_INVALIDINTERFACE()));
                return;
            };

            performAction(request);

            sendResponse(result, 200, helper.createError(request, helper.geterror_OOPS()));
            return;
    };


});

app.listen(config.server.port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log('server is listening on  0.0.0.0:%s', config.server.port);
});

function sendResponse(result, status, response) {

    // TODO Validate the response
    console.log("%d index.handler response -----", Date.now());
    console.log(JSON.stringify(response));
    result.status(status).json(response);
}

function alexaAuthorization (request, result) {
    var opts = {};
    opts.header = request.body.directive.header;
    opts.header.name = "AcceptGrant.Response";
    opts.endpoint = request.body.directive.endpoint;

    let alexaauthresponse = new AlexaResponse(opts);
    sendResponse(result, 200, alexaauthresponse.get());
}

function alexaDiscovery (request, result) {
    var opts = {};
    opts.header = request.body.directive.header;
    opts.header.name = "Discover.Response";

    let alexadiscoverresponse = new AlexaResponse(opts);

    Object.entries(config.devices).forEach(entry => {
        let device = entry[1];
        let capopts = {};
        let capabilities = [];

        Object.entries(device.capabilities).forEach(entry => {
            capabilities.push(module_holder[entry[1] + ".getcapabilities"](capopts));
        });
        //capabilities.push({"type": "AlexaInterface","interface": "Alexa","version": "3"});

        alexadiscoverresponse.addPayloadEndpoint(
            {
                "endpointId": device.endpointId,
                "manufacturerName": device.manufacturerName,
                "description": device.description,
                "displayCategories": device.displayCategories,
                "friendlyName": device.friendlyName,
                "capabilities": capabilities
            }
        );
    });

    sendResponse(result, 200, alexadiscoverresponse.get());
}


function performAction(request) {

}
