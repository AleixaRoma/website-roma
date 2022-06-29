portal.module = angular.module('app', [], function($controllerProvider) {
    controllerProvider = $controllerProvider;
});

portal.module.controllerProvider = {};

portal.module.registerController = function(controllerName) {
    var queue = angular.module('app')._invokeQueue;
    for(var i=0;i<queue.length;i++) {
        var call = queue[i];
        if(call[0] == "$controllerProvider" &&
           call[1] == "register" &&
           call[2][0] == controllerName) {
            portal.module.controllerProvider.register(controllerName, call[2][1]);
        }
    }
}

portal.module.config([ '$controllerProvider',
    function($controllerProvider) {
        $controllerProvider.allowGlobals();
        portal.module.controllerProvider = $controllerProvider;
    } 
]);


portal.module.directive('dateFormat', function() {
    function link(scope, element, attrs) {
        var list = attrs.dateFormat.split('|');
        var separator = list[0].indexOf('.');
        var instanceName = list[0].substring(0, separator);
        var attributeName = list[0].substring(separator + 1);

        var instance = scope[instanceName];
        if (instance == null || instance == undefined) {
            return;
        }

        var value = instance[attributeName];
        if (value == null || value == undefined) {
            return;
        }

        var format = list.length > 1 ? list[1] : null;
        try {
            value = eval(value.replace(/\/Date\((\d+)\)\//gi, "new Date($1)"));
            if (format != null) {
                value = value.format(format);
            }
        } catch (ex) {
        }
        if (value.startsWith('/Date')) {
            value = '';
        }
        $(element).html(value);
    }

    return {
        link : link
    };

});

portal.module.directive('booleanFormat',function() {

    function link(scope, element, attrs) {
        var list = attrs.booleanFormat.split('|');
        var separator = list[0].indexOf('.');
        var instanceName = list[0].substring(0, separator);
        var attributeName = list[0].substring(separator + 1);

        var instance = scope[instanceName];
        if (instance == null || instance == undefined) {
            return;
        }

        var value = instance[attributeName];
        if (value == null || value == undefined) {
            return;
        }

        var values = list.length > 1 ? list[1].split(';') : null;
        if (values == null) {
            values = [ 'Sim', 'N\u00e3o' ];
        }
        try {
            value = eval(value);
            if (values.length > 1
                    && (value || value == '1' || value == 1)) {
                value = values[0];
            } else if (values.length >= 2) {
                value = values[1];
            }
        } catch (ex) {
        }
        $(element).html(value);
    }

    return {
        link : link
    };

});

portal.module.directive('fileUpload', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileUpload);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);