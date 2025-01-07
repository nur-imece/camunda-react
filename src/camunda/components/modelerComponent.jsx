import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { BpmnModeler, DmnModeler } from "@miragon/camunda-web-modeler";
import CamundaForm from "./camundaForm";
import { defaultBpmnXml, defaultDmnXml, defaultFormJson } from "./defaultContents";
import UploadComponent from "./uploadComponent";
import ExportComponent from "./exportComponent";
import { Layout, Select, Space } from 'antd';

const { Header, Content } = Layout;
const { Option } = Select;

const ModelerComponent = ({ initialModelType, tabId, onModelerRef }) => {
    const [modelType, setModelType] = useState(initialModelType || "bpmn");
    const [modelData, setModelData] = useState(() => {
        switch (initialModelType) {
            case 'form':
                return defaultFormJson;
            case 'dmn':
                return defaultDmnXml;
            default:
                return defaultBpmnXml;
        }
    });
    const [fileName, setFileName] = useState(() => {
        switch (initialModelType) {
            case 'form':
                return "form-model.form";
            case 'dmn':
                return "decision-model.dmn";
            default:
                return "process-model.bpmn";
        }
    });
    
    const containerRef = useRef(null);
    const bpmnModelerRef = useRef(null);
    const dmnModelerRef = useRef(null);
    const formEditorRef = useRef(null);
    const initializedRef = useRef({
        bpmn: false,
        dmn: false,
        form: false
    });

    const handleEvent = useCallback(async (event) => {
        if (event.source === "modeler" && event.event === "content.saved") {
            const { xml } = event.data;
            setModelData(xml);
        }
    }, []);

    const modelerOptions = useMemo(() => ({
        container: containerRef.current
    }), []);

    useEffect(() => {
        // Cleanup function for previous modeler
        return () => {
            if (bpmnModelerRef.current?.destroy) {
                bpmnModelerRef.current.destroy();
                bpmnModelerRef.current = null;
            }
            if (dmnModelerRef.current?.destroy) {
                dmnModelerRef.current.destroy();
                dmnModelerRef.current = null;
            }
            if (formEditorRef.current?.destroy) {
                formEditorRef.current.destroy();
                formEditorRef.current = null;
            }
            initializedRef.current = {
                bpmn: false,
                dmn: false,
                form: false
            };
        };
    }, [tabId]);

    const handleChangeModelType = async (newType) => {
        // Cleanup previous modeler
        if (modelType === 'bpmn' && bpmnModelerRef.current?.destroy) {
            bpmnModelerRef.current.destroy();
            bpmnModelerRef.current = null;
        } else if (modelType === 'dmn' && dmnModelerRef.current?.destroy) {
            dmnModelerRef.current.destroy();
            dmnModelerRef.current = null;
        } else if (modelType === 'form' && formEditorRef.current?.destroy) {
            formEditorRef.current.destroy();
            formEditorRef.current = null;
        }

        setModelType(newType);
        initializedRef.current[newType] = false;

        if (newType === "bpmn") {
            setModelData(defaultBpmnXml);
            setFileName("process-model.bpmn");
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

    const handleFormUpload = async (schema) => {
        if (formEditorRef.current) {
            try {
                await formEditorRef.current.importSchema(schema);
                setModelData(schema);
            } catch (err) {
                console.error('Form import error:', err);
                alert('Form yüklenirken bir hata oluştu.');
            }
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
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
                    {modelType === "form" ? (
                        <>
                            <UploadComponent onFormUpload={handleFormUpload} />
                            <ExportComponent
                                formEditorRef={formEditorRef}
                                fileName={fileName}
                            />
                        </>
                    ) : (
                        <>
                            <UploadComponent onFileUpload={handleFileUpload} />
                            <ExportComponent
                                modelData={modelData}
                                fileName={fileName}
                                bpmnModelerRef={modelType === "bpmn" ? bpmnModelerRef : dmnModelerRef}
                            />
                        </>
                    )}
                </Space>

                <div ref={containerRef} style={{ height: 'calc(100vh - 200px)', border: '1px solid #f0f0f0' }}>
                    {modelType === "bpmn" && (
                        <BpmnModeler
                            key={`bpmn-${tabId}`}
                            xml={modelData}
                            onMount={(modeler) => {
                                if (!initializedRef.current.bpmn) {
                                    bpmnModelerRef.current = modeler;
                                    initializedRef.current.bpmn = true;
                                    onModelerRef?.(modeler);
                                }
                            }}
                            onEvent={handleEvent}
                            options={modelerOptions}
                        />
                    )}
                    {modelType === "dmn" && (
                        <DmnModeler
                            key={`dmn-${tabId}`}
                            xml={modelData}
                            onMount={(modeler) => {
                                if (!initializedRef.current.dmn) {
                                    dmnModelerRef.current = modeler;
                                    initializedRef.current.dmn = true;
                                    onModelerRef?.(modeler);
                                }
                            }}
                            onEvent={handleEvent}
                            options={modelerOptions}
                        />
                    )}
                    {modelType === "form" && (
                        <CamundaForm 
                            key={`form-${tabId}`}
                            formData={modelData}
                            editorRef={formEditorRef}
                        />
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default ModelerComponent;
