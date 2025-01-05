import React from 'react';

const ExportComponent = ({ modelData, fileName, bpmnModelerRef }) => {
    const handleExport = async () => {
        try {
            let dataToSave = modelData;
            let mimeType = "application/xml";

            if (bpmnModelerRef.current) {
                const { xml } = await bpmnModelerRef.current.saveXML({ format: true });
                dataToSave = xml;
            }

            const blob = new Blob([dataToSave], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting model:', error);
        }
    };

    return (
        <div style={{ marginBottom: "10px" }}>
            <button onClick={handleExport}>Export Model</button>
        </div>
    );
};

export default ExportComponent;
