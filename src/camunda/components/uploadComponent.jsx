import React from 'react';
import { Upload, Button } from 'antd';

const UploadComponent = ({ onFileUpload, onFormUpload }) => {
    const handleUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (fileExtension === 'form' || fileExtension === 'json') {
                try {
                    const formSchema = JSON.parse(content);
                    onFormUpload?.(formSchema);
                } catch (err) {
                    console.error('Form parsing error:', err);
                    alert('Invalid form file format');
                }
            } else {
                onFileUpload?.(content, file.name);
            }
        };
        reader.readAsText(file);
        return false;
    };

    return (
        <Upload
            beforeUpload={handleUpload}
            showUploadList={false}
            accept=".bpmn,.dmn,.form,.json"
        >
            <Button>Upload File</Button>
        </Upload>
    );
};

export default UploadComponent;
