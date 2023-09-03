import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../api/auth';
import { setUser } from '../redux/actions';
import {useHistory} from "react-router-dom";
import {toast} from "react-toastify";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import '../assets/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const history = useHistory(); // Get history

    const handleLogin = async () => {
        try {
            const userData = await login(email, password);
            const token = userData.token; // Assuming the token is returned in the response
            console.log('Received token:', token);

            // Save the token to localStorage
            localStorage.setItem('token', token);

            dispatch(setUser(userData));
            toast.success('Login successful!');
            history.push('/profile');
        } catch (error) {
            toast.error('Login failed. Please check your credentials.!');
        }
    };

    return (
        <Container>

            <div className="login-form">
                <h2>Login</h2>
                <Form onSubmit={handleLogin}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button className={'right margin-btn'} variant="primary" onClick={handleLogin}>
                        Login
                    </Button>
                    <Button className={'right margin-btn'} variant="primary" onClick={()=> history.push('register')}>
                        Register
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default Login;
