// src/pages/ProfileSetupPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createUserProfile, getUserProfile } from "../firebase/firestore";

const SKILL_SUGGESTIONS = [
  "React", "Vue", "Angular", "Node.js", "Python", "Django", "FastAPI",
  "Go", "Rust", "Java", "Spring", "Flutter", "Swift", "Kotlin",
  "Machine Learning", "Data Science", "DevOps", "Docker", "AWS",
  "Blockchain", "Solidity", "UI/UX Design", "Figma", "GraphQL",
];

const ProfileSetupPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Pre-fill if editing existing profile
  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then((profile) => {
      if (profile) {
        setName(profile.name || "");
        setBio(profile.bio || "");
        setLinkedin(profile.linkedin || "");
        setSkills(profile.skills || []);
      }
      setFetching(false);
    });
  }, [user]);

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 10) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (skills.length === 0) return setError("Add at least one skill.");

    setLoading(true);
    try {
      await createUserProfile(user.uid, { name, bio, linkedin, skills });
      navigate("/swipe");
    } catch (err) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="setup-card">
        <div className="setup-header">
          <span className="setup-emoji">🧑‍💻</span>
          <h1>Build your profile</h1>
          <p>Tell other hackers who you are and what you bring to the table.</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="field">
            <label>Full Name *</label>
            <input
              type="text"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Bio *</label>
            <textarea
              placeholder="I'm a full-stack dev who loves building ML-powered products at hackathons..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="field">
            <label>LinkedIn URL</label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/yourname"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Skills * <span className="label-hint">(up to 10)</span></label>
            <div className="skills-input-wrap">
              <input
                type="text"
                placeholder="Type a skill and press Enter..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                className="btn-add-skill"
                onClick={() => addSkill(skillInput)}
              >
                Add
              </button>
            </div>

            {skills.length > 0 && (
              <div className="skills-chips">
                {skills.map((s) => (
                  <span key={s} className="chip">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)}>×</button>
                  </span>
                ))}
              </div>
            )}

            <div className="skill-suggestions">
              {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).slice(0, 8).map((s) => (
                <button
                  key={s}
                  type="button"
                  className="suggestion"
                  onClick={() => addSkill(s)}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="error-msg">⚠️ {error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Profile & Start Swiping →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
