// src/pages/SwipePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAllUsers,
  getSwipedUserIds,
  recordSwipe,
  checkReverselike,
  createMatch,
} from "../firebase/firestore";

const SwipePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [matchAlert, setMatchAlert] = useState(null); // name of matched user
  const [animClass, setAnimClass] = useState("");

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      const [allUsers, swipedIds] = await Promise.all([
        getAllUsers(),
        getSwipedUserIds(user.uid),
      ]);

      const unseen = allUsers.filter(
        (u) => u.id !== user.uid && !swipedIds.includes(u.id)
      );
      setCandidates(unseen);
      setLoading(false);
    };

    load();
  }, [user]);

  const handleSwipe = async (action) => {
    if (swiping || index >= candidates.length) return;
    setSwiping(true);

    const target = candidates[index];

    // Animate card out
    setAnimClass(action === "like" ? "swipe-right" : "swipe-left");

    await recordSwipe(user.uid, target.id, action);

    if (action === "like") {
      const isMatch = await checkReverselike(user.uid, target.id);
      if (isMatch) {
        await createMatch(user.uid, target.id);
        setMatchAlert(target.name);
      }
    }

    setTimeout(() => {
      setAnimClass("");
      setIndex((i) => i + 1);
      setSwiping(false);
    }, 350);
  };

  const currentUser = candidates[index];

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Finding hackers near you...</p>
      </div>
    );
  }

  return (
    <div className="swipe-page">
      {/* Match Alert Modal */}
      {matchAlert && (
        <div className="match-overlay">
          <div className="match-modal">
            <div className="match-confetti">🎉</div>
            <h2>It's a Match!</h2>
            <p>You and <strong>{matchAlert}</strong> both liked each other!</p>
            <div className="match-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  setMatchAlert(null);
                  navigate("/matches");
                }}
              >
                View Matches
              </button>
              <button
                className="btn-secondary"
                onClick={() => setMatchAlert(null)}
              >
                Keep Swiping
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="swipe-container">
        <div className="swipe-header">
          <h2>Discover Teammates</h2>
          <span className="remaining-count">
            {candidates.length - index} left
          </span>
        </div>

        {currentUser ? (
          <div className={`card ${animClass}`}>
            <div className="card-avatar">
              {currentUser.name?.charAt(0).toUpperCase()}
            </div>
            <div className="card-body">
              <h2 className="card-name">{currentUser.name}</h2>
              <p className="card-bio">{currentUser.bio}</p>
              <div className="card-skills">
                {currentUser.skills?.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>

            <div className="swipe-buttons">
              <button
                className="btn-pass"
                onClick={() => handleSwipe("pass")}
                disabled={swiping}
                title="Pass"
              >
                ❌
              </button>
              <button
                className="btn-like"
                onClick={() => handleSwipe("like")}
                disabled={swiping}
                title="Like"
              >
                👍
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🏁</div>
            <h3>You've seen everyone!</h3>
            <p>Check your matches or come back later when new hackers join.</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/matches")}
            >
              View My Matches
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipePage;
