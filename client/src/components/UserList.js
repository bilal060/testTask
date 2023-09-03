// src/components/UserList.js

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {fetchAllUserProfile} from "../api/users";
import Pagination from './Pagination';

const usersPerPage = 10; // Set the number of users to display per page


const UserList = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetchAllUserProfile(currentPage,usersPerPage)
                setUsers(response.users);
                setTotalUsers(response.totalUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [currentPage]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="container mt-5">
            <h2>User List</h2>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>
                            <img
                                src={user.image} // Replace with the user's image URL
                                alt={user.name}
                                width="50"
                                height="50"
                            />
                        </td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalUsers / usersPerPage)}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default UserList;
