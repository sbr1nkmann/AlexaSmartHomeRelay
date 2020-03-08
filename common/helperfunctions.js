let AlexaResponse = require("./Alexa");

function checkValue(value, defaultValue) {

    if (value === undefined || value === {} || value === "")
        return defaultValue;

    return value;
}

function createError(request, errormsg) {
    var opts = {};
    opts.header = request.body.directive.header;
    opts.header.name = "ErrorResponse";
    opts.endpoint = request.body.directive.endpoint;

    let alexaerrorresponse = new AlexaResponse(opts);
    alexaerrorresponse.addPayload(errormsg); 
         
    return alexaerrorresponse.get();
}

function geterror_DIRECTIVEMISSING() {
    return {
        "name": "ErrorResponse",
        "payload": {
            "type": "INVALID_DIRECTIVE",
            "message": "Missing key: directive"
        }
    };
};

function geterror_INVALIDDIRECTIVE() {
    return {
        "type": "INVALID_DIRECTIVE",
        "message": "The directive is not supported by the skill, or is malformed"
    };
};


function geterror_HEADERNAMEMISSING() {
    return {
        "type": "INVALID_DIRECTIVE",
        "message": "Missing key: directive.header.name"
    };
};

function geterror_OOPS() {
    return {
        "type": "INVALID_DIRECTIVE",
        "message": "OOPS.. something went wrong"
    };
};

function geterror_INVALIDINTERFACE() {
    return {
        "type": "INVALID_VALUE",
        "message": "This interface is not supported by the skill, or is malformed"
    };
};

module.exports.checkValue = checkValue;
module.exports.createError = createError;
module.exports.geterror_DIRECTIVEMISSING = geterror_DIRECTIVEMISSING;
module.exports.geterror_INVALIDDIRECTIVE = geterror_INVALIDDIRECTIVE;
module.exports.geterror_INVALIDINTERFACE = geterror_INVALIDINTERFACE;
module.exports.geterror_OOPS = geterror_OOPS;
module.exports.geterror_HEADERNAMEMISSING = geterror_HEADERNAMEMISSING;