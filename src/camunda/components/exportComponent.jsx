import React from "react";
import { Button } from "antd";

const ExportComponent = ({ modelData, fileName, bpmnModelerRef }) => {
    const handleExport = async () => {
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
        } else {
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
