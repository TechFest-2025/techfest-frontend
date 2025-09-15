import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Events = () => {
  const [activeTab, setActiveTab] = useState("Technical");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState({ Technical: [], NonTechnical: [] });
  const navigate = useNavigate();

  const API =
    process.env.REACT_APP_API ||
    "https://techfest-backend-uhzx.onrender.com";

  const handleEventClick = (event) => setSelectedEvent(event);
  const handleCloseModal = () => setSelectedEvent(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API}/api/games`);
        const games = res.data;

        const technical = games.filter((g) => g.category === "Technical");
        const nonTechnical = games.filter((g) => g.category === "Non-Technical");

        setEvents({ Technical: technical, NonTechnical: nonTechnical });
      } catch (err) {
        console.error("❌ Error fetching events:", err);
      }
    };

    fetchEvents();
  }, [API]);

  useEffect(() => {
    document.body.style.overflow = selectedEvent ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedEvent]);

  useEffect(() => {
    const canvas = document.getElementById("circuit-bg-events");
    if (!canvas) return;
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

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6 },
    }),
  };

  return (
    <Layout>
      <canvas
        id="circuit-bg-events"
        className="fixed top-0 left-0 w-full h-full -z-10"
      ></canvas>

      <section className="relative z-10 py-20 px-6 md:px-16 min-h-[80vh]">
        <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 mb-12">
          Events
        </h1>

        <div className="flex justify-center gap-6 mb-12 flex-wrap">
          {["Technical", "NonTechnical"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-bold text-lg transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white shadow-lg"
                  : "bg-black/60 border border-gray-600 text-gray-300 hover:text-white"
              }`}
            >
              {tab === "Technical" ? "Technical Events" : "Non-Technical Events"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events[activeTab].map((event, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px rgba(0,255,200,0.3)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleEventClick(event)}
              className="cursor-pointer bg-black/70 border border-cyan-500/40 rounded-xl p-6 shadow-md backdrop-blur"
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                {event.name}
              </h3>
              <p className="text-sm text-gray-300">
                Type: {event.type}{" "}
                {event.type === "Team" && `(Max: ${event.maxTeamSize})`}
              </p>
              <p className="text-sm text-purple-400">
                Fee: ₹{event.fee} per person
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 overflow-auto p-4 backdrop-blur-sm">
          <div className="bg-black/90 border border-cyan-500/40 rounded-lg w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
            >
              ×
            </button>

            <h2 className="text-3xl font-extrabold text-cyan-400 mb-3">
              {selectedEvent.name}
            </h2>
            <p className="text-gray-300 mb-2">
              Type: {selectedEvent.type}{" "}
              {selectedEvent.type === "Team" &&
                `(Max: ${selectedEvent.maxTeamSize})`}
            </p>
            <p className="text-purple-400 mb-3">
              Fee: ₹{selectedEvent.fee} per person
            </p>
            <p className="text-gray-200 whitespace-pre-line mb-6">
              {selectedEvent.description || "No description provided."}
            </p>

            <button
              onClick={() => navigate("/register", { state: selectedEvent })}
              className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-700 hover:from-purple-700 hover:to-fuchsia-600 text-white font-bold py-2 px-4 rounded transition-all"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Events;
