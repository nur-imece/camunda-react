import React, { useState, useEffect } from "react";
import { List, Button, message } from "antd";
import axios from "axios";

const DeploymentList = () => {
    const [deployments, setDeployments] = useState([]);
    const [processDefinitions, setProcessDefinitions] = useState([]);

    useEffect(() => {
        fetchDeployments();
        fetchProcessDefinitions();
    }, []);

    const fetchDeployments = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/deployments");
            if (response.data.success) {
                setDeployments(response.data.data);
            } else {
                message.error("Failed to fetch deployments.");
            }
        } catch (error) {
            message.error("Error fetching deployments: " + error.message);
        }
    };

    const fetchProcessDefinitions = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/deployments/process-definitions");
            if (response.data.success) {
                setProcessDefinitions(response.data.data);
            } else {
                message.error("Failed to fetch process definitions.");
            }
        } catch (error) {
            message.error("Error fetching process definitions: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/deployments/${id}`);
            message.success("Deployment deleted successfully.");
            fetchDeployments();
        } catch (error) {
            message.error("Error deleting deployment: " + error.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h3>Deployments</h3>
            <List
                bordered
                dataSource={deployments}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button danger onClick={() => handleDelete(item.id)}>
                                Delete
                            </Button>,
                        ]}
                    >
                        <div>
                            <strong>{item.name}</strong>
                            <br />
                            Deployment Time: {new Date(item.deploymentTime).toLocaleString()}
                        </div>
                    </List.Item>
                )}
            />

            <h3 style={{ marginTop: "20px" }}>Process Definitions</h3>
            <List
                bordered
                dataSource={processDefinitions}
                renderItem={(item) => (
                    <List.Item>
                        <div>
                            <strong>{item.name}</strong> (Version: {item.version})
                            <br />
                            Key: {item.key}
                            <br />
                            Deployment ID: {item.deploymentId}
                            <br />
                            Resource Name: {item.resourceName}
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default DeploymentList;
