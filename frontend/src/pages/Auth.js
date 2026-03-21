import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "../styles/Auth.css"; // import the CSS

function Auth() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button onClick={() => setShowLogin(true)}>Login</button>
        <button onClick={() => setShowLogin(false)}>Register</button>
      </div>

      <div>
        {showLogin ? <Login /> : <Register />}
      </div>
    </div>
  );
}

export default Auth;