portal.ui = new function() {
	
	this.tabs = null;
	
	this.lock = function(message) {
		if(isNullOrEmpty(message)){message = portal.i18n.get('MSG_UI_LOCK_DEFAULT');}
		$.blockUI({
			message: message,
			css: { 
	            border: 'none', 
	            padding: '15px', 
	            backgroundColor: '#000', 
	            '-webkit-border-radius': '10px', 
	            '-moz-border-radius': '10px', 
	            opacity: .5, 
	            color: '#fff' 
	        }
		}); 
	};

	this.unlock = function() {
		$.unblockUI();
	};

	this.show = function(config) {
		if(isNullOrEmpty(config)){return;}
		var url = null;
		var isModal = false;
		var container = null;

		if(typeof config === "string"){
			url = config;
			isModal = false;
			container = '#portal-container';
		}else{
			url = config.url;
			isModal = config.modal != undefined ? config.modal : false;
			container = !isNullOrEmpty(config.container) ? config.container :'#portal-container';
		}		

		if(isModal){
			showModal(config);
			
		}else if(this.tabs != null){
			this.tabs.add(config);

		}else{
			container = $(container);
			showContainer(container, url);	
		}

	};

	this.checkForInclude = function(){
		$('.include').each(function(index) {
			var container = $(this)[index];
			$(container).removeClass('include');
			var url = container.dataset.url;
			showContainer(container, url);
		});
	}

	function showContainer (container, url) {
        if(isNullOrEmpty(url)){return;}
        portal.web.get(url, function(result){
			container = $(container);
            container.html(result);
            var $injector = angular.element(container).injector();
            $injector.invoke(function($rootScope, $compile, $document) {
                $compile(container)($rootScope);
				$rootScope.$digest();
				$rootScope.$apply();
				portal.ui.checkForInclude();				
            });
        });
	};

	function showModal(config){
		if (isNullOrEmpty(config)){return;}
		if(!isNullOrEmpty(config.url)) {
			portal.web.get(config.url, function(result){
				config.content = result;
				showModalContent(config);
			});
		}else if(!isNullOrEmpty(config.content)){
			showModalContent(config);
		}
	}

	function showModalContent(config) {
		if (isNullOrEmpty(config) || isNullOrEmpty(config.content)) {return;}
		
		var template = '<div id="{id}" class="modal fade" {controller} style="z-index: 9999;">'
					 + ' <div class="modal-dialog {modal-class}">'
					 + '  <div class="modal-content" style="width: 100%; height: 100%">'
					 + '    <div class="modal-header {header-class}">'
					 + '      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
					 + '      <h4 class="modal-title"><i class="{icon}"></i>&nbsp;&nbsp;{title}</h4>'
					 + '    </div>' 
					 + '    <div class="modal-body" style="position: fixed; right:5px; left:5px; bottom:65px; top:38px;">'
					 + '      {content}' 
					 + '    </div>'
					 + '      {button}'
					 + '  </div>' 
					 + ' </div>' 
					 + '</div>';
		var currentDate = new Date();
		var idVariant = +currentDate.getTime();
		var id = 'app-modal-' + idVariant;
		var buttonHtml = '';
		var button;
		var icon = config.icon;

		var startToolbarTag = '<toolbar-modal>';
		var endToolbarTag = '</toolbar-modal>';
		if (config.content.contains(startToolbarTag)) {
			var start = config.content.indexOf(startToolbarTag);
			var toolbar = config.content.substring(start + startToolbarTag.length);
			var end = toolbar.indexOf(endToolbarTag);
			toolbar = toolbar.substring(0, end);

			var content = config.content.substring(0, start);
			end = config.content.indexOf(endToolbarTag) + endToolbarTag.length;
			content += config.content.substring(end);
			config.content = content;
			config.buttonHtml = toolbar;
		}

		if (isNullOrEmpty(config.icon)) {icon = portal.config.APPLICATION_ICON;}
		if (isNullOrEmpty(config.title)) {config.title = portal.config.APPLICATION_NAME;}
		if (isNullOrEmpty(config.titleCls)) {config.titleCls = 'message-box-info-color';}
		if (isNullOrEmpty(config.width) || config.width <= 0) {config.width = 800;}
		if (isNullOrEmpty(config.height) || config.height <= 0) { config.height = 550; }
		if (isNullOrEmpty(config.class)) {config.class = '';}
		
		if(!isNullOrEmpty(config.controller)){
			config.controller = 'ng-controller="' + config.controller + '"';
		} else {
			var index_controller = config.content.indexOf('ng-controller');
			if(index_controller > -1){
				var htmlContent = 	config.content.substring(index_controller + 13);
				var controllerName = htmlContent.substring(htmlContent.indexOf('"')+1);
				controllerName = controllerName.substring(0,controllerName.indexOf('"'));
				config.controller = 'ng-controller="' + controllerName + '"';
			}else{
				config.controller = '';
			}
			config.content = config.content.replace('ng-controller', 'controller');
		}
		
		if (!isNullOrEmpty(config.buttons)) {
			var id_button;
			buttonHtml = '<div class="modal-footer" style="position: fixed; bottom: 0px; left: 5px; right: 5px;">';
			for (var btn_index = 0; btn_index < config.buttons.length; btn_index++) {
				button = config.buttons[btn_index];				
				button.dismiss = '';
				if (button.isCloseModal) {
					button.dismiss = 'data-dismiss="modal"';
					if (isNullOrEmpty(button.text)) {button.text = portal.i18n.get('MDL_BTN_CLOSE');}
					if (isNullOrEmpty(button.cls)) {button.cls = 'btn-danger';}
				}else if (isNullOrEmpty(button.cls)) {
					button.cls = 'btn-default';
				}
				id_button = 'app-modal-button-' + btn_index + '-' + idVariant;
				button.id = id_button;
				buttonHtml = buttonHtml + '&nbsp;&nbsp;&nbsp;' + '<button id="'
						   + button.id + '" type="button" class="btn btn-sm '
						   + button.cls + ' " ' + button.dismiss + '>'
						   + button.text + '</button>'
			}
			buttonHtml = buttonHtml + '</div>';
		} else if (!isNullOrEmpty(config.buttonHtml)) {
			buttonHtml = '<div class="modal-footer" style="position: fixed; bottom: 0px; left: 5px; right: 5px;">' + config.buttonHtml + '</div>';
		}

		var content;
		if (config.isFrame) {
			content = '<iframe frameborder="0" style="float: left; position:absolute; top:0; left:0;overflow: hidden; width:'
					+ (config.width - 4)
					+ 'px; height: '
					+ (config.height - 4)
					+ 'px;" src="' + config.invokeUrl + '"></iframe>';
		} else {
			content = config.content;
		}

		var html = template;
		html = html.replace('{id}', id);
		html = html.replace('{controller}', config.controller);
		html = html.replace('{icon}', icon);
		html = html.replace('{title}', config.title);
		html = html.replace('{header-class}', config.titleCls);
		html = html.replace('{content}', content);
		html = html.replace('{button}', buttonHtml);
		html = html.replace('{modal-id}', id);
		html = html.replace('{modal-class}', config.class);

		
		getModalContainer().append(html);

		var panelModal = $('#' + id);

		if (html.contains('ng-controller')) {
			portal.module.registerController(controllerName);
			var $injector = angular.element(panelModal).injector();
			$injector.invoke(function($rootScope, $compile, $document) {
				try {
					$compile(panelModal)($rootScope);
					$rootScope.$digest();
					$rootScope.$apply();
				} catch (ex) {
					console.error("Exception thrown: " + ex.message, ex.stack);
				}
			});
		}

		panelModal.on("show.bs.modal", function() {
			$(this).find(".modal-body").css('overflow', 'auto');
			if(!isNullOrEmpty(config.class)){return;}
			if(config.width != undefined && config.width != null){ 
				$(this).find(".modal-dialog").css("width", config.width);
				$(this).find(".modal-dialog").css("max-width", config.width);
			}
			if(config.height != undefined && config.height != null){ 
				$(this).find(".modal-dialog").css("height", config.height);
				$(this).find(".modal-dialog").css("max-height", config.height);
			}
			if(config.top != undefined && config.top != null){ 
				$(this).find(".modal-dialog").css("margin-top", config.top);
			}
			
		});
		panelModal.on("hidden.bs.modal", function(e) {
			e.preventDefault();
			e.stopPropagation();
			$('#' + e.currentTarget.id).remove();
			panelModal.onClose();
		});
		panelModal.draggable({
			handle : '.modal-header'
		});
		panelModal.modal();
		panelModal.onClose = onCloseEventHandler(config.onCloseCallback);

		if (config.buttons != undefined && config.buttons != null) {
			for (var btn_index = 0; btn_index < config.buttons.length; btn_index++) {
				button = config.buttons[btn_index];
				var idButton = '#' + button.id;
				var idModal = '#' + id;
				$(idButton).on("click", onButtonClickEventHandler(idModal, button.callback));
			}
		}
	}
	
	function onButtonClickEventHandler(idModal, callback) {
		return function() {
			$(idModal).modal('hide');
			if (callback) {callback();}
		}
	}
	
	function onCloseEventHandler(callback) {
		return function() {
			if (callback) {callback();}
		}
	}
	
	
	function getModalContainer(){
		var container = $('#appModalContainer');
		if(container.length > 0){return container;}
		var body = $('body');
		body.append('<div id="appModalContainer"></div>');
		container = $('#appModalContainer');
		return container;
    }
    
    this.initialize = function() {
		$(document).ready(function() {
			portal.ui.checkForInclude();
		});
	}
    this.initialize();

}