import { BackHandler, Platform, DeviceEventEmitter, Animated } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bucketNavigateBack, dashboardNavigateBack, openImageViewer } from '../reducers/navigation/navigationActions';
import { filesListContainerMainActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import { getFileSize, getFullFileName, getShortFileName } from "../utils/fileUtils";
import FilesListComponent from '../components/FilesListComponent';
import BaseFilesListContainer from '../containers/BaseFilesListContainer';
import PropTypes from 'prop-types';

/** 
 * Files screen, base screen, appears after opening bucket on bucket screen
*/
class FilesListContainer extends BaseFilesListContainer {
    constructor(props) {
        super(props);

        this.onHardwareBackPress = this.onHardwareBackPress.bind(this);
    }    

    /** 
     * Set initial data upload from Storj Network when screen is loaded, 
     * resets header animation and handling hardware back button click on Android devices
    */
    async componentWillMount() {        
        if(Platform.OS === "android") {
            BackHandler.addEventListener("hardwarebackPress", this.onHardwareBackPress);
        }        

        Animated.timing(
            this.props.screenProps.animatedScrollValue,
            {
              toValue: 0,
              useNativeDriver: true
            }
        ).start();               
        
        this.onRefresh(); 
    }

    /**      
     * Cleaning all event listeners
    */
    componentWillUnmount() {
        if(Platform.OS === "android") {
            BackHandler.removeEventListener("hardwarebackPress", this.onHardwareBackPress);
        }
    }

    /**      
     * Hardware Back Press callback. Closes bucket and navigating to bucket screen
    */
    onHardwareBackPress() {
        if(this.props.isLoading)
            return;

        const index = this.props.mainNavReducer.index;
        const routes = this.props.mainNavReducer.routes;

        if(routes[index].routeName === "ImageViewerScreen") 
            return;

        if (this.props.isSelectionMode || 
            this.props.isSingleItemSelected || 
            this.props.isActionBarShown) 
                return;        

        this.props.closeBucket();
        
        this.props.bucketNavigateBack();
    }

    render() {
        let data = this.getData();

        return(
            <FilesListComponent
                isLoading = { this.props.loadingStack.includes(this.props.bucketId) }
                selectedItemId = { this.props.selectedItemId }
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { (item) => { this.onPress(item); } }
                onLongPress = { (item) => { this.onLongPress(item); } }
                onDotsPress = { (item) => { this.onDotsPress(item); } }
                onCancelPress = { (item) => { this.onCancelPress(item); } }                             
                data = { data }
                getItemSize = { getFileSize }
                getFileName = { this.props.isGridViewShown ? getShortFileName : getFullFileName }
                animatedScrollValue = { this.props.screenProps.animatedScrollValue }
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { this.props.isSingleItemSelected }
                sortingMode = { this.props.sortingMode }
                searchSubSequence = { this.props.searchSubSequence }
                onRefresh = { this.onRefresh.bind(this) } />
        );
    }
}

function mapStateToProps(state) {
    let screenIndex = state.mainScreenNavReducer.index;
    let currentScreenName = state.mainScreenNavReducer.routes[screenIndex].routeName;

    return {
        loadingStack: state.mainReducer.loadingStack,
        mainNavReducer: state.navReducer,
        bucketId: state.mainReducer.openedBucketId,        
        isActionBarShown: state.mainReducer.isActionBarShown,
        isSelectionMode: state.mainReducer.isSelectionMode,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        fileListModels: state.filesReducer.fileListModels,
        uploadingFileListModels: state.filesReducer.uploadingFileListModels,
        isLoading: state.mainReducer.isLoading,
        isGridViewShown: state.mainReducer.isGridViewShown,        
        selectedItemId: state.mainReducer.selectedItemId,
        activeScreen: currentScreenName,
        sortingMode: state.mainReducer.sortingMode,
        searchSubSequence: state.mainReducer.filesSearchSubSequence
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ bucketNavigateBack, dashboardNavigateBack, openImageViewer, ...filesListContainerMainActions, ...filesListContainerFileActions }, dispatch);    
}

export default connect(mapStateToProps, mapDispatchToProps)(FilesListContainer);

FilesListContainer.propTypes = {
    activeScreen: PropTypes.string,
    searchSubSequence: PropTypes.string,
    sortingMode: PropTypes.string,
    setSelectionId: PropTypes.func,
    selectedItemId: PropTypes.string,
    isGridViewShown: PropTypes.bool,
    bucketId: PropTypes.string,
    animatedScrollValue: PropTypes.bool,
    enableSelectionMode: PropTypes.func,
    disableSelectionMode: PropTypes.func,    
    isSingleItemSelected: PropTypes.bool,
    deselectFile: PropTypes.func,
    selectFile: PropTypes.func,    
    fileListModels: PropTypes.array,    
    isLoading: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    isSingleItemSelected: PropTypes.bool,        
    screenProps: PropTypes.object,       
    uploadingFileListModels: PropTypes.array
};