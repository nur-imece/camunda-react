import React from 'react';

const UploadComponent = ({ onFileUpload }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && onFileUpload) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                onFileUpload(content, file.name);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div style={{ marginBottom: "10px" }}>
            <label>Upload Model: </label>
            <input
                type="file"
                accept=".bpmn,.dmn,.form,.json,.xml"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default UploadComponent;