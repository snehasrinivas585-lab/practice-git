import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submitHandler = async (e) => {
  e.preventDefault();
  console.log("Button Clicked");

  

  try {
      const { data } = await axios.post(
        "https://puji-home-foods.onrender.com/api/users/forgot-password",
        { email }
      );

      alert(data.message);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Forgot Password</h2>

      <form onSubmit={submitHandler}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <button type="submit">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}