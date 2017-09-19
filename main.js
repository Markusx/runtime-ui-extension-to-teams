var ACTION_LOAD = "load";
var ACTION_VALIDATE = "validate";
var ACTION_SUBMIT =  "submit";
var ACTION_ENCRYPT = "encrypt";

var request = require('request-promise');

function loadDialog() {
    
    return {
        "type":"dialog",
        "properties":{
            "headerText":"Post to Microsoft Teams",
            "bodyText":"",
            "buttonOkayText":"SUBMIT"
        },

        "children": [   
            {
                "type":"textarea",
                "properties":{
                    "label":"Message",
                    "text":"Message",
                    "placeholder":"check out this cool design in Creative Cloud",
                    "propertyName":"message"
                }
            }
        ]
    }
}


function validate() {
    
    return {
        "success":true,
        "valid":true
    }
}

function submit(params) {
    
    var ccApiKey = params.ccApiKey;
    var msTeamsWebhook = params.msTeamsWebhook;
    
    var imsToken = params.additionalData.imsToken;
    var assetName = params.additionalData.name;
    
    
    
    return getMetadata(assetName,ccApiKey, imsToken);    
}

function getMetadata(assetName, ccApiKey, token) { 
    
	return request({
		"method":"GET", 
		"uri": "https://cc-us1-prod.adobesc.com/api/v1/mounts/" + assetName
		"headers": {"x-api-key": ccApiKey, "Authorization":"Bearer "+token, "metadata":":metadata", "Accept": "application/vnd.adobe.file+json" }
        }).then(function(body) {
			return {body:body};
		});
}

var main = function (params) {

    var action = params.action;
  
    if ( !action || action =='' ) {
      //  return {"error":"Missing action parameter"};
    }

    
    switch ( action ) {
            
        case ACTION_LOAD:
            return loadDialog(params);
        break;
            
        case ACTION_VALIDATE:
            return validate(params);
        break;
            
        case ACTION_SUBMIT:
            return submit(params);
        break;
  
        case ACTION_ENCRYPT:
            return keyEncrypt(params);
        break;
            
        default:
//            return {"error":"No matching action found"};
        break;
            
    }
    
  return {"hey":"there", "params":params};
};
