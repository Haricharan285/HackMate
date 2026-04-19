// src/firebase/firestore.js
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  collection,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

// ── Users ──────────────────────────────────────────────────

export const createUserProfile = async (userId, profileData) => {
  await setDoc(doc(db, "users", userId), {
    ...profileData,
    id: userId,
  });
};

export const getUserProfile = async (userId) => {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? snap.data() : null;
};

export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => d.data());
};

// ── Swipes ─────────────────────────────────────────────────

export const recordSwipe = async (fromUser, toUser, action) => {
  await addDoc(collection(db, "swipes"), {
    fromUser,
    toUser,
    action,
    timestamp: serverTimestamp(),
  });
};

// Get all userIds the current user has already swiped on
export const getSwipedUserIds = async (userId) => {
  const q = query(collection(db, "swipes"), where("fromUser", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().toUser);
};

// Check if targetUser already liked currentUser (reverse like)
export const checkReverselike = async (fromUser, toUser) => {
  const q = query(
    collection(db, "swipes"),
    where("fromUser", "==", toUser),
    where("toUser", "==", fromUser),
    where("action", "==", "like")
  );
  const snap = await getDocs(q);
  return !snap.empty;
};

// ── Matches ────────────────────────────────────────────────

export const checkExistingMatch = async (userId1, userId2) => {
  // Check both orderings so we don't create duplicates
  const q1 = query(
    collection(db, "matches"),
    where("users", "array-contains", userId1)
  );
  const snap = await getDocs(q1);
  return snap.docs.some((d) => d.data().users.includes(userId2));
};

export const createMatch = async (userId1, userId2) => {
  const alreadyExists = await checkExistingMatch(userId1, userId2);
  if (alreadyExists) return false;

  await addDoc(collection(db, "matches"), {
    users: [userId1, userId2],
    createdAt: serverTimestamp(),
  });
  return true;
};

export const getMatches = async (userId) => {
  const q = query(
    collection(db, "matches"),
    where("users", "array-contains", userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
