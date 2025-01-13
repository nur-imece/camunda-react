import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [processVariables, setProcessVariables] = useState(null);

    useEffect(() => {
        fetchAssignedTasks();
    }, []);

    const fetchAssignedTasks = async () => {
        try {
            const response = await axios.get("http://52.169.20.31:8083/engine-rest/task?assignee=nur123");
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleTaskSelect = async (task) => {
        setSelectedTask(task);
        try {
            const response = await axios.get(
                `http://52.169.20.31:8083/engine-rest/process-instance/${task.processInstanceId}/variables`
            );
            setProcessVariables(response.data);
        } catch (error) {
            console.error("Error fetching process variables:", error);
        }
    };

    const handleTaskAction = async (action) => {
        try {
            const variables = {
                approved: { value: action === 'approve', type: "Boolean" }
            };

            await axios.post(
                `http://52.169.20.31:8083/engine-rest/task/${selectedTask.id}/complete`,
                { variables }
            );

            alert(`Process ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
            setSelectedTask(null);
            setProcessVariables(null);
            fetchAssignedTasks(); // Refresh task list
        } catch (error) {
            console.error("Error completing task:", error);
            alert("Failed to process the action.");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ color: "#333", marginBottom: "20px" }}>Admin Panel</h2>
            
            <div style={{ display: "flex", gap: "40px" }}>
                {/* Task List - Left Side */}
                <div style={{ flex: "1" }}>
                    <h3 style={{ color: "#444", marginBottom: "15px" }}>Assigned Tasks</h3>
                    <div style={{ 
                        background: "#f9f9f9",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                    }}>
                        {tasks.length > 0 ? (
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        <th style={tableHeaderStyle}>Task ID</th>
                                        <th style={tableHeaderStyle}>Name</th>
                                        <th style={tableHeaderStyle}>Created</th>
                                        <th style={tableHeaderStyle}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task) => (
                                        <tr key={task.id} style={{
                                            background: selectedTask?.id === task.id ? '#e6f3ff' : 'transparent'
                                        }}>
                                            <td style={tableCellStyle}>{task.id}</td>
                                            <td style={tableCellStyle}>{task.name || 'Unnamed Task'}</td>
                                            <td style={tableCellStyle}>
                                                {new Date(task.created).toLocaleDateString()}
                                            </td>
                                            <td style={tableCellStyle}>
                                                <button
                                                    onClick={() => handleTaskSelect(task)}
                                                    style={buttonStyle}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ textAlign: "center", color: "#666" }}>
                                No tasks assigned.
                            </p>
                        )}
                    </div>
                </div>

                {/* Task Details - Right Side */}
                {selectedTask && (
                    <div style={{ flex: "1" }}>
                        <h3 style={{ color: "#444", marginBottom: "15px" }}>Task Details</h3>
                        <div style={{
                            background: "#f9f9f9",
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                        }}>
                            <h4 style={{ marginBottom: "15px" }}>Process Variables</h4>
                            {processVariables && (
                                <div style={{ marginBottom: "20px" }}>
                                    {Object.entries(processVariables).map(([key, value]) => (
                                        <div key={key} style={{ marginBottom: "10px" }}>
                                            <strong>{key}:</strong> {value.value}
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div style={{ 
                                display: "flex", 
                                gap: "10px",
                                marginTop: "20px",
                                borderTop: "1px solid #ddd",
                                paddingTop: "20px"
                            }}>
                                <button
                                    onClick={() => handleTaskAction('approve')}
                                    style={{
                                        ...buttonStyle,
                                        background: "#28a745",
                                        flex: 1
                                    }}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleTaskAction('reject')}
                                    style={{
                                        ...buttonStyle,
                                        background: "#dc3545",
                                        flex: 1
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const tableHeaderStyle = {
    padding: "12px",
    textAlign: "left",
    backgroundColor: "#007BFF",
    color: "white",
    borderBottom: "2px solid #ddd"
};

const tableCellStyle = {
    padding: "12px",
    borderBottom: "1px solid #ddd"
};

const buttonStyle = {
    padding: "8px 16px",
    background: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
};

export default Admin;
