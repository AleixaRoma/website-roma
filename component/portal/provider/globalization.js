portal.i18n = new function(){

	this.culture = 'pt-br';

	this.setCulture = function(culture){
		this.culture = culture;
	}

	this.get = function(message){
		return portal.i18n[portal.i18n.culture][message];
	}

}