import React from 'react';
import { Upload, Button } from 'antd';

const UploadComponent = ({ onFileUpload }) => {
    const handleUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            onFileUpload(content, file.name);
        };
        reader.readAsText(file);
        return false;
    };

    return (
        <Upload
            beforeUpload={handleUpload}
            showUploadList={false}
            accept=".bpmn,.dmn,.form"
        >
            <Button>Upload File</Button>
        </Upload>
    );
};

export default UploadComponent;
