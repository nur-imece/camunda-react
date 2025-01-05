import React, { useEffect, useState } from "react";
import axios from "axios";

const CamundaAdmin = () => {
    const [businessKeys, setBusinessKeys] = useState([]);
    const [selectedVariables, setSelectedVariables] = useState(null);
    const [taskId, setTaskId] = useState();
    const [dynamicForm, setDynamicForm] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [currentBusinessKey, setCurrentBusinessKey] = useState(null);

    useEffect(() => {
        axios
            .get("http://52.169.20.31:8083/engine-rest/task?assignee=nur123")
            .then((response) => {
                setBusinessKeys(response.data);
            })
            .catch((error) => {
                console.error("Error fetching process instances:", error);
            });
    }, []);

    const handleBusinessKeyClick = (id) => {
        axios
            .get(`http://52.169.20.31:8083/engine-rest/process-instance/${id}/variables`)
            .then((response) => {
                const variables = response.data;
                setSelectedVariables(variables);

                const email = variables.Email?.value || ""; // Access Email and its value
                setCurrentBusinessKey(email);

                getTaskInfo(id);
            })
            .catch((error) => {
                console.error("Error fetching process variables:", error);
            });
    };


    const getTaskInfo = (id) => {
        axios
            .get(`http://52.169.20.31:8083/engine-rest/task?processInstanceId=${id}`)
            .then((response) => {
                if (response.data.length > 0) {
                    const taskId = response.data[0].id;
                    setTaskId(taskId);
                    getUserDinamicForm(taskId);
                }
            })
            .catch((error) => {
                console.error("Error fetching task info:", error);
            });
    };

    const getUserDinamicForm = (id) => {
        axios
            .get(`http://52.169.20.31:8083/engine-rest/task/${id}/deployed-form`)
            .then((response) => {
                setDynamicForm(response.data);
                setFormValues({}); // Reset form values when a new form is loaded
            })
            .catch((error) => {
                console.error("Error fetching dynamic form:", error);
            });
    };

    const handleInputChange = (fieldKey, value) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [fieldKey]: {
                value: value,
                type: typeof value === "number" ? "Double" : "String",
            },
        }));
    };

    const submitUserDinamicForm = () => {
        const payload = {
            variables: formValues,
            businessKey: currentBusinessKey,
        };

        axios
            .post(`http://52.169.20.31:8083/engine-rest/task/${taskId}/submit-form`, payload)
            .then(() => {
                alert("Form successfully submitted!");
                setDynamicForm(null); // Clear form after submission
            })
            .catch((error) => {
                console.error("Error submitting form:", error);
            });
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ color: "#333" }}>Admin Panel</h2>
            <div style={{ marginBottom: "20px" }}>
                <h3>Process Instances</h3>
                {businessKeys.length > 0 ? (
                    <ul style={{ padding: 0, listStyleType: "none" }}>
                        {businessKeys.map((instance) => (
                            <li key={instance.id} style={{ marginBottom: "10px" }}>
                                <button
                                    style={{
                                        cursor: "pointer",
                                        color: "#007BFF",
                                        border: "1px solid #ddd",
                                        padding: "5px 10px",
                                        borderRadius: "4px",
                                        background: "#f9f9f9",
                                        textDecoration: "none",
                                    }}
                                    onClick={() => handleBusinessKeyClick(instance.processInstanceId)}
                                >
                                    {instance.id || "No Business Key"}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: "#999" }}>No process instances available.</p>
                )}
            </div>

            {selectedVariables && (
                <div style={{ marginBottom: "20px" }}>
                    <h3>Variables</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                        <thead>
                        <tr style={{ background: "#f1f1f1" }}>
                            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Variable</th>
                            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(selectedVariables).map(([key, value]) => (
                            <tr key={key}>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{key}</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{value.value}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {dynamicForm && (
                <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "5px", background: "#f9f9f9" }}>
                    <h3>Dynamic Form</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitUserDinamicForm();
                        }}
                    >
                        {dynamicForm.components.map((component) => (
                            <div key={component.key} style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>{component.label}</label>
                                {component.type === "textfield" && (
                                    <input
                                        type="text"
                                        value={formValues[component.key]?.value || ""}
                                        onChange={(e) => handleInputChange(component.key, e.target.value)}
                                        style={{ padding: "8px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }}
                                    />
                                )}
                                {component.type === "number" && (
                                    <input
                                        type="number"
                                        value={formValues[component.key]?.value || ""}
                                        onChange={(e) => handleInputChange(component.key, parseFloat(e.target.value))}
                                        style={{ padding: "8px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }}
                                    />
                                )}
                                {component.type === "select" && (
                                    <select
                                        value={formValues[component.key]?.value || ""}
                                        onChange={(e) => handleInputChange(component.key, e.target.value)}
                                        style={{ padding: "8px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }}
                                    >
                                        <option value="">Select an option</option>
                                        {component.values.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        ))}
                        <button
                            type="submit"
                            style={{ padding: "10px 20px", background: "#007BFF", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CamundaAdmin;
