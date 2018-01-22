import {
    NativeModules,
    Platform
} from 'react-native'
import bucketModel from '../models/bucketModel';
import keysModel from '../models/keysModel';

const StorjLib = (() => {
    let instance = null;

    const storjLibAndroid = NativeModules.StorjLibAndroid;
    const isAndroid = Platform.OS === 'android';

    const storjLib = isAndroid ? storjLibAndroid : {};

    /**
    * This module wraps Native Modules for StorjLib.
    * Will be rafactored after iteration 2.
    * We should implement more functionality to have more deep understanding of needed arcitecture
    */
    class StorjModule {
        /**
        * Generate mnemonic
        * @returns {Promise<boolean>}
        */
        async generateMnemonic() {
            try {
                return await storjLib.generateMnemonic();
            } catch(e) {
                console.log(e);
            }
        }

        /**
        * Check if mnemonic provided has valid format
        * @param {string} mnemonic
        * @returns {Promise<boolean>} 
        */
        async checkMnemonic(mnemonic) {
            try {
                return storjLib.checkMnemonic(mnemonic);
            } catch(e) {
                console.log(e);

                return false;
            }
        };
    
        /**
        * Send new registration request
        * @param {string} email 
        * @param {string} password 
        * @param {function} sucessCallback Callback that is called on Success, returns email address from the request
        * @param {function} errorCallback Callback for error handeling, returns error message
        */
        async register(email, password, errorCallback) {
            try {
                return await storjLib.register(email, password);
            } catch(e) {
                errorCallback(e);
            }
        };
    
        /**
        * Verify if user exist in storj network
        * @param {string} email 
        * @param {string} password 
        * @returns {Promise<boolean>}
        */
        async verifyKeys(email, password) {
            try {
                return await storjLib.verifyKeys(email, password);
            } catch(e) {
                console.log(e);
            } 

            return false;
        };
    
        /**
        * Check if auth file allready exist on the device
        * @returns {Promise<boolean>}
        */
        async keysExists() {
            try {
                return await storjLib.keysExists();
            } catch(e) {
                console.log(e);

                return false;
            }
        };
    
        /**
        * Creates new auth file for given credentials and stores it on the device
        * and saves them in the current context
        * @param {string} email 
        * @param {string} password 
        * @param {string} mnemonic 
        * @param {string} passcode optional, pass if you want to protect auth file with additional password
        * @returns {Promise<boolean>}
        */
        async importKeys(email, password, mnemonic, passcode) {
            try {
                return await storjLib.importKeys(email, password, mnemonic, passcode);
            } catch(e) {
                console.log(e);

                return false;
            }
        };
    
        /**
        * 
        * @param {string} passcode needed if user has protected your auth file with additional password
        * @param {string} successCallback 
        * @param {function} errorCallback 
        */
        getKeys(passcode, successCallback, errorCallback) {
            storjLib.getKeys(passcode, successCallback, errorCallback);
        };
    
        /**
        * List buckets for logged in user
        * @returns {Promise<bucketModel[]>}
        */
        async getBuckets() {
            try {
                let buckets = await storjLib.getBuckets();

                if(Array.isArray(buckets)) {
                    return buckets.map((bucket) => {
                        return new bucketModel(bucket);
                    });
                }

                return [];
            } catch(e) {
                console.log(e);
            }
        };
    
        static getBucket() {
            //Not implemented yet
        };
    
        static createBucket() {
            //Not implemented yet   
        };
    
        static deleteBucket() {
            //Not implemented yet
        };
    
        static uploadFile() {
            //Not implemented yet
        };
    
        static downloadFile() {
            //Not implemented yet
        };
    }

    return {
        /**
        * @returns {StorjModule}
        */
        getInstance: function() {
            if(!instance) {
                instance = new StorjModule();
            }

            return instance;
        }
    };
})();

export default StorjLib.getInstance();

