import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../api/auth';
import { setUser } from '../redux/actions';
import {useHistory} from "react-router-dom";
import {toast} from "react-toastify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./../assets/style.css"

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState(null);
    const dispatch = useDispatch();
    const history = useHistory(); // Get history
    const [phoneError, setPhoneError] = useState(''); // State to store phone number validation error

    const validatePhone = (phoneNumber) => {
        // Define a regular expression for a valid phone number format
        const phoneRegex = /^[0-9]{10}$/; // Assumes a 10-digit phone number format, you can adjust it as needed

        if (phoneRegex.test(phoneNumber)) {
            setPhoneError('');
            return true;
        } else {
            setPhoneError('Please enter a valid 10-digit phone number.');
            return false;
        }
    };
    const handleRegistration = async () => {
        try {
            if (!validatePhone(phone)) {
                return; // Don't proceed if phone number is invalid
            }
            const userData = await register({ name, email, password, address, phone, image });
            dispatch(setUser(userData));

            // Show toast message and redirect to profile page
            toast.success('Registration successful!');
            history.push('/profile');
        } catch (error) {
            toast.error('Unable to register User', error);
        }
    };
    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };
    return (
        <>
            <div className="login-form">
                <h2>Registration</h2>
                <Form onSubmit={handleRegistration}>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
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
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {phoneError && <div className="invalid-feedback">{phoneError}</div>}
                    <Form.Group controlId="formBasicAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicImage">
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control
                            type="file"
                            placeholder="Upload Image"
                            onChange={handleImageChange}
                            required
                        />
                    </Form.Group>

                    <Button className={'right margin-btn'} variant="primary" onClick={handleRegistration}>
                        Register
                    </Button>
                </Form>
            </div>

        </>
    );
};

export default Register;
