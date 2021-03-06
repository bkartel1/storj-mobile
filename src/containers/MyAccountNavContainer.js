import {
    View,
    StyleSheet,
    BackHandler,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addNavigationHelpers } from 'react-navigation';
import React, { Component } from 'react';
import MyAccountScreenNavigator from '../navigators/MyAccountScreenNavigator';
import { 
    redirectToMyAccountScreen,
    redirectToBalanceScreen,
    redirectToChangePasswordScreen,
    redirectToPinCodeGenerationScreen,
    redirectToSettingsScreen,
    redirectToStorageScreen,
    redirectToMyAccountMnemonicScreen 
} from '../reducers/navigation/navigationActions';
import { clear } from '../reducers/authentification/authActions';

class MyAccountNavContainer extends Component {
    constructor(props) {
        super(props);

        this.onHardwareBackPress = this.onHardwareBackPress.bind(this);
    }

    componentDidMount() {
		if(Platform.OS === 'android') {
			BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress);
		}
    }
    
    componentWillUnmount() {
		if(Platform.OS === 'android') {
			BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress);
		}
	}

    onHardwareBackPress() {
        let currentScreen = this.props.nav.routes[0].routeName;

        switch (currentScreen) {
            case 'MyAccountMainPageScreen': return; 
            break;
            case 'StorageScreen': 
            case 'BalanceScreen': 
            case 'SettingsScreen': this.props.redirectToMyAccountScreen();
            break;
            case 'ChangePasswordScreen': 
            case 'PinCodeGenerationScreen': 
            case 'MyAccountMnemonicScreen': this.props.redirectToSettingsScreen();
            break;
            default: this.props.redirectToMyAccountScreen();
        }
	}

    render() {
        return(
            <View style={ styles.mainContainer }>
                <MyAccountScreenNavigator
                    screenProps = { { 
                        redirectToInitializationScreen: this.props.redirectToInitializationScreen,
                        clearAuthReducer: this.props.clear,
                        email: this.props.email,
                        password: this.props.password,
                        mnemonic: this.props.mnemonic,
                        showQR: this.props.showQR,
                        showStorageInfo: this.props.showStorageInfo,
                        showCredits: this.props.showCredits,
                        showPopUp: this.props.showPopUp,                         
                        storageAmount: this.props.storageAmount,
                        bandwidthAmount: this.props.bandwidthAmount,
                        getBalance: this.props.getBalance,
                        transactionList: this.props.transactionList,
                        resetPassword: this.props.resetPassword,
                        redirectToBalanceScreen: this.props.redirectToBalanceScreen,
                        redirectToChangePasswordScreen: this.props.redirectToChangePasswordScreen,
                        redirectToPinCodeGenerationScreen: this.props.redirectToPinCodeGenerationScreen,
                        redirectToSettingsScreen: this.props.redirectToSettingsScreen, 
                        redirectToStorageScreen: this.props.redirectToStorageScreen, 
                        redirectToMyAccountScreen: this.props.redirectToMyAccountScreen,
                        redirectToMyAccountMnemonicScreen: this.props.redirectToMyAccountMnemonicScreen
                    } }
                    navigation = { addNavigationHelpers({ 
                        dispatch: this.props.dispatch,
                        state: this.props.nav
                    })} />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        email: state.authReducer.user.email,
        password: state.authReducer.user.password,
        mnemonic: state.authReducer.user.mnemonic,
        nav: state.myAccountScreenNavReducer
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators( { 
            redirectToMyAccountScreen,
            redirectToBalanceScreen,
            redirectToChangePasswordScreen,
            redirectToPinCodeGenerationScreen,
            redirectToSettingsScreen,
            redirectToStorageScreen,
            redirectToMyAccountMnemonicScreen,
            clear
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountNavContainer);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    }
});