import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const CreateUser = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/api/v1/users/create", {
                profile: {
                    id: values.id,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                },
                credentials: {
                    password: values.password,
                },
            });
            if (response.data.success) {
                message.success("User created successfully.");
                navigate("/camundaUsers");

            } else {
                message.error("Failed to create user.");
            }
        } catch (error) {
            message.error("Error creating user: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Form
                layout="vertical"
                onFinish={onFinish}
                style={{ width: "400px", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
            >
                <Form.Item
                    label="ID"
                    name="id"
                    rules={[{ required: true, message: "Please input user ID!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true, message: "Please input first name!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true, message: "Please input last name!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: "email", message: "Please input a valid email!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input password!" }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Create User
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateUser;
