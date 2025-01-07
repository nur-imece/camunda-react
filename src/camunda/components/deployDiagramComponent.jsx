import React, { useState } from "react";
import { Form, Input, Upload, Button, message } from "antd";

const DeployDiagramComponent = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const handleDeploy = async (values) => {
        if (!values.deploymentName || !values.restEndpoint) {
            message.error("Deployment name and REST endpoint are required!");
            return;
        }

        const formData = new FormData();
        formData.append("deployment-name", values.deploymentName);
        if (values.tenantId) {
            formData.append("tenant-id", values.tenantId);
        }
        fileList.forEach((file, index) => {
            formData.append(`file${index}`, file.originFileObj);
        });

        try {
            const response = await fetch(values.restEndpoint, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                message.success(`Deployment successful! Deployment ID: ${result.id}`);
                form.resetFields();
                setFileList([]);
            } else {
                const errorText = await response.text();
                message.error(`Deployment failed: ${errorText}`);
            }
        } catch (error) {
            message.error(`Deployment error: ${error.message}`);
        }
    };

    const uploadProps = {
        multiple: true,
        fileList,
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
                label="Additional Files"
            >
                <Upload {...uploadProps}>
                    <Button>Select Files</Button>
                </Upload>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Deploy
                </Button>
            </Form.Item>
        </Form>
    );
};

export default DeployDiagramComponent;
