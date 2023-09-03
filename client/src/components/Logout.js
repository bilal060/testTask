import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../redux/actions';
import {deleteUserProfile} from '../api/users';
import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";

const Logout = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [confirmDelete, setConfirmDelete] = useState(false)
    const user = useSelector((state) => state.user);

    const handleLogout = () => {
        // Dispatch the logout action
        dispatch(logout());

        // Redirect to the login page or any other desired page
        history.push('/login');
    };
    const handleDeleteUser= async () => {
        // Dispatch the logout action
        await deleteUserProfile(user._id);

        dispatch(logout());

        // Redirect to the login page or any other desired page
        history.push('/login');
    };
    return (
        <>
            <button onClick={handleLogout} className="btn btn-secondary">
                Logout
            </button>
            <Modal
                show={confirmDelete}
                onHide={() => setConfirmDelete(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to Delete your Account?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleDeleteUser}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            <button onClick={() => setConfirmDelete(true)} className="btn btn-danger">
                Delete My Profile
            </button>
        </>

    );
};

export default Logout;
