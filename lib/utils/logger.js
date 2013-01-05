"use strict";

module.exports={
    info:function(msg, para){
        console.info.apply(this, arguments);
    },
    error:function(msg, para){
        console.error.apply(this, arguments);
    }
};

