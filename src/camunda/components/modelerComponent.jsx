import React, { useState, useRef, useCallback, useMemo } from "react";
import { BpmnModeler, DmnModeler } from "@miragon/camunda-web-modeler";
import CamundaForm from './camundaForm';

// Default contents
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
    <bpmn:startEvent id="StartEvent_1" name="Start" />
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
    <decision id="decision_1" name="Decision 1">
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
                    console.error('Error importing XML:', err);
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

    const getModelerComponent = () => {
        switch (modelType) {
            case "bpmn":
                return (
                    <BpmnModeler
                        key="bpmn-editor"
                        xml={modelData}
                        onMount={(modeler) => {
                            bpmnModelerRef.current = modeler;
                            modeler.importXML(modelData).catch(err => {
                                console.error('Error importing XML:', err);
                            });
                        }}
                        onEvent={handleEvent}
                        options={modelerOptions}
                    />
                );
            case "dmn":
                return (
                    <DmnModeler
                        key="dmn-editor"
                        xml={modelData}
                        onMount={(modeler) => {
                            bpmnModelerRef.current = modeler;
                        }}
                        onEvent={handleEvent}
                        options={modelerOptions}
                    />
                );
            case "form":
                return <CamundaForm key="form-editor" formData={modelData} />;
            default:
                return null;
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Modeler</h1>

            <div style={{ marginBottom: "10px" }}>
                <label>Model Type: </label>
                <select
                    value={modelType}
                    onChange={(e) => handleChangeModelType(e.target.value)}
                >
                    <option value="bpmn">BPMN</option>
                    <option value="dmn">DMN</option>
                    <option value="form">Form</option>
                </select>
            </div>

            <div style={{ height: "80vh", border: "1px solid #ccc" }}>
                {getModelerComponent()}
            </div>
        </div>
    );
};

export default ModelerComponent;
