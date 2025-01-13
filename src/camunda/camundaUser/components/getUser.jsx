import React, { useState } from "react";
import {Input, message } from "antd";
import axios from "axios";


// Get User Component
const GetUser = () => {
    const [user, setUser] = useState(null);

    const fetchUser = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/users/${id}`);
            setUser(response.data);
        } catch (error) {
            message.error("Error fetching user: " + error.message);
        }
    };

    return (
        <div>
            <Input.Search
                placeholder="Enter User ID"
                enterButton="Get User"
                onSearch={fetchUser}
                style={{ maxWidth: 400, marginBottom: 20 }}
            />
            {user && (
                <div>
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            )}
        </div>
    );
};

export default GetUser;