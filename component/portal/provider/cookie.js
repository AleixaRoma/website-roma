portal.cookie = new function(){

    this.set = function(key, value){
        var d = new Date();
        d.setTime(d.getTime() + (20*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = key + "=" + value + ";" + expires + ";path=/";
    }

    this.get = function (key) {
        var name = key + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

}