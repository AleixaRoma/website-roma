
portal.service = new function(){

    this.invoke = function(config){
        var data;
        var dataType; 

        if(config.data == undefined || config.data == null){
            data = null;
            dataType = 'json';

        }else if(typeof config.data === "string"){
            data = config.data;
            dataType = 'text';

        }else{
            var entity = portal.utility.clone(config.data);
            data = JSON.stringify(entity);
            dataType = 'json';
        }

        var request = {};
        request.device = 'web';
        request.sessionId = portal.config.getSessionId();
        request.dataType = dataType;
        request.data = data;

        var onSuccess = function(response){
            if(config.onSuccess){
                var result;
                if(response.dataType == 'json'){
                    result = JSON.parse(response.data);
                }else{
                    result = response.data;
                }     
                if(result.sessionId != undefined && result.sessionId != null){
                    portal.config.setSessionId(result.sessionId);
                }            
                config.onSuccess(result);
            }
        }

        var onError = function(response){
            var result;
            if(response.dataType == 'json'){
                result = JSON.parse(response.data);
            }else{
                result = response.data;
            }
            if(config.onError){
                config.onError(response.statusCode, result);
            }else{
                portal.service.onError(response.statusCode, result);
            }
        }

        portal.web.post(config.url, request, onSuccess, onError);
    };
    
    this.onError = function(statusCode, ex){
        if(statusCode == 412){
            portal.notify.warn(ex);
        }else{
            portal.notify.error(ex);
        }
        console.error(ex);
    };

};

