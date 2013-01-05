"use strict";

module.exports =  {
    send: function(res, statusCode, body){
        res.writeHead(statusCode);
        res.write('' + JSON.stringify(body));
        res.end();
    }
}