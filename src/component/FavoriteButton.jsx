import React, { useEffect, useState } from "react";
import { database, auth } from "../firebase";
import { ref, set, remove, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

const FavoriteButton = ({ type, id, noteIdx, defaultContent = "" }) => {
  const [userId, setUserId] = useState(null);
  const [favorite, setFavorite] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const favRef = ref(
      database,
      `favorites/${userId}/${type}/${id}/${noteIdx}`
    );
    const unsubscribe = onValue(favRef, (snapshot) => {
      setFavorite(snapshot.val());
    });
    return () => unsubscribe();
  }, [userId, type, id, noteIdx]);

  const toggleFavorite = () => {
    if (!userId) return;
    const favRef = ref(
      database,
      `favorites/${userId}/${type}/${id}/${noteIdx}`
    );
    if (favorite && favorite.status) {
      remove(favRef);
    } else {
      set(favRef, { status: true, content: defaultContent });
    }
    console.log("寫入路徑", `favorites/${userId}/${type}/${id}/${noteIdx}`);
  };

  return (
    <button className="btn btn-square btn-ghost" onClick={toggleFavorite}>
      {favorite && favorite.status ? (
        <svg
          className="size-[1.2em] text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2"
            fill="red"
            stroke="red"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </g>
        </svg>
      ) : (
        <svg
          className="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </g>
        </svg>
      )}
    </button>
  );
};

export default FavoriteButton;
