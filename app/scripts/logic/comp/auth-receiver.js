import Storage from 'storage';
import store from 'store';

const AuthReceiver = {
    receive: function() {
        const opener = window.opener || window.parent;
        const message = this.urlArgsToMessage(window.location.href);
        const hasKeys = Object.keys(message).filter(key => key !== 'config').length > 0;
        if (!hasKeys) {
            return false;
        }
        if (store.getState().env.isStandalone) {
            Storage[sessionStorage.authStorage].handleOAuthReturnMessage(message);
            return false;
        } else {
            opener.postMessage(message, window.location.origin);
            window.close();
            return true;
        }
    },

    urlArgsToMessage: function(url) {
        const message = {};
        url.split(/[?#&]/g).forEach(part => {
            const parts = part.split('=');
            if (parts.length === 2) {
                message[parts[0]] = parts[1];
            }
        });
        return message;
    },
};

export default AuthReceiver;