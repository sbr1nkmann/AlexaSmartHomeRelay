let helper = require('../common/helperfunctions');

function getcapabilities(opts) {
    
    if (opts === undefined) opts = {};

    let capability = {};
    capability['type'] = "AlexaInterface";
    capability['interface'] = "Alexa.PercentageController";
    capability['version'] = "3";
    capability['properties'] = {};
    capability['properties']['supported'] = [];
    capability['properties']['supported'][0] = {};
    capability['properties']['supported'][0]['name'] = "percentage";
    capability['properties']['proactivelyReported'] = helper.checkValue(opts.proactivelyReported, false);
    capability['properties']['retrievable'] = helper.checkValue(opts.retrievable, false);
    return capability
};

function getcontextproperties(opts) {
    
    if (opts === undefined) opts = {};

    let properties = {};
    properties['namespace'] = "Alexa.PowerContrPercentageControlleroller";
    properties['name'] = "percentage"
    properties['value'] = helper.checkValue(opts.value, 0);
    properties['timeOfSample'] = Date.now().toISOString();
    properties['uncertaintyInMilliseconds'] = 500;

    return properties;
};    

module.exports = function(module_holder) {
    module_holder['Alexa.PercentageController.getcapabilities'] = getcapabilities;
    module_holder['Alexa.PercentageController.getcontextproperties'] = getcontextproperties;
};