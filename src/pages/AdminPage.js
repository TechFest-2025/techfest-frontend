import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import * as XLSX from "xlsx";
import { FaEdit, FaTrash, FaFileExcel, FaSignOutAlt } from "react-icons/fa";

const AdminPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("games");
  const [games, setGames] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "Technical",
    type: "Solo",
    maxTeamSize: 1,
    fee: 70,
    description: "",
  });
  const [editingGameId, setEditingGameId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [registrationOpen, setRegistrationOpen] = useState(true);

  const API = process.env.REACT_APP_API || "https://techfest-backend-uhzx.onrender.com";

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") navigate("/admin");
  }, [navigate]);

  const fetchGames = async () => {
    try {
      const res = await axios.get(`${API}/api/games`);
      setGames(res.data);
    } catch (err) {
      console.error("❌ Error fetching games:", err);
    }
  };

  const fetchParticipants = async () => {
    try {
      const res = await axios.get(`${API}/api/participants`);
      setParticipants(res.data);
    } catch (err) {
      console.error("❌ Error fetching participants:", err);
    }
  };

  const fetchSetting = async () => {
    try {
      const res = await axios.get(`${API}/api/settings`);
      setRegistrationOpen(res.data.registrationOpen);
    } catch (err) {
      console.error("❌ Error fetching setting:", err);
    }
  };

  const toggleRegistration = async () => {
    try {
      const updated = !registrationOpen;
      await axios.put(`${API}/api/settings`, { registrationOpen: updated });
      setRegistrationOpen(updated);
    } catch (err) {
      console.error("❌ Error updating setting:", err);
    }
  };

  const addOrUpdateGame = async () => {
    try {
      if (editingGameId) {
        await axios.put(`${API}/api/games/${editingGameId}`, form);
      } else {
        await axios.post(`${API}/api/games`, form);
      }
      fetchGames();
      setEditingGameId(null);
      setForm({
        name: "",
        category: "Technical",
        type: "Solo",
        maxTeamSize: 1,
        fee: 70,
        description: "",
      });
    } catch (err) {
      console.error("❌ Error saving game:", err);
    }
  };

  const handleGameChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (game) => {
    setForm({
      name: game.name,
      category: game.category,
      type: game.type,
      maxTeamSize: game.maxTeamSize,
      fee: game.fee,
      description: game.description || "",
    });
    setEditingGameId(game._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this game?")) return;
    try {
      await axios.delete(`${API}/api/games/${id}`);
      fetchGames();
    } catch (err) {
      console.error("❌ Error deleting game:", err);
    }
  };

  const exportToExcel = () => {
    const formatted = participants.map((p) => ({
      Name: p.fullName,
      Email: p.email,
      Phone: p.phone,
      College: p.collegeName || "-",
      Department: p.department || "-", // 🆕 Added Department
      City: p.city || "-",
      Event: p.eventName,
      Category: p.category || "-",
      TeamName: p.teamName || "-",
      Members: p.teamMembers?.length ? p.teamMembers.join(", ") : "-",
      Fee: `₹${p.fee}`,
      PaymentID: p.paymentId,
    }));

    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");
    XLSX.writeFile(wb, "participants.xlsx");
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin");
  };

  useEffect(() => {
    if (view === "games") fetchGames();
    if (view === "participants") fetchParticipants();
    fetchSetting();
  }, [view]);

  return (
    <Layout hideFooter>
      <div className="max-w-7xl mx-auto p-6 bg-black/80 backdrop-blur-md rounded-xl shadow-lg border border-purple-600/40 mt-8 text-white">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-600">
            Admin Dashboard
          </h2>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto">
            <button
              onClick={() => setView("games")}
              className={`w-full sm:w-auto py-2 px-4 rounded font-semibold transition ${
                view === "games"
                  ? "bg-purple-600 text-white"
                  : "border border-purple-500 text-purple-400 hover:bg-purple-600/30"
              }`}
            >
              Insert Game Data
            </button>
            <button
              onClick={() => setView("participants")}
              className={`w-full sm:w-auto py-2 px-4 rounded font-semibold transition ${
                view === "participants"
                  ? "bg-purple-600 text-white"
                  : "border border-purple-500 text-purple-400 hover:bg-purple-600/30"
              }`}
            >
              Participant Details
            </button>

            {/* Registration Toggle */}
            <button
              onClick={toggleRegistration}
              className={`w-full sm:w-auto py-2 px-4 rounded font-semibold transition ${
                registrationOpen ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {registrationOpen ? "Registration Open" : "Registration Closed"}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-4 rounded font-semibold bg-gray-700 hover:bg-gray-800 transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* === Games View === */}
        {view === "games" && (
          <>
            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                name="name"
                placeholder="Game Name"
                value={form.name}
                onChange={handleGameChange}
                className="border border-purple-500/50 bg-black/50 text-white p-2 rounded focus:ring-2 focus:ring-purple-500"
              />
              <select
                name="category"
                value={form.category}
                onChange={handleGameChange}
                className="border border-purple-500/50 bg-black/50 text-white p-2 rounded"
              >
                <option value="Technical">Technical</option>
                <option value="Non-Technical">Non-Technical</option>
              </select>
              <select
                name="type"
                value={form.type}
                onChange={handleGameChange}
                className="border border-purple-500/50 bg-black/50 text-white p-2 rounded"
              >
                <option value="Solo">Solo</option>
                <option value="Team">Team</option>
              </select>
              <input
                type="number"
                name="maxTeamSize"
                placeholder="Max Team Size"
                value={form.maxTeamSize}
                onChange={handleGameChange}
                className="border border-purple-500/50 bg-black/50 text-white p-2 rounded"
              />
              <input
                type="number"
                name="fee"
                placeholder="Fee"
                value={form.fee}
                onChange={handleGameChange}
                className="border border-purple-500/50 bg-black/50 text-white p-2 rounded"
              />
            </div>

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleGameChange}
              className="border border-purple-500/50 bg-black/50 text-white p-2 rounded w-full mb-4"
              rows={3}
            />

            <button
              onClick={addOrUpdateGame}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:scale-105 text-white font-semibold py-2 px-6 rounded shadow-lg shadow-purple-500/50 transition"
            >
              {editingGameId ? "Update Game" : "Add Game"}
            </button>

            {/* Game List */}
            <h3 className="text-xl font-bold mt-8 mb-2 text-purple-400">
              Games List
            </h3>
            <ul className="space-y-3">
              {games.map((g) => (
                <li
                  key={g._id}
                  className="flex flex-col md:flex-row md:justify-between md:items-center bg-black/40 border border-purple-500/30 p-3 rounded gap-2"
                >
                  <div>
                    <strong>{g.name}</strong> ({g.category} - {g.type})<br />
                    Max: {g.maxTeamSize}, ₹{g.fee}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(g)}
                      className="flex items-center gap-1 text-blue-400 hover:underline"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(g._id)}
                      className="flex items-center gap-1 text-red-400 hover:underline"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* === Participant View === */}
        {view === "participants" && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto"
              >
                <FaFileExcel /> Download Excel
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-purple-600/40 text-sm text-white">
                <thead>
                  <tr className="bg-purple-800 text-white">
                    <th className="p-2 border border-purple-500/40">Name</th>
                    <th className="p-2 border border-purple-500/40">Email</th>
                    <th className="p-2 border border-purple-500/40">Phone</th>
                    <th className="p-2 border border-purple-500/40">College</th>
                    <th className="p-2 border border-purple-500/40">Department</th> {/* 🆕 Added */}
                    <th className="p-2 border border-purple-500/40">City</th>
                    <th className="p-2 border border-purple-500/40">Event</th>
                    <th className="p-2 border border-purple-500/40">Team Name</th>
                    <th className="p-2 border border-purple-500/40">Members</th>
                    <th className="p-2 border border-purple-500/40">Fee</th>
                    <th className="p-2 border border-purple-500/40">Payment ID</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, i) => (
                    <tr
                      key={i}
                      className="border-t border-purple-600/20 hover:bg-purple-600/20 transition text-white"
                    >
                      <td className="p-2 border border-purple-500/20">{p.fullName}</td>
                      <td className="p-2 border border-purple-500/20">{p.email}</td>
                      <td className="p-2 border border-purple-500/20">{p.phone}</td>
                      <td className="p-2 border border-purple-500/20">{p.collegeName || "-"}</td>
                      <td className="p-2 border border-purple-500/20">{p.department || "-"}</td> {/* 🆕 Added */}
                      <td className="p-2 border border-purple-500/20">{p.city || "-"}</td>
                      <td className="p-2 border border-purple-500/20">{p.eventName}</td>
                      <td className="p-2 border border-purple-500/20">{p.teamName || "-"}</td>
                      <td className="p-2 border border-purple-500/20">
                        {p.teamMembers?.length ? p.teamMembers.join(", ") : "-"}
                      </td>
                      <td className="p-2 border border-purple-500/20">₹{p.fee}</td>
                      <td className="p-2 border border-purple-500/20">{p.paymentId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminPage;
