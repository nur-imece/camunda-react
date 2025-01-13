import React, { useState, useEffect } from "react";
import axios from "axios";

const User = () => {
    // Glossary form state
    const [glossaryForm, setGlossaryForm] = useState({
        name: "",
        shortDescription: "",
        longDescription: "",
    });

    // Process list state
    const [processes, setProcesses] = useState([]);

    useEffect(() => {
        // Süreçleri getir
        getProcesses();
    }, []);

    const handleGlossaryChange = (e) => {
        const { name, value } = e.target;
        setGlossaryForm({
            ...glossaryForm,
            [name]: value,
        });
    };

    const handleGlossarySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:7071/api/CreateGlossary",
                glossaryForm
            );
            alert("Glossary created successfully!");
            setGlossaryForm({ name: "", shortDescription: "", longDescription: "" });
        } catch (error) {
            console.error("Error creating glossary:", error);
            alert("Failed to create glossary.");
        }
    };

    const getProcesses = async () => {
        try {
            const response = await axios.get(
                "http://52.169.20.31:8083/engine-rest/process-instance"
            );
            setProcesses(response.data);
        } catch (error) {
            console.error("Error fetching processes:", error);
        }
    };

    return (
        <div style={{ padding: "20px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
            <div style={{ display: "flex", gap: "40px", justifyContent: "space-between" }}>
                {/* Glossary Creation Section - Left Side */}
                <div style={{ flex: "1", maxWidth: "50%" }}>
                    <h2 style={{ color: "#333" }}>Create Glossary</h2>
                    <form
                        onSubmit={handleGlossarySubmit}
                        style={{
                            background: "#f9f9f9",
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                    >
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                                Name:
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={glossaryForm.name}
                                onChange={handleGlossaryChange}
                                required
                                style={{ padding: "10px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                                Short Description:
                            </label>
                            <input
                                type="text"
                                name="shortDescription"
                                value={glossaryForm.shortDescription}
                                onChange={handleGlossaryChange}
                                required
                                style={{ padding: "10px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                                Long Description:
                            </label>
                            <textarea
                                name="longDescription"
                                value={glossaryForm.longDescription}
                                onChange={handleGlossaryChange}
                                required
                                style={{ 
                                    padding: "10px", 
                                    width: "100%", 
                                    border: "1px solid #ccc", 
                                    borderRadius: "4px",
                                    minHeight: "100px" 
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: "10px 20px",
                                background: "#007BFF",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                width: "100%"
                            }}
                        >
                            Create Glossary
                        </button>
                    </form>
                </div>

                {/* Process List Section - Right Side */}
                <div style={{ flex: "1", maxWidth: "50%" }}>
                    <h2 style={{ color: "#333" }}>Process List</h2>
                    <div style={{ 
                        background: "#f9f9f9", 
                        padding: "20px", 
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        overflowX: "auto"
                    }}>
                        {processes.length > 0 ? (
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        <th style={tableHeaderStyle}>Process ID</th>
                                        <th style={tableHeaderStyle}>Definition ID</th>
                                        <th style={tableHeaderStyle}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {processes.map((process) => (
                                        <tr key={process.id}>
                                            <td style={tableCellStyle}>{process.id}</td>
                                            <td style={tableCellStyle}>{process.definitionId}</td>
                                            <td style={tableCellStyle}>{process.state}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No processes found.</p>
                        )}
                    </div>
                </div>
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

export default User;
