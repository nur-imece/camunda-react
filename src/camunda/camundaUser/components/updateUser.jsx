import React, { useState, useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

const UpdateUser = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const location = useLocation();
    const navigate = useNavigate();


    const id = new URLSearchParams(location.search).get("id");

    useEffect(() => {
        if (!id) {
            message.error("User ID is missing in the URL!");
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/users/${id}`);
                if (response.data && response.data.data) {
                    form.setFieldsValue({
                        id: response.data.data.id,
                        firstName: response.data.data.firstName,
                        lastName: response.data.data.lastName,
                        email: response.data.data.email,
                    });
                } else {
                    message.error("Invalid user data received.");
                }
            } catch (error) {
                message.error("Error fetching user data: " + error.message);
            }
        };

        fetchUser();
    }, [id, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/users/${id}`, {
                id: values.id,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
            });
            if (response.data.success) {
                message.success("User updated successfully.");
                navigate("/camundaUsers");

            } else {
                message.error("Failed to update user.");
            }
        } catch (error) {
            message.error("Error updating user: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Form
                layout="vertical"
                onFinish={onFinish}
                form={form}
                style={{ width: "400px", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
            >
                <Form.Item label="ID" name="id" rules={[{ required: true, message: "Please input user ID!" }]}>
                    <Input disabled />
                </Form.Item>
                <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "Please input first name!" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Please input last name!" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please input a valid email!" }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Update User
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateUser;
