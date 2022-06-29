portal.config = new function(){

    this.setSessionId = function(sessionId){
        portal.cookie.set('wiipay-session-id', sessionId);
    }

    this.getSessionId = function(){
        return portal.cookie.get('wiipay-session-id');
    }

}

