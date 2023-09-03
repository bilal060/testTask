import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; // Replace with your API URL

export const getUserProfile = async (token) => {
    const response = await axios.get(`${API_URL}/users/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateProfile = async (formData, id) => {
    try {
        const token = localStorage.getItem('token'); // Get the token from wherever you store it

        const headers = {
            'Content-Type': 'multipart/form-data', // Set the content type for FormData
            Authorization: `Bearer ${token}`, // Include the token in the headers
        };

        // Make the PUT request to the update profile endpoint
        const response = await axios.put(`${API_URL}/users/${id}`, formData, { headers });

        return response.data; // Return the updated user data from the API response
    } catch (error) {
        throw error; // Handle errors as needed (e.g., logging, displaying an error message)
    }
};
export const deleteUserProfile = async ( id) => {
    try {
        const token = localStorage.getItem('token'); // Get the token from wherever you store it

        const headers = {
            Authorization: `Bearer ${token}`, // Include the token in the headers
        };

        // Make the PUT request to the update profile endpoint
        const response = await axios.delete(`${API_URL}/users/${id}`, { headers });

        return response.data; // Return the updated user data from the API response
    } catch (error) {
        throw error; // Handle errors as needed (e.g., logging, displaying an error message)
    }
};
