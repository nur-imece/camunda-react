import React, { useState, useRef, useEffect } from "react";
import { BpmnModeler, DmnModeler } from "@miragon/camunda-web-modeler";
import CamundaForm from './camundaForm';

// Varsayılan içerikler
const defaultBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions 
    xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    targetNamespace="http://bpmn.io/schema/bpmn"
    id="Definitions_1"
>
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Başlangıç" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

const defaultDmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<definitions 
    xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" 
    xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" 
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC/" 
    xmlns:feel="https://www.omg.org/spec/FEEL/20140401"
    id="definitions"
    name="definitions"
    namespace="http://camunda.org/schema/1.0/dmn"
>
    <decision id="decision_1" name="Karar 1">
        <decisionTable id="decisionTable_1">
            <input id="input_1">
                <inputExpression id="inputExpression_1" typeRef="string">
                    <text>inputVar</text>
                </inputExpression>
            </input>
            <output id="output_1" typeRef="string" />
        </decisionTable>
    </decision>
    <dmndi:DMNDI>
        <dmndi:DMNDiagram id="DMNDiagram_1"></dmndi:DMNDiagram>
    </dmndi:DMNDI>
</definitions>`;

const defaultFormJson = `{
  "schemaVersion": 3,
  "id": "Form_1",
  "type": "default",
  "components": []
}`;

const ModelerComponent = () => {
    const [modelType, setModelType] = useState("bpmn");
    const [modelData, setModelData] = useState(defaultBpmnXml);
    const [fileName, setFileName] = useState("process-model.bpmn");
    const bpmnModelerRef = useRef(null);

    useEffect(() => {
        console.log("useEffect triggered, bpmnModelerRef:", bpmnModelerRef.current);
        
        if (bpmnModelerRef.current) {
            const modeler = bpmnModelerRef.current;
            console.log("Modeler instance:", modeler);
            
            const handleModelUpdate = async () => {
                try {
                    const { xml } = await modeler.saveXML({ format: true });
                    console.log('Model updated:', xml);
                    setModelData(xml);
                } catch (err) {
                    console.error('Error saving XML:', err);
                }
            };

            modeler.on('commandStack.changed', handleModelUpdate);

            return () => {
                modeler.off('commandStack.changed', handleModelUpdate);
            };
        }
    }, [modelType]); // Only re-run when modelType changes

    const handleChangeModelType = (newType) => {
        setModelType(newType);
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

    const handleNewModel = () => {
        if (modelType === "bpmn") {
            setModelData(defaultBpmnXml);
            setFileName("process-model.bpmn");
        } else if (modelType === "dmn") {
            setModelData(defaultDmnXml);
            setFileName("decision-model.dmn");
        } else if (modelType === "form") {
            setModelData(defaultFormJson);
            setFileName("form-model.form");
        }
    };

    const handleLoadModel = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            
            if (file.name.endsWith('.form') || file.name.endsWith('.json')) {
                try {
                    JSON.parse(content);
                    setModelData(content);
                    setModelType('form');
                } catch (err) {
                    console.error('JSON parse hatası:', err);
                    alert('Geçersiz form dosyası');
                    return;
                }
            } else if (file.name.endsWith('.bpmn')) {
                setModelData(content);
                setModelType('bpmn');
            } else if (file.name.endsWith('.dmn')) {
                setModelData(content);
                setModelType('dmn');
            }
            setFileName(file.name);
        };
        reader.readAsText(file);
    };

    const handleSaveModel = async () => {
        try {
            let dataToSave;
            let mimeType;

            if (modelType === "bpmn" && bpmnModelerRef.current) {
                console.log("BPMN export başladı");
                const { xml } = await bpmnModelerRef.current.saveXML({ format: true });
                console.log("handleSaveModel - Exporting XML:", xml);
                dataToSave = xml;
                mimeType = "application/xml";
            } else if (modelType === "dmn" && bpmnModelerRef.current) {
                console.log("DMN export başladı");
                const { xml } = await bpmnModelerRef.current.saveXML({ format: true });
                console.log("handleSaveModel - Exporting XML:", xml);
                dataToSave = xml;
                mimeType = "application/xml";
            } else if (modelType === "form") {
                mimeType = "application/json";
                try {
                    const parsed = JSON.parse(modelData);
                    dataToSave = JSON.stringify(parsed, null, 2);
                } catch (err) {
                    console.error('Form verisi dönüştürme hatası:', err);
                    alert('Form verisi kaydedilirken bir hata oluştu');
                    return;
                }
            } else {
                mimeType = "application/xml";
                dataToSave = modelData;
            }

            const blob = new Blob([dataToSave], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Model kaydetme hatası:', error);
            alert('Model kaydedilirken bir hata oluştu');
        }
    };

    const getModelerComponent = () => {
        switch (modelType) {
            case "bpmn":
                return (
                    <BpmnModeler
                        key="bpmn-editor"
                        xml={modelData}
                        onMount={(modeler) => {
                            console.log('BpmnModeler mounted:', modeler);
                            bpmnModelerRef.current = modeler;
                        }}
                        onChanged={async (event) => {
                            console.log('onChanged triggered', event);
                            if (event.modeler) {
                                bpmnModelerRef.current = event.modeler;
                                try {
                                    const { xml } = await event.modeler.saveXML({ format: true });
                                    console.log('onChanged - Updated XML:', xml);
                                    setModelData(xml);
                                } catch (err) {
                                    console.error('BPMN XML kaydetme hatası:', err);
                                }
                            }
                        }}
                        onEvent={(event) => {
                            console.log('onEvent triggered:', event);
                            if (event.type === 'commandStack.changed' && bpmnModelerRef.current) {
                                bpmnModelerRef.current.saveXML({ format: true })
                                    .then(({ xml }) => {
                                        console.log('onEvent - Updated XML:', xml);
                                        setModelData(xml);
                                    })
                                    .catch(err => {
                                        console.error('Event BPMN XML kaydetme hatası:', err);
                                    });
                            }
                        }}
                    />
                );
            case "dmn":
                return (
                    <DmnModeler
                        key="dmn-editor"
                        xml={modelData}
                        onChanged={(event) => {
                            if (event.modeler) {
                                event.modeler.saveXML({ format: true })
                                    .then(({ xml }) => {
                                        setModelData(xml);
                                    });
                            }
                        }}
                        onEvent={() => {}}
                    />
                );
            case "form":
                let formSchema;
                try {
                    formSchema = typeof modelData === 'string' ? JSON.parse(modelData) : modelData;
                } catch (err) {
                    formSchema = {
                        components: [],
                        type: 'default',
                        id: 'form-' + Date.now(),
                        schemaVersion: 3
                    };
                }

                return (
                    <CamundaForm
                        key="form-editor"
                        initialSchema={formSchema}
                        onSchemaChange={(newSchema) => {
                            setModelData(JSON.stringify(newSchema, null, 2));
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Modeler</h1>

            <div style={{ marginBottom: "10px" }}>
                <label>Model Tipi: </label>
                <select
                    value={modelType}
                    onChange={(e) => handleChangeModelType(e.target.value)}
                >
                    <option value="bpmn">BPMN</option>
                    <option value="dmn">DMN</option>
                    <option value="form">Form</option>
                </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <button onClick={handleNewModel}>Yeni Model</button>
                <input
                    type="file"
                    style={{ marginLeft: "10px" }}
                    accept=".bpmn,.dmn,.xml,.json,.form"
                    onChange={handleLoadModel}
                />
                <button style={{ marginLeft: "10px" }} onClick={handleSaveModel}>
                    Modeli Kaydet
                </button>
            </div>

            <div style={{ height: "80vh", border: "1px solid #ccc" }}>
                {getModelerComponent()}
            </div>
        </div>
    );
};

export default ModelerComponent;