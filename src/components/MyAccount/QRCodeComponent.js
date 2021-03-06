import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getHeight, getWidth } from '../../utils/adaptive';
import myAccountConstants from '../../utils/constants/myAccountConstants';
import QRCode from 'react-native-qrcode';
import StorjModule from '../../utils/StorjModule';

export default class QRCodeComponent extends Component {
    constructor(props) {
        super(props);
    }

    getCredentials() {
        return JSON.stringify({email: this.props.email, password: this.props.password, mnemonic: this.props.mnemonic})
    }

    render() {
        return(
            <View style = { [ styles.backgroundWrapper ] }>  
                <TouchableOpacity style = { [ styles.backgroundWrapper, styles.dimBlack ] } onPress = { this.props.showQR } />
                    <View style = { styles.mainContainer } >
                        <View style = { styles.qrContainer }>
                        {
                            this.getCredentials() ?
                                <QRCode
                                    value = { this.getCredentials() }
                                    size = { getHeight(200) }
                                    bgColor = { 'black' }
                                    fgColor = { 'white' } /> : null
                        }
                        </View>
                        <View style = { styles.infoTextContainer }>
                            <Text style = { styles.infoText }>{ myAccountConstants.qrCodeInfoText[0] }</Text>
                            <Text style = { styles.infoText }>{ myAccountConstants.qrCodeInfoText[1] }</Text>
                        </View>
                    </View>
            </View>
        )
    }
}

QRCodeComponent.propTypes = {
    showQR: PropTypes.func,
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white', 
        width: getWidth(355),
        height: getHeight(377),
        paddingHorizontal: getWidth(10),
        alignSelf: 'center',
        borderRadius: 6,
        marginTop: getHeight(15)
    },
    backgroundWrapper: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: 'transparent'
    },
    dimBlack: {
        backgroundColor: 'black',
        opacity: 0.2
    },
    qrContainer: {
        marginTop: getHeight(50),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: getWidth(208),
        height: getHeight(208),
    },
    infoTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: getWidth(243),
        height: getHeight(37),
        marginTop: getHeight(12)
    },
    infoText: {
        fontFamily: 'Montserrat-Regular', 
        fontSize: getHeight(14), 
        color: '#384B65'
    }
});