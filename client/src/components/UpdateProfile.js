import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../api/users';
import { setUser } from '../redux/actions';
import {useHistory} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {toast} from "react-toastify";

const UpdateProfile = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const history = useHistory();

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState(user.address || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [image, setImage] = useState(null); // State for the uploaded image
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
    const handleUpdateProfile = async () => {
        try {
            // Create a FormData object to send the image as part of the request
            if (!validatePhone(phone)) {
                return; // Don't proceed if phone number is invalid
            }
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('address', address);
            formData.append('phone', phone);
            if(password) {
                formData.append('password', password);

            }
            if (image) {
                formData.append('image', image);
            }

            const updatedUserData = await updateProfile(formData, user._id);

            // Update the user data in Redux state
            dispatch(setUser(updatedUserData));
            history.push('/profile');
        } catch (error) {
            toast.error('Unable to Update User', error);

        }
    };

    // Function to handle image selection
    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };

    return (
        <div className="container">
            <>
                <div className="login-form">
                    <h2>Update User</h2>
                    <Form onSubmit={handleUpdateProfile}>
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
                                disabled={true}
                                placeholder="Enter email"
                                value={email}
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

                        <Button className={'right margin-btn'} style={{width: "100%"}} variant="primary" onClick={handleUpdateProfile}>
                            Update User
                        </Button>
                    </Form>
                </div>

            </>
        </div>
    );
};

export default UpdateProfile;
