import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import emailjs from "@emailjs/browser";

const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const API = process.env.REACT_APP_API || "https://techfest-backend-uhzx.onrender.com";

  useEffect(() => {
    emailjs.init("FYlEzhXlihRYORcD7");

    if (!state || !state.eventName || !state.fee) {
      alert("No event selected. Please register again.");
      window.location.href = "/register";
    }

    // 🎨 Circuit background
    const canvas = document.getElementById("circuit-bg-payment");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 1,
        dy: (Math.random() - 0.5) * 1,
        radius: 1.2,
      });
    }

    function animate() {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
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
  }, [state]);

  // ✅ Correct fee calculation
  let totalAmount = state.fee;
  if (state.selectedGame?.feeType === "perPerson") {
    totalAmount = state.fee * ((state?.teamMembers?.length || 0) + 1);
  }

  const handlePayment = async () => {
    const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const options = {
      key: "rzp_live_RJ1br1Dx4D0CRR",
      amount: totalAmount * 100,
      currency: "INR",
      name: "TechFest 2025",
      description: `Registration for ${state.eventName}`,
      image: "/logo.png",

      handler: async function (response) {
        const participantData = {
          fullName: state.fullName,
          email: state.email,
          phone: state.phone,
          collegeName: state.collegeName,
          department: state.department, // ✅ FIX: send department to backend
          city: state.city,
          eventName: state.eventName,
          category: state.selectedGame?.category || state.category || "Unknown",
          teamName: state.teamName || "",
          teamMembers: (state.teamMembers || []).map((m) => {
            if (typeof m === "string") return m;
            if (typeof m === "object" && m !== null) {
              return m.name || m.fullName || Object.values(m).join(" ");
            }
            return String(m);
          }),
          fee: totalAmount,
          paymentId: response.razorpay_payment_id,
        };

        try {
          await fetch(`${API}/api/participants`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(participantData),
          });
          console.log("✅ Participant saved to DB");
        } catch (err) {
          console.error("❌ Failed to save participant:", err);
        }

        try {
          await emailjs.send(
            "service_rkt8x8c",
            "template_p2mqcn7",
            {
              fullName: state.fullName,
              eventName: state.eventName,
              fee: totalAmount,
              email: state.email,
            },
            "FYlEzhXlihRYORcD7"
          );
          console.log("✅ Confirmation email sent");
        } catch (error) {
          console.error("❌ Email sending failed:", error);
        }

        navigate("/success", {
          state: {
            fullName: state.fullName,
            email: state.email,
            eventName: state.eventName,
            fee: totalAmount,
            paymentId: response.razorpay_payment_id,
            collegeName: state.collegeName,
            department: state.department, // ✅ pass to success page too
            city: state.city,
          },
        });
      },

      prefill: {
        name: state.fullName,
        email: state.email,
        contact: state.phone,
      },
      notes: {
        teamName: state.teamName || "Solo",
        game: state.eventName,
      },
      theme: {
        color: "#6B21A8",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <Layout>
      {/* Background */}
      <canvas
        id="circuit-bg-payment"
        className="fixed top-0 left-0 w-full h-full -z-10"
      ></canvas>

      {/* Payment Card */}
      <div className="max-w-xl mx-auto p-8 bg-black/70 border border-cyan-500/30 shadow-xl rounded-xl backdrop-blur mt-16">
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 mb-8">
          Confirm Your Payment
        </h2>

        <div className="space-y-4 text-white">
          <p>
            <strong className="text-cyan-400">Event:</strong> {state?.eventName}
          </p>
          <p>
            <strong className="text-cyan-400">Participants:</strong>{" "}
            {state?.selectedGame?.type === "Team"
              ? `${(state?.teamMembers?.length || 0) + 1} members`
              : "Individual"}
          </p>
          <p>
            <strong className="text-cyan-400">Total Amount:</strong>{" "}
            <span className="text-green-400 font-bold">₹{totalAmount}</span>
          </p>

          <button
            onClick={handlePayment}
            className="w-full mt-6 py-3 rounded-lg text-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:scale-105 hover:shadow-cyan-500/50 transition-transform"
          >
            💳 Make Payment
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;
