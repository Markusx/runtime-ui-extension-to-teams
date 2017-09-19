var main = function (params) {

    var request = require("request-promise");
   
    var request = require('request');
    var url ='https://requestb.in/1gurela1'
    var options = {
        uri:url,
        form:{body:params}
    }
    request(url, function (error, response, body) {
      if (!error) {
        console.log(body);
      }
    });

    if ( params.action == 'sendMessage' ) {
             
  }
  
  return {"hey":"there"};
};
