import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserProfile } from '../api/users';
import {clearUser, setUser} from '../redux/actions';
import {Link, useHistory} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import '../assets/UserProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons'; // Import the edit icon

const UserProfile = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem('token'); // Get the token from wherever you store it

        if (token) {
            getUserProfile(token)
                .then((userData) => {
                    dispatch(setUser(userData));
                })
                .catch((error) => {
                    console.error(error);
                    dispatch(clearUser());
                });
        }
    }, [dispatch]);
    const handleEditProfile = () => {
        history.push('/update-profile');
    };

    return (
        <Container>
            <div className="profile-card">
                <Card>
                    <Card.Header as="h5">User Profile
                        <button
                            className="float-right edit-button"
                            onClick={handleEditProfile}
                            title="Edit Profile"
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    </Card.Header>

                    <Card.Body>
                        <Image
                            src={user.image}
                            alt="User"
                            className="profile-image"
                            roundedCircle
                        />
                        <Card.Title>{user.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            {user.email}
                        </Card.Subtitle>
                        <Card.Text>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <strong>Address:</strong> {user.address || 'N/A'}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Phone:</strong> {user.phone || 'N/A'}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
};

export default UserProfile;
