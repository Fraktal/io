
    TwitterCredentials = function(){
            
            var secret = { 
                consumer_key : 'kJ5QtZshR9rqelu3EXF8Q',
                consumer_secret: '3hsW5aUufM5arIXu7oEC0WcbMe1YMDAny2wXLc5DA',
                access_token_key: '360021152-z7ukll2GLEFWZyKrnjhQ4B9L5uUpyL4xs4p6wm7r',
                access_token_secret: 'cdHFUqDgZ3tLgFxTJLxE5lhTbF1yZT0JJ26Nsm7rRg'
            };

             function getConsumerKry() {
                 return secret.consumer_key; 
             }

             function getConsumerSecret() {
                 return secret.consumer_secret;
             }

             function getAccessTokenKey() {
                 return secret.access_token_key;
             }

             function getAccessTokenSecret() {
                return access_token_secret;
             }

             function _getSecrets() {
                 return secret;
             }

             return {
                getSecrets: _getSecrets
             }
    };

    module.exports = TwitterCredentials;
