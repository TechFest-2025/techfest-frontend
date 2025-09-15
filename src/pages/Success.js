import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fullName, email, eventName } = location.state || {};

  useEffect(() => {
    const canvas = document.getElementById("circuit-bg-success");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    let fireworks = [];

    // Circuit background particles
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 1,
        dy: (Math.random() - 0.5) * 1,
        radius: 1.2,
      });
    }

    // Fireworks system
    function createFirework(x, y) {
      const colors = ["#ff007f", "#00ffff", "#39ff14", "#ffae00", "#ff4d4d"];
      const numParticles = 50;
      let fw = [];
      for (let i = 0; i < numParticles; i++) {
        const angle = (i * Math.PI * 2) / numParticles;
        const speed = Math.random() * 4 + 2;
        fw.push({
          x,
          y,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          radius: 2,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      fireworks.push(fw);
    }

    // Launch fireworks randomly
    setInterval(() => {
      createFirework(
        Math.random() * canvas.width,
        Math.random() * canvas.height * 0.6
      );
    }, 1500);

    function animate() {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw circuit background particles
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

      // Draw fireworks
      fireworks.forEach((fw, fwIndex) => {
        fw.forEach((p) => {
          p.x += p.dx;
          p.y += p.dy;
          p.dy += 0.02; // gravity
          p.alpha -= 0.01;

          ctx.beginPath();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        });

        fireworks[fwIndex] = fw.filter((p) => p.alpha > 0);
      });

      fireworks = fireworks.filter((fw) => fw.length > 0);

      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout>
      {/* Circuit Background + Fireworks */}
      <canvas
        id="circuit-bg-success"
        className="fixed top-0 left-0 w-full h-full -z-10"
      ></canvas>

      {/* Success Card */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
        <div className="bg-black/70 border border-green-400/40 shadow-xl rounded-xl backdrop-blur-lg p-8 max-w-lg text-center relative z-10">
          {/* ✅ Animated Tick (SVG stroke animation) */}
          <svg
            className="w-20 h-20 mx-auto mb-6 text-green-400"
            viewBox="0 0 52 52"
          >
            <circle
              className="stroke-green-400"
              cx="26"
              cy="26"
              r="25"
              fill="none"
              strokeWidth="3"
              strokeDasharray="166"
              strokeDashoffset="166"
              style={{
                animation: "dash-circle 1s ease forwards",
              }}
            />
            <path
              className="stroke-green-400"
              fill="none"
              strokeWidth="3"
              d="M14 27l7 7 16-16"
              strokeDasharray="48"
              strokeDashoffset="48"
              style={{
                animation: "dash-check 1s ease forwards 1s",
              }}
            />
          </svg>

          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-4">
            Payment Successful!
          </h2>

          <p className="text-lg text-white mb-2">
            Thank you,{" "}
            <span className="font-semibold text-cyan-300">{fullName}</span>.
          </p>
          <p className="text-gray-300 mb-2">
            Your registration for{" "}
            <span className="font-semibold text-purple-400">{eventName}</span>{" "}
            is confirmed.
          </p>
          <p className="text-gray-400 mb-6">
            A confirmation email has been sent to{" "}
            <span className="font-semibold text-fuchsia-400">{email}</span>.
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-400 hover:scale-105 transition-transform text-white font-semibold py-2 px-6 rounded-lg shadow-lg shadow-purple-500/50"
          >
            ⬅ Back to Home
          </button>
        </div>
      </div>

      {/* Stroke animations */}
      <style>{`
        @keyframes dash-circle {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes dash-check {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Success;