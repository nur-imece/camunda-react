import React, { useState, useEffect } from "react";
import { Button, List, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CamundaUserPage = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/users");
            if (response.data.success) {
                setUsers(response.data.data);
            } else {
                message.error("Failed to fetch users.");
            }
        } catch (error) {
            message.error("Error fetching users: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/users/${id}`);
            message.success("User deleted successfully.");
            fetchUsers();
        } catch (error) {
            message.error("Error deleting user: " + error.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Camunda User Management</h2>

            <div style={{ marginBottom: "20px" }}>
                <Button type="primary" onClick={() => navigate("/createUser")}>Create User</Button>
            </div>

            <h3>All Users</h3>
            <List
                bordered
                dataSource={users}
                renderItem={(user) => (
                    <List.Item
                        actions={[
                            <Button
                                type="link"
                                onClick={() => navigate(`/updateUser?id=${user.id}`)}
                            >
                                Edit
                            </Button>,
                            <Button danger onClick={() => handleDelete(user.id)}>
                                Delete
                            </Button>,
                        ]}
                    >
                        <div>
                            <strong>{user.firstName} {user.lastName}</strong> ({user.email})
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default CamundaUserPage;
