import React from "react";
import { Button } from "antd";

const ExportComponent = ({ modelData, fileName, bpmnModelerRef, formEditorRef }) => {
    const handleExport = async () => {
        if (formEditorRef?.current) {
            try {
                const schema = formEditorRef.current.getSchema();
                const jsonStr = JSON.stringify(schema, null, 2);
                const blob = new Blob([jsonStr], { type: "application/json" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName || 'form-schema.form';
                a.click();
                window.URL.revokeObjectURL(url);
                return;
            } catch (err) {
                console.error("Error exporting Form:", err);
            }
        }

        // Handle BPMN export
        if (bpmnModelerRef?.current) {
            try {
                const { xml } = await bpmnModelerRef.current.saveXML({ format: true });
                const blob = new Blob([xml], { type: "text/xml" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            } catch (err) {
                console.error("Error exporting XML:", err);
            }
        } else if (modelData) {
            const blob = new Blob([modelData], { type: "text/xml" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };

    return (
        <Button onClick={handleExport}>
            Export File
        </Button>
    );
};

export default ExportComponent;
