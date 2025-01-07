import React, { useState, useEffect } from 'react';
import { Button, Modal, Input } from 'antd';

const ExportComponent = ({ modelData, fileName, bpmnModelerRef, formEditorRef }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [exportFileName, setExportFileName] = useState('');
    const [fileExtension, setFileExtension] = useState('');

    useEffect(() => {
        // Split filename into name and extension when fileName prop changes
        const lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            setExportFileName(fileName.substring(0, lastDotIndex));
            setFileExtension(fileName.substring(lastDotIndex));
        }
    }, [fileName]);

    const handleExport = async () => {
        let content = modelData;
        
        if (bpmnModelerRef?.current) {
            try {
                const { xml } = await bpmnModelerRef.current.saveXML();
                content = xml;
            } catch (err) {
                console.error("Error exporting XML:", err);
                return;
            }
        } else if (formEditorRef?.current) {
            try {
                const schema = await formEditorRef.current.getSchema();
                content = JSON.stringify(schema, null, 2);
            } catch (err) {
                console.error("Error exporting form:", err);
                return;
            }
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = exportFileName + fileExtension;
        a.click();
        window.URL.revokeObjectURL(url);
        setIsModalVisible(false);
    };

    return (
        <>
            <Button onClick={() => setIsModalVisible(true)}>
                Export File
            </Button>
            <Modal
                title="Export File"
                open={isModalVisible}
                onOk={handleExport}
                onCancel={() => setIsModalVisible(false)}
            >
                <p>Enter filename for export:</p>
                <Input
                    value={exportFileName}
                    onChange={(e) => setExportFileName(e.target.value)}
                    placeholder="Enter filename"
                    addonAfter={fileExtension}
                />
            </Modal>
        </>
    );
};

export default ExportComponent;
