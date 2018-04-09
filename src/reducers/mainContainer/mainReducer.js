import { MAIN_ACTIONS } from '../../utils/constants/actionConstants';
import LoadingStack from "../../utils/loadingStack";
import SORTING from '../../utils/constants/sortingConstants';

const { 
    SHOW_ACTION_BAR, 
    HIDE_ACTION_BAR,
    ENABLE_SELECTION_MODE, 
    DISABLE_SELECTION_MODE,
    SINGLE_ITEM_ACTIONS_SELECTED,
    SHOW_CREATE_BUCKET_INPUT,
    HIDE_CREATE_BUCKET_INPUT,
    SET_FIRST_SIGN_IN,
    REMOVE_FIRST_SIGN_IN,
    SET_LOADING,
    UNSET_LOADING,
    OPEN_BUCKET,
    CLOSE_BUCKET,
    SET_GRID_VIEW,
    SET_LIST_VIEW,
    CLEAR_SELECTION,
    SET_SELECTION_ID,
    SET_EMAIL,
    SET_MAIN_SCREEN,
    SET_PHOTOS_BUCKET_ID,
    SET_DASHBOARD_BUCKET_ID,
    SET_SORTING,
    PUSH_LOADING,
    POP_LOADING
 } = MAIN_ACTIONS;
                                                       
 console.log(SORTING);

const initialState = {
    email: null,
    isCreateBucketInputShown: false,
    isActionBarShown: false,
    isSelectionMode: false,
    isSingleItemSelected: false,
    isFirstSignIn: false,
    isGridViewShown: false,
    isLoading: false,
    openedBucketId: null,
    myPhotosBucketId: null,
    dashboardBucketId: null,
    selectedItemId: null,
    sortingMode: SORTING.BY_DATE,
    loadingStack: []
};

export default function mainReducer(state = initialState, action) {
    let newState = Object.assign({}, state);
    const loadingStack = new LoadingStack(newState.loadingStack);

    //TODO: we can call return after switch, and reduce lines of code
    switch(action.type) {
        case SET_EMAIL:
            newState.email = action.payload.email;
            break;
        case SHOW_ACTION_BAR:
            newState.isActionBarShown = true; 
            break;
        case HIDE_ACTION_BAR:
            newState.isActionBarShown = false;
            break;
        case ENABLE_SELECTION_MODE:            
            newState.selectedItemId = null;            
            newState.isSelectionMode = true;
            newState.isSingleItemSelected = false;
            break;
        case DISABLE_SELECTION_MODE:
            newState.isSingleItemSelected = false;
            newState.isActionBarShown = false;
            newState.isSelectionMode = false;
            newState.selectedItemId = null;
            break;
        case SINGLE_ITEM_ACTIONS_SELECTED:                
            newState.isSingleItemSelected = true;
            newState.isActionBarShown = true;
            break;
        case SHOW_CREATE_BUCKET_INPUT:
            newState.isCreateBucketInputShown = true;
            newState.isActionBarShown = false;                        
            break;
        case HIDE_CREATE_BUCKET_INPUT:
            newState.isCreateBucketInputShown = false;
            break;
        case SET_FIRST_SIGN_IN: 
            newState.isFirstSignIn = true;
            break;
        case REMOVE_FIRST_SIGN_IN: 
            newState.isFirstSignIn = false;
            break;
        case SET_LOADING: 
            newState.isLoading = true;
            break;
        case UNSET_LOADING:
            newState.isLoading = false;
            break;
        case OPEN_BUCKET: 
            newState.openedBucketId = action.payload.bucketId;
            break;
        case CLOSE_BUCKET:
            newState.openedBucketId = null;
            break;
        case SET_GRID_VIEW: 
            newState.isGridViewShown = true;
            break;
        case SET_LIST_VIEW: 
            newState.isGridViewShown = false;
            break;
        case SET_SELECTION_ID:
            newState.selectedItemId = action.payload.id;
            break;
        case CLEAR_SELECTION:
            newState.selectedItemId = null;
            break;
        case SET_PHOTOS_BUCKET_ID:            
            newState.myPhotosBucketId = action.payload.myPhotosBucketId
            break;
        case SET_DASHBOARD_BUCKET_ID:            
            newState.dashboardBucketId = action.payload.dashboardBucketId
            break;
        case PUSH_LOADING:
            newState.loadingStack = loadingStack.setLoading(action.payload.value);
            break;
        case POP_LOADING:
            newState.loadingStack = loadingStack.unsetLoading(action.payload.value);
            break;
        case SET_SORTING:            
            newState.sortingMode = action.payload.sortingMode;
            break;
        default:
            return state || initialState;
    }
    
    return newState; 
};