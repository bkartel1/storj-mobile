package io.storj.mobile.storjlibmodule.callbackwrappers;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import io.storj.mobile.storjlibmodule.models.FileModel;
import io.storj.mobile.storjlibmodule.models.UploadFileProgressModel;
import io.storj.mobile.storjlibmodule.responses.Response;
import io.storj.mobile.storjlibmodule.responses.SingleResponse;
import io.storj.mobile.storjlibmodule.StorjLibModule;
import io.storj.libstorj.File;
import io.storj.libstorj.UploadFileCallback;

/**
 * Created by Crawter on 26.02.2018.
 */

public class UploadFileCallbackWrapper extends BaseCallbackWrapper<FileModel> implements UploadFileCallback {
    private String _bucketId;
    private ReactApplicationContext _context;
    private long _fileRef;
    private boolean _uploadStart = false;
    private double _lastPercent = 0;

    public UploadFileCallbackWrapper(ReactApplicationContext context, Promise promise, String bucketId) {
        super(promise);
        _bucketId = bucketId;
        _context = context;
    }

    @Override
    public void onProgress(String filePath, double progress, long uploadedBytes, long totalBytes) {
        if(!_uploadStart) {
            _uploadStart = true;
            _fileRef = StorjLibModule._uploadFileRef;
        }

        double current = Math.round(progress * 10);

        if(_lastPercent != current) {
            _lastPercent = current;
            UploadFileProgressModel uploadModel = new UploadFileProgressModel(_bucketId, filePath, progress, uploadedBytes, totalBytes, _fileRef);
            _context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("uploadFile", uploadModel.toWritableMap());
        }
    }

    @Override
    public void onComplete(String filePath, File file) {
        FileModel model = new FileModel(file);

        _promise.resolve(new SingleResponse(true, toJson(model), "File is not valid").toWritableMap());
    }

    @Override
    public void onError(String filePath, int code, String message) {
        _promise.resolve(new Response(false, message, code).toWritableMap());
    }
}
