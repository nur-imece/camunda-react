import React, { useState, useEffect } from "react";
import axios from "axios";

const CamundaUser = () => {
    const [formData, setFormData] = useState({
        Name: "",
        Email: "",
        KrediMiktari: "",
        User: "",
    });

    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        getCamundaUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "user") {
            setSelectedUserId(value);
        }
    };

    const getCamundaUsers = () => {
        axios
            .get(`http://52.169.20.31:8083/engine-rest/user`)
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("Name", formData.Name);
        data.append("Email", formData.Email);
        data.append("KrediMiktari", formData.KrediMiktari);
        data.append("User", formData.user);

        try {
            const response = await axios.post(
                "http://localhost:7071/api/LoanApplication",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                    timeout: 10000,
                }
            );

            console.log("Process started successfully:", response);
            alert("Process started successfully!");
        } catch (error) {
            console.error("Error starting process:", error);
            alert("Failed to start process.");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ textAlign: "center", color: "#333" }}>User Panel</h2>
            <h3 style={{ textAlign: "center", color: "#333" }}>Start Process</h3>
            <form
                onSubmit={handleSubmit}
                style={{
                    background: "#f9f9f9",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
            >
                <div style={{ marginBottom: "15px" }}>
                    <label
                        htmlFor="Name"
                        style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
                    >
                        Name:
                    </label>
                    <input
                        type="text"
                        id="Name"
                        name="Name"
                        value={formData.Name}
                        onChange={handleChange}
                        required
                        style={{ padding: "10px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label
                        htmlFor="Email"
                        style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
                    >
                        Email:
                    </label>
                    <input
                        type="email"
                        id="Email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        required
                        style={{ padding: "10px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label
                        htmlFor="KrediMiktari"
                        style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
                    >
                        Kredi Miktarı:
                    </label>
                    <input
                        type="number"
                        id="KrediMiktari"
                        name="KrediMiktari"
                        value={formData.KrediMiktari}
                        onChange={handleChange}
                        required
                        style={{ padding: "10px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label
                        htmlFor="user"
                        style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
                    >
                        Onaylayacak Manager:
                    </label>
                    <select
                        id="user"
                        name="user"
                        value={formData.user}
                        onChange={handleChange}
                        required
                        style={{ padding: "10px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }}
                    >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.firstName} {user.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    style={{
                        padding: "10px 20px",
                        width: "100%",
                        background: "#007BFF",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Talep Oluştur
                </button>
            </form>
        </div>
    );
};

export default CamundaUser;
