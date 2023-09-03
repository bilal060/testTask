import storage from 'redux-persist/lib/storage'; // import storage type

const persistConfig = {
    key: 'root', // key for the storage
    storage, // storage engine, you can use 'localStorage' or 'sessionStorage'
    whitelist: ['user'], // array of reducer names to persist (only 'user' in this example)
};

export default persistConfig;
