import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");

  const token = window.location.pathname.split("/").pop();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `https://puji-home-foods.onrender.com/api/users/reset-password/${token}`,
        { password }
      );

      alert(data.message);

      window.location.href = "/";
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(rgba(60,0,0,0.85), rgba(60,0,0,0.85))",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "550px",
          background: "#fff",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            background: "#6d0000",
            color: "#fff",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            PUJI HOME FOODS
          </h1>

          <p
            style={{
              marginTop: "8px",
              opacity: 0.9,
            }}
          >
            Customer Portal
          </p>
        </div>

        <div style={{ padding: "40px" }}>
          <div
            style={{
              textAlign: "center",
              fontSize: "50px",
              marginBottom: "10px",
            }}
          >
            🔑
          </div>

          <h2
            style={{
              textAlign: "center",
              color: "#4b0000",
              marginBottom: "10px",
            }}
          >
            Reset Password
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "30px",
            }}
          >
            Enter your new password below
          </p>

          <form onSubmit={submitHandler}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                fontSize: "16px",
                marginBottom: "20px",
                boxSizing: "border-box",
              }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "16px",
                border: "none",
                borderRadius: "12px",
                background: "#9b1111",
                color: "#fff",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}