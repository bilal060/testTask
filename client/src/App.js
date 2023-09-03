import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from './redux/actions';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import Logout from './components/Logout';
import UpdateProfile from './components/UpdateProfile';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/style.css'
const App = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    // Function to handle logout
    const handleLogout = () => {
        // Dispatch the clearUser action to clear user data
        dispatch(clearUser());

        // Clear the token from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('persist:root');
    };

    return (
        <Router>
            <div className="container">
                {user ? (
                    <div className={'center'}>
                        <h2>Welcome, {user.name}!</h2>
                        <Logout onLogout={handleLogout} /> {/* Logout button */}
                    </div>
                ) : (
                    <div className={'center'}>
                        <h2>Welcome to the App!</h2>
                        <p>Please log in or register to access your profile.</p>
                    </div>
                )}
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    {/* Protected route: Only accessible when logged in */}
                    <ProtectedRoute path="/profile" component={UserProfile} />
                    <ProtectedRoute path="/update-profile" component={UpdateProfile} />
                    {user ? (
                        <UserProfile/>
                    ) : (
                        <Login/>
                    )}
                </Switch>
            </div>
        </Router>
    );
};

export default App;
