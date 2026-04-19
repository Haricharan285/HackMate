// src/pages/MatchesPage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getMatches, getUserProfile } from "../firebase/firestore";

const MatchCard = ({ match, currentUserId }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const otherId = match.users.find((id) => id !== currentUserId);
    getUserProfile(otherId).then(setProfile);
  }, [match, currentUserId]);

  if (!profile) {
    return (
      <div className="match-card skeleton">
        <div className="skeleton-avatar" />
        <div className="skeleton-lines">
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
        </div>
      </div>
    );
  }

  return (
    <div className="match-card">
      <div className="match-avatar">
        {profile.name?.charAt(0).toUpperCase()}
      </div>
      <div className="match-info">
        <h3 className="match-name">{profile.name}</h3>
        <p className="match-bio">{profile.bio}</p>
        <div className="match-skills">
          {profile.skills?.map((s) => (
            <span key={s} className="chip small">{s}</span>
          ))}
        </div>
      </div>
      <div className="match-action">
        {profile.linkedin ? (
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-linkedin"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            View LinkedIn Profile
          </a>
        ) : (
          <span className="no-linkedin">No LinkedIn added</span>
        )}
      </div>
    </div>
  );
};

const MatchesPage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMatches(user.uid).then((data) => {
      setMatches(data);
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /></div>;
  }

  return (
    <div className="page-wrapper">
      <div className="matches-page">
        <div className="matches-header">
          <h1>Your Matches</h1>
          <p>These hackers liked you back — time to build something amazing!</p>
        </div>

        {matches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💫</div>
            <h3>No matches yet</h3>
            <p>Go swipe on some profiles and your mutual matches will show up here.</p>
          </div>
        ) : (
          <div className="matches-grid">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                currentUserId={user.uid}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;
