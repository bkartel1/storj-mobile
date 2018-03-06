import React, { Component } from 'react';
import { DeviceEventEmitter } from 'react-native';
import ServiceModule from '../utils/ServiceModule';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { dashboardContainerActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerMainActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import { navigateBack, navigateToFilesScreen } from '../reducers/navigation/navigationActions';
import DashboardListComponent from '../components/DashboardListComponent';

class DashboardContainer extends Component {
    constructor(props) {
        super(props);
    }

    async componentWillMount() {
        await ServiceModule.bindService();
        console.log("return");

        DeviceEventEmitter.addListener("EVENT_BUCKETS_UPDATED", async (result) => {
            console.log("FromEvent", result);
            let result2 = await ServiceModule.listBuckets();

            console.log(result2);
        });
    }

    componentDidMount() {
        ServiceModule.getBuckets();
    }

    render() {
        return(
            <DashboardListComponent
                files = { this.props.files }
                buckets = { this.props.buckets }
                openBucket = { this.props.openBucket}
                screenName = { this.props.screenName }
                selectItem = { this.props.selectBucket }
                navigateBack = { this.props.navigateBack }
                deselectItem = { this.props.deselectBucket }      
                isSelectionMode = { this.props.isSelectionMode }
                selectedBucketId = { this.props.selectedBucketId }
                animatedScrollValue = { this.animatedScrollValue  }
                enableSelectionMode = { this.props.enableSelectionMode }
                disableSelectionMode = { this.props.disableSelectionMode }
                onSingleItemSelected = { this.props.onSingleItemSelected }  
                isSingleItemSelected = { this.props.isSingleItemSelected }
                navigateToFilesScreen = { this.props.navigateToFilesScreen } />
        )
    }
}

function mapStateToProps(state) {
    let routes = state.dashboardScreenNavReducer.routes;
    let index = state.dashboardScreenNavReducer.index;
    let currentBucketScreenName = routes[index].routeName;

    return {
        isSelectionMode: state.mainReducer.isSelectionMode,        
        buckets: state.mainReducer.buckets,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        fileListModels: state.filesReducer.fileListModels,
        files: state.filesReducer.fileListModels,
        screenName: currentBucketScreenName,
        selectedBucketId: state.mainReducer.openedBucketId
    };
}
    
function mapDispatchToProps(dispatch) {
    return bindActionCreators( { 
        ...dashboardContainerActions, 
        ...filesListContainerFileActions, 
        ...filesListContainerMainActions, 
        navigateBack,
        navigateToFilesScreen
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);