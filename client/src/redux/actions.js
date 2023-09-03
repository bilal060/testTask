export const setUser = (user) => ({
    type: 'SET_USER',
    payload: user,
});

export const clearUser = () => ({
    type: 'CLEAR_USER',
});


import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'],
};

export const logout = () => {
    return (dispatch) => {
        // Dispatch the action to clear the user data from Redux state
        dispatch({ type: 'CLEAR_USER' });

        // Reset the persisted state
        const resetPersistedState = persistReducer(persistConfig, (state, action) => {
            if (action.type === 'CLEAR_USER') {
                storage.removeItem('persist:root');
                return undefined;
            }
            return state;
        });

        dispatch({ type: 'RESET_PERSISTED_STATE' });
    };
};
