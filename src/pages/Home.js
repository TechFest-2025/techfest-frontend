import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { motion } from "framer-motion";

const Home = () => {
  useEffect(() => {
    // 🎛 Circuit Background Animation (Canvas)
    const canvas = document.getElementById("circuit-bg");
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

  return (
    <Layout>
      {/* === Background Circuit Animation === */}
      <canvas
        id="circuit-bg"
        className="fixed top-0 left-0 w-full h-full -z-10"
      ></canvas>

      {/* === Hero Section === */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-16 gap-12 text-center md:text-left">
        {/* Left Side: Techfest 2025 */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-center md:items-start"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 drop-shadow-lg leading-tight"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            TECHFEST
          </motion.h1>
          <motion.h2
            className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400 drop-shadow-lg mt-2"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            2025
          </motion.h2>
        </motion.div>

        {/* Right Side: Info + Register Box */}
        <motion.div
          className="flex-1 flex flex-col items-center md:items-end space-y-6 w-full"
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* === Two Small Boxes Above Register === */}
          <div className="flex gap-6 justify-center md:justify-end">
            {/* Date Box */}
            <motion.div
              className="flex flex-col items-center justify-center bg-black/70 border border-cyan-500/50 rounded-lg px-6 py-4 text-center shadow-lg backdrop-blur min-w-[120px]"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
            >
              <p className="text-xl md:text-2xl font-extrabold text-cyan-400">Sep 30</p>
              <p className="text-base md:text-lg font-bold text-gray-200">2025</p>
            </motion.div>

            {/* Events Box */}
            <motion.div
              className="flex flex-col items-center justify-center bg-black/70 border border-fuchsia-500/50 rounded-lg px-6 py-4 text-center shadow-lg backdrop-blur min-w-[120px]"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.8 }}
            >
              <p className="text-xl md:text-2xl font-extrabold text-fuchsia-400">10+</p>
              <p className="text-base md:text-lg font-bold text-gray-200">Events</p>
            </motion.div>
          </div>

          {/* === Register Box === */}
          <motion.div
            className="bg-black/70 border border-purple-500/40 rounded-lg shadow-xl p-8 w-full max-w-md backdrop-blur mt-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <p className="text-2xl md:text-3xl font-bold text-right text-gray-200">
              The Global Clash of
            </p>
            <p className="text-4xl md:text-5xl font-extrabold text-right bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 drop-shadow-lg mt-2">
              Techno Talent
            </p>
            <div className="flex justify-end mt-6">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-fuchsia-600 to-purple-700 hover:from-purple-700 hover:to-fuchsia-600 text-white py-3 px-8 rounded-full font-bold shadow-lg transition"
                >
                  Register Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* === About Section === */}
      <section className="relative z-10 py-20 px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-4">
              About TechFest
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              Techfest 2025 is a vibrant{" "}
              <span className="text-fuchsia-400 font-semibold">Technical</span>{" "}
              and{" "}
              <span className="text-fuchsia-400 font-semibold">Non-Technical</span>{" "}
              symposium proudly organized by the students of{" "}
              <span className="text-purple-400">
                Alagappa Institute of Skill Development, Alagappa University
              </span>
              . This flagship event is a celebration of innovation, creativity,
              and talent, providing a platform for young minds to showcase
              their skills, compete in diverse events, and connect with peers.
              <br />
              From challenging competitions that test coding, logic, and
              problem-solving abilities, to fun-filled creative events, Techfest
              2025 offers something exciting for everyone.
            </p>
          </motion.div>

          {/* Logo with Glow (moved right 1 inch on laptop) */}
          <motion.div
            className="flex justify-center md:justify-start md:pl-20"
            initial={{ x: 80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <img
              id="about-logo"
              src="/assets/techfest-logo.png"
              alt="TechFest Logo"
              className="w-40 md:w-64 glow-effect"
            />
          </motion.div>
        </div>
      </section>

      {/* === Glow Effect Styles === */}
      <style>{`
        .glow-effect {
          filter: drop-shadow(0 0 20px #00ffcc) drop-shadow(0 0 40px #00ffcc);
        }
      `}</style>
    </Layout>
  );
};

export default Home;