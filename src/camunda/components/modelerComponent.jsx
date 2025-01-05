import React, { useState, useRef, useCallback, useMemo } from "react";
import { BpmnModeler, DmnModeler } from "@miragon/camunda-web-modeler";
import CamundaForm from "./camundaForm";
import { defaultBpmnXml, defaultDmnXml, defaultFormJson } from "./defaultContents";
import UploadComponent from "./uploadComponent";
import ExportComponent from "./exportComponent";
import DeployDiagramComponent from "./deployDiagramComponent";

const ModelerComponent = () => {
    const [modelType, setModelType] = useState("bpmn");
    const [modelData, setModelData] = useState(defaultBpmnXml);
    const [fileName, setFileName] = useState("process-model.bpmn");
    const [showDeployDialog, setShowDeployDialog] = useState(false); // State to control Deploy form visibility
    const bpmnModelerRef = useRef(null);

    const handleEvent = useCallback(async (event) => {
        if (event.source === "modeler" && event.event === "content.saved") {
            const { xml } = event.data;
            setModelData(xml);
        }
    }, []);

    const modelerOptions = useMemo(() => ({
        refs: [bpmnModelerRef],
    }), []);

    const handleChangeModelType = async (newType) => {
        setModelType(newType);
        if (newType === "bpmn") {
            setModelData(defaultBpmnXml);
            setFileName("process-model.bpmn");
            if (bpmnModelerRef.current) {
                try {
                    await bpmnModelerRef.current.importXML(defaultBpmnXml);
                } catch (err) {
                    console.error("Error importing XML:", err);
                }
            }
        } else if (newType === "dmn") {
            setModelData(defaultDmnXml);
            setFileName("decision-model.dmn");
        } else if (newType === "form") {
            setModelData(defaultFormJson);
            setFileName("form-model.form");
        }
    };

    const handleFileUpload = (content, name) => {
        setModelData(content);
        setFileName(name);
    };

    return (
        <div className="container">
            <h1 className="header">Modeler</h1>

            <div className="form-group">
                <label>Model Type: </label>
                <select
                    value={modelType}
                    onChange={(e) => handleChangeModelType(e.target.value)}
                    className="model-select"
                >
                    <option value="bpmn">BPMN</option>
                    <option value="dmn">DMN</option>
                    <option value="form">Form</option>
                </select>
            </div>

            <button
                style={{
                    marginTop: "10px",
                    padding: "10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                }}
                onClick={() => setShowDeployDialog(true)} // Show Deploy form as a modal
            >
                Deploy
            </button>

            {/* Deploy Modal */}
            {showDeployDialog && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <DeployDiagramComponent />
                        <button
                            style={{
                                marginTop: "10px",
                                padding: "10px",
                                backgroundColor: "#dc3545",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                            }}
                            onClick={() => setShowDeployDialog(false)} // Close Deploy modal
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {modelType !== "form" && (
                <>
                    <UploadComponent onFileUpload={handleFileUpload} />
                    <ExportComponent
                        modelData={modelData}
                        fileName={fileName}
                        bpmnModelerRef={bpmnModelerRef}
                    />
                </>
            )}

            <div className="editor-container">
                {modelType === "bpmn" && (
                    <BpmnModeler
                        key="bpmn-editor"
                        xml={modelData}
                        onMount={(modeler) => {
                            bpmnModelerRef.current = modeler;
                            modeler.importXML(modelData).catch((err) => {
                                console.error("Error importing XML:", err);
                            });
                        }}
                        onEvent={handleEvent}
                        options={modelerOptions}
                    />
                )}
                {modelType === "dmn" && (
                    <DmnModeler
                        key="dmn-editor"
                        xml={modelData}
                        onMount={(modeler) => {
                            bpmnModelerRef.current = modeler;
                        }}
                        onEvent={handleEvent}
                        options={modelerOptions}
                    />
                )}
                {modelType === "form" && (
                    <CamundaForm key="form-editor" formData={modelData} />
                )}
            </div>
        </div>
    );
};

export default ModelerComponent;
