// DefaultContents.js
export const defaultBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
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

export const defaultDmnXml = `<?xml version="1.0" encoding="UTF-8"?>
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

export const defaultFormJson = `{
  "schemaVersion": 3,
  "id": "Form_1",
  "type": "default",
  "components": []
}`;
