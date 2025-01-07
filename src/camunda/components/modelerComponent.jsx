import React, { useState, useRef, useCallback, useMemo } from "react";
import { BpmnModeler, DmnModeler } from "@miragon/camunda-web-modeler";
import CamundaForm from "./camundaForm";
import { defaultBpmnXml, defaultDmnXml, defaultFormJson } from "./defaultContents";
import UploadComponent from "./uploadComponent";
import ExportComponent from "./exportComponent";
import DeployDiagramComponent from "./deployDiagramComponent";
import { Layout, Select, Button, Modal, Space } from 'antd';

const { Header, Content } = Layout;
const { Option } = Select;

const ModelerComponent = () => {
    const [modelType, setModelType] = useState("bpmn");
    const [modelData, setModelData] = useState(defaultBpmnXml);
    const [fileName, setFileName] = useState("process-model.bpmn");
    const [showDeployDialog, setShowDeployDialog] = useState(false);
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
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ margin: 0 }}>Modeler</h1>
                <Button type="primary" onClick={() => setShowDeployDialog(true)}>
                    Deploy
                </Button>
            </Header>

            <Content style={{ padding: '24px', background: '#fff' }}>
                <Space style={{ marginBottom: 16 }}>
                    <Select
                        value={modelType}
                        onChange={handleChangeModelType}
                        style={{ width: 120 }}
                    >
                        <Option value="bpmn">BPMN</Option>
                        <Option value="dmn">DMN</Option>
                        <Option value="form">Form</Option>
                    </Select>
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
                </Space>

                <div style={{ height: 'calc(100vh - 200px)', border: '1px solid #f0f0f0' }}>
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
            </Content>

            <Modal
                title="Deploy Diagram"
                open={showDeployDialog}
                onCancel={() => setShowDeployDialog(false)}
                footer={null}
                width={800}
            >
                <DeployDiagramComponent />
            </Modal>
        </Layout>
    );
};

export default ModelerComponent;
