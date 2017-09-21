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
    
    
    
    return getSharedLinkInformation(assetName,ccApiKey, imsToken, msTeamsWebhook, params.additionalData);    
}

function getSharedLinkInformation(assetName, ccApiKey, token, msTeamsWebhook, additionalData) { 
    
	return request({
		"method":"GET", 
		"uri": "https://cc-api-storage.adobe.io/files/" + assetName + "/:metadata",
		"headers": {"x-api-key": ccApiKey, "Authorization":"Bearer "+token, "metadata":":metadata", "Accept": "application/vnd.adobe.file+json" }
        }).then(function(body) {
		
			var parsedBody = JSON.parse(body);
			var id = parsedBody.id.split("/")[1];
			
			return request({
				"method":"GET",
				"uri":"https://cc-collab.adobe.io/links/https://cc-us1-prod.adobesc.com/api/v1/assets/"+id,
				"headers": {"x-api-key": ccApiKey, "Authorization":"Bearer "+token}
				}).then( function(linkInformation) {

                
                    var parsedLink = JSON.parse(linkInformation);
                
                    var msTeamsCard = {
                            "@type": "MessageCard",
                            "@context": "http://schema.org/extensions",
                            "summary": "New File Shared",
                            "themeColor": "0078D7",
                            "sections": [
                            {
                                "Title": "New file " + parsedLink.name + " shared via the Creative Cloud",
                                "activitySubtitle": "subtitle",
                                "activityImage": parsedLink.resources[0].renditions["500"],
                                "activityText": additionalData.message,
                                "facts":[
                                    { "name": " ", "value": "[Open in Creative Cloud]("+parsedLink.publicURL+")" } 
                                ]
                            }
                          ]
                    }
                    
                    return request({
                            "method":"POST",
                            "uri":msTeamsWebhook,
                            "body":JSON.stringify(msTeamsCard),
                            "headers": {"Content-Type":"application/json"}
                            }).then( function(msResult) {
                    
                                return {msResult:msResult};
                });
				
            });
		
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
