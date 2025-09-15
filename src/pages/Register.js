import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Register = () => {
  const [category, setCategory] = useState("Technical");
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    collegeName: "",
    city: "",
    department: "", // ✅ New Department field
    game: "",
    teamName: "",
  });

  const navigate = useNavigate();
  const API = process.env.REACT_APP_API || "https://techfest-backend-uhzx.onrender.com";

  // ✅ Fetch games + registration settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesRes, settingsRes] = await Promise.all([
          fetch(`${API}/api/games`),
          fetch(`${API}/api/settings`),
        ]);
        const gamesData = await gamesRes.json();
        const settingsData = await settingsRes.json();

        setGames(gamesData);
        setRegistrationOpen(settingsData.registrationOpen);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API]);

  // ✅ Select game details
  useEffect(() => {
    const game = games.find((g) => g.name === form.game);
    setSelectedGame(game || null);
    if (game?.type === "Solo") {
      setTeamMembers([]);
    }
  }, [form.game, games]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTeamMember = () => {
    if (teamMembers.length < (selectedGame?.maxTeamSize || 1) - 1) {
      setTeamMembers([...teamMembers, ""]);
    }
  };

  const handleTeamMemberChange = (index, value) => {
    const updated = [...teamMembers];
    updated[index] = value;
    setTeamMembers(updated);
  };

  const handleRemoveTeamMember = (index) => {
    const updated = [...teamMembers];
    updated.splice(index, 1);
    setTeamMembers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!registrationOpen) {
      alert("Registrations are currently closed.");
      return;
    }

    if (form.phone.length !== 10 || !/^[0-9]{10}$/.test(form.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    const totalPlayers =
      selectedGame?.type === "Team" ? teamMembers.length + 1 : 1;
    const totalFee = (selectedGame?.fee || 0) * totalPlayers;

    navigate("/payment", {
      state: {
        ...form,
        eventName: selectedGame.name,
        fee: totalFee,
        selectedGame,
        category: selectedGame.category,
        teamMembers,
      },
    });
  };

  const filteredGames = games.filter((g) => g.category === category);

  // ✅ Background animation
  useEffect(() => {
    const canvas = document.getElementById("circuit-bg-register");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 1,
        dy: (Math.random() - 0.5) * 1,
        radius: 1.2,
      });
    }

    function animate() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ffcc";
      particles.forEach((p, i) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.strokeStyle = "rgba(0,255,200,0.2)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  if (loading) {
    return (
      <Layout>
        <canvas
          id="circuit-bg-register"
          className="fixed top-0 left-0 w-full h-full -z-10"
        ></canvas>
        <div className="text-center py-20 text-lg font-semibold text-cyan-400">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!registrationOpen) {
    return (
      <Layout>
        <canvas
          id="circuit-bg-register"
          className="fixed top-0 left-0 w-full h-full -z-10"
        ></canvas>
        <div className="max-w-2xl mx-auto p-8 bg-black/80 border border-red-500/40 text-center rounded-lg shadow-lg mt-12">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Registrations Closed
          </h2>
          <p className="text-gray-300">
            Registrations are currently closed. Please check back later.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Background */}
      <canvas
        id="circuit-bg-register"
        className="fixed top-0 left-0 w-full h-full -z-10"
      ></canvas>

      {/* Form */}
      <div className="max-w-3xl mx-auto p-8 bg-black/70 border border-cyan-500/30 shadow-lg rounded-xl backdrop-blur mt-12">
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 mb-8">
          Register for TechFest
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block font-semibold text-cyan-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleInputChange}
              className="w-full bg-black/60 border border-cyan-500/30 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Email & Phone */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-cyan-400 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className="w-full bg-black/60 border border-cyan-500/30 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-cyan-400 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                minLength={10}
                maxLength={10}
                pattern="[0-9]{10}"
                className="w-full bg-black/60 border border-cyan-500/30 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>
          </div>

          {/* College Name & Department */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-cyan-400 mb-1">
                College Name
              </label>
              <input
                type="text"
                name="collegeName"
                value={form.collegeName}
                onChange={handleInputChange}
                className="w-full bg-black/60 border border-cyan-500/30 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-cyan-400 mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleInputChange}
                className="w-full bg-black/60 border border-cyan-500/30 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>
          </div>

          {/* city */}
          <div>
            <label className="block font-semibold text-cyan-400 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleInputChange}
              className="w-full bg-black/60 border border-cyan-500/30 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Category & Game */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-cyan-400 mb-1">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setForm({ ...form, game: "" });
                  }}
                  className="w-full appearance-none bg-black/60 border border-cyan-500/40 text-white p-3 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:border-fuchsia-500 transition"
                >
                  <option value="Technical">Technical</option>
                  <option value="Non-Technical">Non-Technical</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-cyan-400 mb-1">
                Select Game
              </label>
              <div className="relative">
                <select
                  name="game"
                  value={form.game}
                  onChange={handleInputChange}
                  required
                  className="w-full appearance-none bg-black/60 border border-cyan-500/40 text-white p-3 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:border-fuchsia-500 transition"
                >
                  <option value="">-- Select --</option>
                  {filteredGames.map((g, i) => (
                    <option key={i} value={g.name}>
                      {g.name}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Team Name */}
          {selectedGame?.type === "Team" && (
            <div>
              <label className="block font-semibold text-cyan-400 mb-1">
                Team Name
              </label>
              <input
                type="text"
                name="teamName"
                value={form.teamName}
                onChange={handleInputChange}
                className="w-full bg-black/60 border border-cyan-500/30 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>
          )}

          {/* Team Members */}
          {selectedGame?.type === "Team" && (
            <div>
              <label className="block font-semibold text-cyan-400 mb-2">
                Team Members
              </label>
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Member ${index + 2}`}
                    value={member}
                    onChange={(e) =>
                      handleTeamMemberChange(index, e.target.value)
                    }
                    className="flex-1 bg-black/60 border border-cyan-500/30 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTeamMember(index)}
                    className="px-3 py-2 text-red-400 hover:text-red-600 hover:scale-110 transition-transform font-bold"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {teamMembers.length < (selectedGame?.maxTeamSize || 1) - 1 ? (
                <button
                  type="button"
                  onClick={handleAddTeamMember}
                  className="mt-2 px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm hover:scale-105 transition-transform"
                >
                  + Add Participant
                </button>
              ) : (
                <p className="text-sm text-red-400 mt-1">
                  Maximum players reached
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!registrationOpen}
            className={`w-full font-bold py-3 rounded-lg transition-transform ${
              registrationOpen
                ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg hover:scale-105"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
          >
            Proceed to Pay
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
