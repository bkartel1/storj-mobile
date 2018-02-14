import { FILE_ACTIONS } from '../../../utils/constants/actionConstants';

const { 
    LIST_FILES,
    UPLOAD_FILE,
    DOWNLOAD_FILE,
    DELETE_FILE, 
    SELECT_FILE, 
    DESELECT_FILE
} = FILE_ACTIONS;

/**
 * 
 * @param {string} bucketId 
 * @param {ListItemModel[]} files 
 */
function listFiles(bucketId, files) {
    return { type: LIST_FILES, payload: { bucketId, files } };
}

/**
 * @param {string} bucketId 
 * @param {ListItemModel} files 
 */
function uploadFile(bucketId, file) {
    return { type: UPLOAD_FILE, payload: { bucketId, file } };
}

//NOT IMPLEMENTED
function downloadFile() {
    return { type: DOWNLOAD_FILE };
}

function deleteFile(bucketId, fileId) {
    return { type: DELETE_FILE, payload: { bucketId, fileId } };
}

function selectFile(file) {
    return { type: SELECT_FILE, payload: { file } };
}

function deselectFile(file) {
    return { type: DESELECT_FILE, payload: { file } };
}

//list component
function enableSelectionMode() {
    return { type: ENABLE_SELECTION_MODE };
}

export const filesListContainerFileActions = {
    listFiles,
    selectFile,
    deselectFile
};

export const mainContainerFileActions = {
    uploadFile
};