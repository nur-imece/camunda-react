import React, { useState, useEffect } from "react";
import { Form, Input, Upload, Button, message, List, Modal } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeployDiagramComponent = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleDeploy = async (values) => {
        if (!values.deploymentName || !values.restEndpoint) {
            message.error("Deployment name and REST endpoint are required!");
            return;
        }

        const formData = new FormData();

        fileList.forEach((file) => {
            const fileName = file.name.toLowerCase();
            if (fileName.endsWith(".bpmn") || fileName.endsWith(".bpmn20.xml")) {
                formData.append("bpmn", file.originFileObj);
            } else if (fileName.endsWith(".form")) {
                formData.append("forms", file.originFileObj);
            } else {
                message.warning(`Unsupported file type: ${fileName}`);
                return;
            }
        });

        setLoading(true);
        try {
            const response = await axios.post(values.restEndpoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                message.success("Deployment successful!");
                form.resetFields();
                setFileList([]);
                navigate("/deployments");
            }
        } catch (error) {
            message.error("Deployment error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file) => {
        const fileName = file.name.toLowerCase();
        const isValidType = fileName.endsWith(".bpmn") || fileName.endsWith(".bpmn20.xml") || fileName.endsWith(".form");

        if (!isValidType) {
            message.error("You can only upload BPMN or Form files!");
        }

        return isValidType;
    };

    const uploadProps = {
        multiple: true,
        fileList,
        beforeUpload,
        onChange: ({ fileList: newFileList }) => {
            setFileList(newFileList);
        },
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
    };

    return (
        <div style={{ padding: "20px" }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleDeploy}
                style={{ maxWidth: 600 }}
            >
                <Form.Item
                    label="Deployment Name"
                    name="deploymentName"
                    rules={[{ required: true, message: "Please input deployment name!" }]}
                >
                    <Input placeholder="Enter deployment name" />
                </Form.Item>

                <Form.Item
                    label="Tenant ID (Optional)"
                    name="tenantId"
                >
                    <Input placeholder="Enter tenant ID" />
                </Form.Item>

                <Form.Item
                    label="REST Endpoint"
                    name="restEndpoint"
                    rules={[{ required: true, message: "Please input REST endpoint!" }]}
                >
                    <Input placeholder="https://your-camunda-endpoint" />
                </Form.Item>

                <Form.Item
                    label="Upload Files"
                    extra="Support for .bpmn, .bpmn20.xml, and .form files"
                >
                    <Upload {...uploadProps}>
                        <Button>Select BPMN or Form Files</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Deploy
                    </Button>
                </Form.Item>
            </Form>

        </div>
    );
};

export default DeployDiagramComponent;
