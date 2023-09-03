import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; // import PersistGate
import store, { persistor } from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <PersistGate loading={null} persistor={persistor}> {/* Wrap your app with PersistGate */}
                <App />
            </PersistGate>
        </Router>
        <ToastContainer autoClose={3000} />
    </Provider>,
    document.getElementById('root')
);
