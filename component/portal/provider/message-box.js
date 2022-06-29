portal.messageBox = new function() {

	this.confirm = function(message, title, yesCallback, noCallback) {
		var content = '<div class="message-box-icon message-box-question-icon"></div>'
	    			+ '<div class="message-box-message" >' + message + '</div>';		
		var config = new Object();
		config.title = title;
		config.titleCls = 'message-box-question-color';
		config.content = content;
		config.width = 400;
		config.height = 180;
		config.top = 200;
		config.modal = true;
		config.buttons = [ {
			text : portal.i18n.get('MDL_BTN_YES'),
			cls : 'btn-success',
			callback : function() {
				if (yesCallback) {
					yesCallback();
				}
			}
		}, {
			text : portal.i18n.get('MDL_BTN_NO'),
			cls : 'btn-danger',
			callback : function() {
				if (noCallback) {
					noCallback();
				}
			}
		} ];
		portal.ui.show(config);
	}

	
	this.info = function(message){
		this.show(message, portal.config.APPLICATION_NAME, 'info');
	}
	this.warn = function(message){
		this.show(message, portal.config.APPLICATION_NAME, 'warning');
	}
	this.error = function(message){
		this.show(message, portal.config.APPLICATION_NAME, 'error');
	}
	this.success = function(message){
		this.show(message, portal.config.APPLICATION_NAME, 'success');
	}
	
	
	/*Ícones: info, warning, error, success, question*/
	var show = [];

	this.show = function() {
		this.show[arguments.length - 1].apply(this, arguments);
	}

	this.show[0] = function(message) {
		showService(message, portal.config.APPLICATION_NAME, 'info', null, null);
	}

	this.show[1] = function(message, title) {
		showService(message, title, 'info', null, null);
	}

	this.show[2] = function(message, title, icon) {
		showService(message, title, icon, null, null);
	}

	this.show[4] = function(message, title, icon, width, height) {
		showService(message, title, icon, width, height);
	}

	function showService(message, title, icon, width, height) {
		if(isNullOrEmpty(icon)){return;}
		icon = icon.toLowerCase();
		if(icon == 'warning'){icon = 'warn';}
		var classIcon = 'message-box-' + icon + '-icon';
		var buttonClassName = 'btn-' + (icon == 'error' ? 'danger' : icon);
		var content = '<div class="message-box-icon ' + classIcon + '"></div>'
				    + '<div class="message-box-message" >' + message + '</div>';
		var config = new Object();
		config.title = title;
		config.titleCls = 'message-box-' + icon + '-color';
		config.content = content;
		config.width = width != null && width > 400 ? width : 400;
		config.height = height != null && height > 70? height : 180;
		config.top = 200;
		config.buttons = [ {
			text : portal.i18n.get('MDL_BTN_OK'),
			cls : buttonClassName,
			isCloseModal : true
		} ];
		config.modal = true;
		portal.ui.show(config);
	}

}