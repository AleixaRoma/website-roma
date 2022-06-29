portal.web = new function() {

	this.get = function(url, onSuccessCallback, onErrorCallback) {
		var paramSuccessCallback = function(data) {
			if (onSuccessCallback) {
				onSuccessCallback(data);
			} else {
				defaultSuccessCallback(data);
			}
		}
		var paramErrorCallback = function(data) {
			if (onErrorCallback) {
				onErrorCallback(data, state);
			} else {
				defaultErrorCallback(data);
			}
		}
		invoke('GET', url, null, paramSuccessCallback, paramErrorCallback);
	}

	this.post = function(url, data, onSuccessCallback, onErrorCallback) {
		var paramSuccessCallback = function(data) {
			if (onSuccessCallback) {
				onSuccessCallback(data);
			} else {
				defaultSuccessCallback(data);
			}
		}
		var paramErrorCallback = function(data) {
			if (onErrorCallback) {
				onErrorCallback(data);
			} else {
				defaultErrorCallback(data);
			}
		}
		invoke('POST', url, data, paramSuccessCallback, paramErrorCallback);
	}

	function invoke(method, url, data, onSuccessCallback, onErrorCallback) {
        if (isNullOrEmpty(url)) {return;}
		
        var dataType = null;
		var dataContent = null;
		var contentType = null;
		
		if(url.startsWith('/')){
			url = portal.config.URL_SERVER_MODULE + url;
		}

		if(method == 'GET' || (!isNullOrEmpty(data) && (
			typeof data === "string" || typeof data === "number" || typeof data === "boolean"))){
			dataType = 'text';
			dataContent = data;
			contentType = 'text/plain';
        }else {
			dataType = 'json';  
            dataContent = JSON.stringify(data);
			contentType = 'application/json';      
		}

		$(document).ajaxStart(portal.ui.lock).ajaxStop(portal.ui.unlock);
		$.ajax({
			type : method,
			url : url,
			data : dataContent,
		    dataType : dataType,
		    contentType: contentType,
		    cache: false,
			crossDomain: true,
			beforeSend: function(request) {
				request.setRequestHeader("application-key", portal.config.APPLICATION_KEY);
				request.setRequestHeader("session-key", portal.config.SESSION_KEY);
			},
			success: function(response, status, jqXHR){
				if(typeof response === "string" || response.statusCode == 200){
					if(onSuccessCallback){onSuccessCallback(response);}
				}else{
					if(onErrorCallback){onErrorCallback(response);}
				}
			},

			error: function(jqXHR, status, errorThrown){
				if(jqXHR.status == 451){
					portal.notify.error(portal.i18n.get('MSG_NTF_NOT_PERMISSION'));	
					setTimeout(function(){
						window.location = portal.config.APPLICATION_URL;
					},3000);
	
				} else if(jqXHR.status == 200){
					if (jqXHR.data != undefined) {
						if(onErrorCallback){onErrorCallback(jqXHR.data);}
						
					}else if(jqXHR.responseText != undefined){
						if(onErrorCallback){onErrorCallback(jqXHR.responseText);}
						
					}else{
						if(onErrorCallback){onErrorCallback(jqXHR);}
					}					
	
				} else {
					if(onErrorCallback){onErrorCallback(jqXHR);}
				
				}
			}
		});

	}

	function defaultSuccessCallback(data) {}

	function defaultErrorCallback(response) {
		if (response == undefined || response == null 
		 || response.statusCode == undefined || response.statusCode == null
		 || response.data == undefined || response.data == null) {
			portal.notify.error(portal.i18n.get('MSG_NTF_DONT_RESPONSE'));

		}else if(response.statusCode == 412){
			portal.notify.warn(response.data);

		}else if(response.statusCode == 406){
			portal.messageBox.show(response.data, portal.config.APPLICATION_NAME, 'warn');

		}else{
			portal.messageBox.show(response.data, portal.config.APPLICATION_NAME, 'error');

		}
	}

}
