import React, { useState } from "react";
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
  "components": [
    {
      "id": "table_1",
      "key": "table_1",
      "label": "Table",
      "type": "table",
      "headers": [
        {
          "id": "col_1",
          "label": "ID",
          "key": "id"
        },
        {
          "id": "col_2",
          "label": "Name",
          "key": "name"
        },
        {
          "id": "col_3",
          "label": "Date",
          "key": "date"
        }
      ],
      "rows": [
        ["Content", "Content", "Content"]
      ]
    }
  ]
}`;

const MultiTabModeler = () => {
    // Boş sekme listesi ile başla
    const [tabs, setTabs] = useState([]);
    const [activeTabId, setActiveTabId] = useState(null);

    const updateTabContent = (tabId, newContent) => {
        setTabs((prevTabs) =>
            prevTabs.map((t) =>
                t.id === tabId
                    ? { ...t, content: newContent }
                    : t
            )
        );
    };

    const getActiveTab = () => {
        return tabs.find((t) => t.id === activeTabId);
    };

    const activeTab = getActiveTab();

    const createNewTab = (type) => {
        let defaultContent;
        let defaultName;

        if (type === "bpmn") {
            defaultContent = defaultBpmnXml;
            defaultName = "New Diagram.bpmn";
        } else if (type === "dmn") {
            defaultContent = defaultDmnXml;
            defaultName = "New Decision.dmn";
        } else {
            defaultContent = defaultFormJson;
            defaultName = "New Form.form";
        }

        const newTab = {
            id: "tab-" + Date.now(),
            name: defaultName,
            type,
            content: defaultContent
        };

        setTabs((prev) => [...prev, newTab]);
        setActiveTabId(newTab.id);
    };

    const closeTab = (tabId) => {
        setTabs((prev) => prev.filter((t) => t.id !== tabId));
        if (tabId === activeTabId && tabs.length > 1) {
            const remaining = tabs.filter((t) => t.id !== tabId);
            if (remaining.length > 0) {
                setActiveTabId(remaining[0].id);
            }
        }
    };

    const handleLoadFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const content = ev.target.result;

            if (file.name.endsWith(".form") || file.name.endsWith(".json")) {
                try {
                    JSON.parse(content);
                    const newTab = {
                        id: "tab-" + Date.now(),
                        name: file.name,
                        type: "form",
                        content
                    };
                    setTabs((prev) => [...prev, newTab]);
                    setActiveTabId(newTab.id);
                } catch (err) {
                    alert("Geçersiz form dosyası");
                }
            } else if (file.name.endsWith(".bpmn") || file.name.endsWith(".xml")) {
                const newTab = {
                    id: "tab-" + Date.now(),
                    name: file.name,
                    type: "bpmn",
                    content
                };
                setTabs((prev) => [...prev, newTab]);
                setActiveTabId(newTab.id);
            } else if (file.name.endsWith(".dmn")) {
                const newTab = {
                    id: "tab-" + Date.now(),
                    name: file.name,
                    type: "dmn",
                    content
                };
                setTabs((prev) => [...prev, newTab]);
                setActiveTabId(newTab.id);
            } else {
                alert("Desteklenmeyen dosya formatı");
            }
        };
        reader.readAsText(file);
    };

    const handleSaveFile = () => {
        if (!activeTab) return;
        const { content, name, type } = activeTab;

        let mimeType = "application/xml";
        let dataToSave = content;

        if (type === "form") {
            mimeType = "application/json";
            try {
                const parsed = JSON.parse(content);
                dataToSave = JSON.stringify(parsed, null, 2);
            } catch (err) {
                alert("Form JSON'u geçersiz. Kaydedilemedi.");
                return;
            }
        }

        const blob = new Blob([dataToSave], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
    };

    const renderActiveModeler = () => {
        if (!activeTab) {
            return (
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: '20px'
                }}>
                    <h2>Yeni bir model oluşturun</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => createNewTab("bpmn")}>Yeni BPMN</button>
                        <button onClick={() => createNewTab("dmn")}>Yeni DMN</button>
                        <button onClick={() => createNewTab("form")}>Yeni Form</button>
                    </div>
                    <div>
                        <input
                            type="file"
                            accept=".bpmn,.dmn,.xml,.json,.form"
                            onChange={handleLoadFile}
                        />
                    </div>
                </div>
            );
        }

        const { type, content, id } = activeTab;

        if (type === "bpmn") {
            return (
                <BpmnModeler
                    xml={content}
                    onChanged={(updatedXml) => {
                        console.log("BPMN değişti");
                        updateTabContent(id, updatedXml);
                    }}
                    onEvent={(event) => console.log("BPMN Event:", event)}
                />
            );
        }

        if (type === "dmn") {
            return (
                <DmnModeler
                    xml={content}
                    onChanged={(updatedXml) => {
                        console.log("DMN değişti");
                        updateTabContent(id, updatedXml);
                    }}
                    onEvent={(event) => console.log("DMN Event:", event)}
                />
            );
        }

        if (type === "form") {
            let formJson;
            try {
                formJson = JSON.parse(content);
            } catch (err) {
                formJson = {};
            }

            return (
                <CamundaForm
                    initialSchema={formJson}
                    onSchemaChange={(newSchema) => {
                        console.log("Form değişti");
                        updateTabContent(id, JSON.stringify(newSchema, null, 2));
                    }}
                />
            );
        }

        return <div>Geçersiz tip: {type}</div>;
    };

    return (
        <div style={{ padding: "10px" }}>
            <h1>Modeler</h1>

            {tabs.length > 0 && (
                <>
                    <div style={{ marginBottom: "10px" }}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                style={{
                                    marginRight: 5,
                                    backgroundColor: tab.id === activeTabId ? "#ddd" : "#fff",
                                    padding: "5px 10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px"
                                }}
                                onClick={() => setActiveTabId(tab.id)}
                            >
                                {tab.name} &nbsp;
                                <span
                                    style={{ color: "red", marginLeft: 4, cursor: "pointer" }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        closeTab(tab.id);
                                    }}
                                >
                                    x
                                </span>
                            </button>
                        ))}
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <button onClick={() => createNewTab("bpmn")}>Yeni BPMN</button>
                        <button onClick={() => createNewTab("dmn")}>Yeni DMN</button>
                        <button onClick={() => createNewTab("form")}>Yeni Form</button>

                        <input
                            type="file"
                            style={{ marginLeft: 15 }}
                            accept=".bpmn,.dmn,.xml,.json,.form"
                            onChange={handleLoadFile}
                        />
                        
                        <button 
                            style={{ marginLeft: "10px" }} 
                            onClick={handleSaveFile}
                            disabled={!activeTab}
                        >
                            Aktif Sekmeyi Kaydet
                        </button>
                    </div>
                </>
            )}

            <div style={{ height: "75vh", border: "1px solid #ccc" }}>
                {renderActiveModeler()}
            </div>
        </div>
    );
};

export default MultiTabModeler; 