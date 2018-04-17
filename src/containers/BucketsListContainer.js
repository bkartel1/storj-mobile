import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
    onSingleItemSelected,
    enableSelectionMode,
    disableSelectionMode,
    openBucket
} from '../reducers/mainContainer/mainReducerActions';
import { 
    selectBucket,
    deselectBucket
} from '../reducers/mainContainer/Buckets/bucketReducerActions';
import { navigateToFilesScreen } from '../reducers/navigation/navigationActions';
import ServiceModule from '../utils/ServiceModule';
import BucketsListComponent from '../components/BucketsListComponent';

class BucketsListContainer extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        header: null
    };

    onPress(params) {
        this.props.openBucket(params.bucketId);
        this.props.navigateToFilesScreen(params.bucketId);    
    } 

    render() {
        return(
            <BucketsListComponent
                activeScreen = { this.props.activeScreen }
                setSelectionId = { this.props.screenProps.setSelectionId }
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { (params) => { this.onPress(params); } }
                selectedItemId = { this.props.screenProps.selectedItemId }
                animatedScrollValue = { this.props.screenProps.animatedScrollValue }
                onSingleItemSelected = { this.props.onSingleItemSelected }
                enableSelectionMode = { this.props.enableSelectionMode }
                disableSelectionMode = { this.props.disableSelectionMode }
                isSelectionMode = { this.props.isSelectionMode }
                isSingleItemSelected = { this.props.isSingleItemSelected }
                deselectBucket = { this.props.deselectBucket }
                selectBucket = { this.props.selectBucket }
                refresh = { () => ServiceModule.getBuckets() }
                sortingMode = { this.props.sortingMode }
                searchSubSequence = { this.props.searchSubSequence }
                buckets = { this.props.buckets } />
        );
    }
}

function mapStateToProps(state) {
    let screenIndex = state.mainScreenNavReducer.index;
    let currentScreenName = state.mainScreenNavReducer.routes[screenIndex].routeName;
    
    return {
        activeScreen: currentScreenName,
        isSelectionMode: state.mainReducer.isSelectionMode,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        buckets: state.bucketReducer.buckets,
        isGridViewShown: state.mainReducer.isGridViewShown,
        sortingMode: state.mainReducer.sortingMode,
        searchSubSequence: state.mainReducer.bucketSearchSubSequence
    };
}

function mapDispatchToProps(dispatch) {
    return {...bindActionCreators({ 
            onSingleItemSelected,
            enableSelectionMode,
            disableSelectionMode, 
            selectBucket,
            deselectBucket, 
            openBucket,
            navigateToFilesScreen 
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BucketsListContainer);