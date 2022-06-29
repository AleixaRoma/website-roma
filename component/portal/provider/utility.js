portal.utility = new function() {

	this.clone = function(instance) {
		if(isNullOrEmpty(instance)) {return instance;}
		if(typeof instance != 'object'){return instance;}
		var entity = {};
		for ( var attribute in instance) {
			if (attribute != undefined && instance.hasOwnProperty(attribute)
					&& typeof instance[attribute] !== 'function'
					&& !attribute.startsWith('$')) {
				entity[attribute] = instance[attribute];
			}
		}
		return entity;
	}

}