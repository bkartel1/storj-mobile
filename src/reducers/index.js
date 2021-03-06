import authReducer from './authentification/authReducer';
import navReducer from './navigation/mainNavReducer';
import mainScreenNavReducer from './navigation/mainScreenNavReducer';
import mainReducer from './mainContainer/mainReducer';
import bucketsScreenNavReducer from '../reducers/navigation/bucketsScreenNavReducer';
import dashboardScreenNavReducer from '../reducers/navigation/dashboardScreenNavReducer';
import myAccountScreenNavReducer from '../reducers/navigation/myAccountScreenNavReducer';
import filesReducer from '../reducers/mainContainer/Files/filesReducer';
import bucketReducer from '../reducers/mainContainer/Buckets/bucketReducer';
import billingReducer from '../reducers/billing/billingReducer';
import settingsReducer from "../reducers/mainContainer/MyAccount/Settings/SettingsReducer";
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from "redux-thunk"

/**
 * Declaration of redux store with combining all reducers
 */
const reducers = {
    authReducer, 
    navReducer, 
    mainScreenNavReducer, 
    mainReducer, 
    bucketsScreenNavReducer,
    dashboardScreenNavReducer,
    myAccountScreenNavReducer,
    filesReducer,
    bucketReducer,
    billingReducer,
    settingsReducer
};

export const store = createStore(combineReducers({ ...reducers }), applyMiddleware(thunk));