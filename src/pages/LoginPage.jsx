// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, logIn } from "../firebase/auth";
import { getUserProfile } from "../firebase/firestore";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const cred = await logIn(email, password);
        const profile = await getUserProfile(cred.user.uid);
        navigate(profile ? "/swipe" : "/setup");
      } else {
        await signUp(email, password);
        navigate("/setup");
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(auth.*\)/, ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-hero">
          <div className="hero-icon">⚡</div>
          <h1 className="hero-title">HackMate</h1>
          <p className="hero-sub">Swipe. Match. Build together.</p>
          <div className="hero-tags">
            <span className="tag">React</span>
            <span className="tag">Node.js</span>
            <span className="tag">Python</span>
            <span className="tag">Design</span>
            <span className="tag">ML</span>
            <span className="tag">DevOps</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`tab ${isLogin ? "active" : ""}`}
              onClick={() => { setIsLogin(true); setError(""); }}
            >
              Sign In
            </button>
            <button
              className={`tab ${!isLogin ? "active" : ""}`}
              onClick={() => { setIsLogin(false); setError(""); }}
            >
              Sign Up
            </button>
          </div>

          <h2 className="auth-title">
            {isLogin ? "Welcome back 👋" : "Join the community 🚀"}
          </h2>
          <p className="auth-desc">
            {isLogin
              ? "Sign in to find your next hackathon partner."
              : "Create an account and start matching with builders."}
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && <p className="error-msg">⚠️ {error}</p>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
