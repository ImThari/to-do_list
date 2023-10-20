import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, auth, signInWithGoogle } from '../config/firebase';
import GoogleIcon from "../assets/google-logo.svg";
import "../styles/Auth.css";

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const [showRegister, setShowRegister] = useState(false);

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  const handleBackClick = () => {
    setShowRegister(false);
    setError('');
  };

  if (showRegister) {
    return (
      <div className="auth-container">
        <h3>Gimme ur info !!</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignUp}>Register</button>
        <button onClick={handleBackClick}>Back</button>
        {error && <p>{error}</p>}
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h3>Hi !</h3>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn}>Login</button>
      <button onClick={() => signInWithGoogle(auth)}>
        <img src={GoogleIcon} alt="Google Logo" />
      </button>
      <p className="register-link" onClick={handleRegisterClick}>Register here</p>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Auth;
