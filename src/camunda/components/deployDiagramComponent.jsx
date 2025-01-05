import React, { useState } from "react";

const DeployDiagramComponent = () => {
    const [deploymentName, setDeploymentName] = useState("");
    const [tenantId, setTenantId] = useState("");
    const [restEndpoint, setRestEndpoint] = useState("");
    const [additionalFiles, setAdditionalFiles] = useState([]);

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        setAdditionalFiles(files);
    };

    const handleDeploy = async () => {
        if (!deploymentName || !restEndpoint) {
            alert("Deployment name and REST endpoint are required!");
            return;
        }

        const formData = new FormData();
        formData.append("deployment-name", deploymentName);
        if (tenantId) {
            formData.append("tenant-id", tenantId);
        }
        additionalFiles.forEach((file, index) => {
            formData.append(`file${index}`, file);
        });

        try {
            const response = await fetch(`${restEndpoint}`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Deployment successful! Deployment ID: ${result.id}`);
            } else {
                const errorText = await response.text();
                alert(`Deployment failed: ${errorText}`);
            }
        } catch (error) {
            alert(`Deployment error: ${error.message}`);
        }
    };

    return (
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "5px", width: "400px" }}>
            <h3>Deploy Diagram</h3>
            <div style={{ marginBottom: "10px" }}>
                <label>Deployment Name:</label>
                <input
                    type="text"
                    value={deploymentName}
                    onChange={(e) => setDeploymentName(e.target.value)}
                    placeholder="Deployment name"
                    style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Tenant ID (Optional):</label>
                <input
                    type="text"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    placeholder="Tenant ID"
                    style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>REST Endpoint:</label>
                <input
                    type="text"
                    value={restEndpoint}
                    onChange={(e) => setRestEndpoint(e.target.value)}
                    placeholder="https://your-camunda-endpoint"
                    style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Include Additional Files:</label>
                <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: "block", marginTop: "5px" }}
                />
            </div>
            <button
                onClick={handleDeploy}
                style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    padding: "10px",
                    cursor: "pointer",
                    width: "100%",
                }}
            >
                Deploy
            </button>
        </div>
    );
};

export default DeployDiagramComponent;
