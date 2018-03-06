package StorjLib.Services;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.database.sqlite.SQLiteDatabase;
import android.os.IBinder;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.ArrayList;
import java.util.List;

import StorjLib.GsonSingle;
import StorjLib.Models.BucketModel;
import StorjLib.Responses.SingleResponse;
import StorjLib.dataProvider.DatabaseFactory;
import StorjLib.dataProvider.Dbo.BucketDbo;
import StorjLib.dataProvider.repositories.BucketRepository;

/**
 * Created by Yaroslav-Note on 3/6/2018.
 */

public class ServiceModule extends ReactContextBaseJavaModule {

    public final static String GET_BUCKETS = "GET_BUCKETS";

    private GetBucketsService mGetBucketsService;
    private Promise mPromise;

    private final ServiceConnection mConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            GetBucketsService.GetBucketsServiceBinder binder = (GetBucketsService.GetBucketsServiceBinder)service;
            mGetBucketsService = binder.getService();
            mGetBucketsService.setReactContext(getReactApplicationContext());

            if(mPromise != null) {
                mPromise.resolve(true);
                mPromise = null;
            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            mGetBucketsService = null;
        }
    };

    public ServiceModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ServiceModule";
    }

    @ReactMethod
    public void bindService(Promise promise) {
        mPromise = promise;
        Intent testIntent = new Intent(getReactApplicationContext(), GetBucketsService.class);
        getReactApplicationContext().bindService(testIntent, mConnection, Context.BIND_AUTO_CREATE);
    }

    @ReactMethod
    public void getBuckets() {
        Intent serviceIntent = new Intent(getReactApplicationContext(), GetBucketsService.class);
        serviceIntent.setAction(GET_BUCKETS);

        getReactApplicationContext().startService(serviceIntent);
    }

    @ReactMethod
    public void listBuckets(final Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    SQLiteDatabase db = new DatabaseFactory(getReactApplicationContext(), null).getReadableDatabase();

                    BucketRepository bucketRepository = new BucketRepository(db);

                    ArrayList<BucketDbo> bucketDbos = (ArrayList)bucketRepository.getAll();

                    int length = bucketDbos.size();
                    BucketModel[] bucketModels = new BucketModel[length];

                    for(int i = 0; i < length; i++) {
                        bucketModels[i] = bucketDbos.get(i).toBucketModel();
                    }

                    promise.resolve(new SingleResponse(true, toJson(bucketModels), null).toWritableMap());
                } catch (Exception e) {
                    promise.resolve(new SingleResponse(false, null, e.getMessage()).toWritableMap());
                }
            }
        }).run();
    }

    private String toJson(BucketModel[] convertible) {
        return GsonSingle.getInstanse().toJson(convertible);
    }
}
