let uuid = require('uuid');
let helper = require('../common/helperfunctions');

class Alexa {
    constructor(opts) {

        if (opts === undefined)
            opts = {};

        if (opts.context !== undefined)
            this.context = helper.checkValue(opts.context, undefined);

        if (opts.header === undefined)       
            opts.header = {};

        if (opts.endpoint === undefined)       
            opts.endpoint = {};       
            
        if (opts.endpoint.scope === undefined)       
            opts.endpoint.scope = {};                       

        if (opts.event !== undefined)
            this.event = helper.checkValue(opts.event, undefined);
        else
            this.event = {
                "header": {
                    "namespace": helper.checkValue(opts.header.namespace, "Alexa"),
                    "name": helper.checkValue(opts.header.name, "Response"),
                    "messageId": helper.checkValue(opts.header.messageId, uuid.v4()),
                    "correlationToken": helper.checkValue(opts.header.correlationToken, undefined),                    
                    "payloadVersion": helper.checkValue(opts.header.payloadVersion, "3")
                },
                "endpoint": {
                    "scope": {
                        "type": "BearerToken",
                        "token": helper.checkValue(opts.endpoint.scope.token, "INVALID"),
                    },
                    "endpointId": helper.checkValue(opts.endpoint.endpointId, "INVALID")
                },
                "payload": helper.checkValue(opts.payload, {})
            };

        // No endpoint in an AcceptGrant or Discover request
        if (this.event.header.name === "AcceptGrant.Response" || this.event.header.name === "Discover.Response")
            delete this.event.endpoint;

    }

    addContextProperty(opts) {

        if (this.context === undefined)
            this.context = { properties: [] };

        this.context.properties.push(this.createContextProperty(opts));
    }

    addPayload(opts) {
        if (this.event.payload === undefined)
            this.event.payload = {};       

        this.event.payload = opts;   
    }

    addPayloadEndpoint(opts) {

        if (this.event.payload.endpoints === undefined)
            this.event.payload.endpoints = [];

        this.event.payload.endpoints.push(this.createPayloadEndpoint(opts));
    }

    createContextProperty(opts) {
        return {
            'namespace': helper.checkValue(opts.namespace, "Alexa.EndpointHealth"),
            'name': helper.checkValue(opts.name, "connectivity"),
            'value': helper.checkValue(opts.value, { "value": "OK" }),
            'timeOfSample': new Date().toISOString(),
            'uncertaintyInMilliseconds': helper.checkValue(opts.uncertaintyInMilliseconds, 0)
        };
    }

    createPayloadEndpoint(opts) {

        if (opts === undefined) opts = {};

        // Return the proper structure expected for the endpoint
        let endpoint =
        {
            "endpointId": helper.checkValue(opts.endpointId, 'endpoint-001'),
            "manufacturerName": helper.checkValue(opts.manufacturerName, "Sample Manufacturer"),
            "description": helper.checkValue(opts.description, "Sample Endpoint Description"),        
            "friendlyName": helper.checkValue(opts.friendlyName, "Sample Endpoint"),
            "displayCategories": helper.checkValue(opts.displayCategories, ["OTHER"]),                   
            "cookie": helper.checkValue(opts.cookie, {}),
            "capabilities": helper.checkValue(opts.capabilities, [])
        };

        return endpoint
    }

    createPayloadEndpointCapability(opts) {

        if (opts === undefined) opts = {};

        let capability = {};
        capability['type'] = helper.checkValue(opts.type, "AlexaInterface");
        capability['interface'] = helper.checkValue(opts.interface, "Alexa");
        capability['version'] = helper.checkValue(opts.version, "3");
        let supported = helper.checkValue(opts.supported, false);
        if (supported) {
            capability['properties'] = {};
            capability['properties']['supported'] = supported;
            capability['properties']['proactivelyReported'] = helper.checkValue(opts.proactivelyReported, false);
            capability['properties']['retrievable'] = helper.checkValue(opts.retrievable, false);
        }
        return capability
    }

    get() {
        return this;
    }
}

module.exports = Alexa;