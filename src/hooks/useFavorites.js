import { useState, useEffect } from "react";
import { database, auth } from "../firebase";
import { ref, set, remove, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

// Hook for managing individual favorite item
export const useFavoriteItem = (
    type,
    id,
    noteIdx,
    defaultContent = ""
) => {
    const [userId, setUserId] = useState(null);
    const [favorite, setFavorite] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: "" });

    // Monitor auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserId(user ? user.uid : null);
        });
        return () => unsubscribe();
    }, []);

    // Monitor favorite status
    useEffect(() => {
        if (!userId) {
            setFavorite(null);
            return;
        }

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
        if (!userId) {
            setAlert({ show: true, message: "請先登入才能收藏" });
            setTimeout(() => setAlert({ show: false, message: "" }), 1500);
            return;
        }

        const favRef = ref(
            database,
            `favorites/${userId}/${type}/${id}/${noteIdx}`
        );

        if (favorite && favorite.status) {
            remove(favRef);
        } else {
            set(favRef, { status: true, content: defaultContent });
        }
    };

    return {
        favorite,
        alert,
        setAlert,
        toggleFavorite,
        userId,
        isFavorited: favorite && favorite.status
    };
};

// Hook for managing all favorites (for Member page)
export const useAllFavorites = () => {
    const [userId, setUserId] = useState(null);
    const [favoritesData, setFavoritesData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser) {
                setUserId(null);
                setFavoritesData({});
                setLoading(false);
                return;
            }

            setUserId(firebaseUser.uid);

            // Listen to favorites data
            const favRef = ref(database, `favorites/${firebaseUser.uid}`);
            const unsubscribeFav = onValue(favRef, (snapshot) => {
                setFavoritesData(snapshot.val() || {});
                setLoading(false);
            });

            return () => unsubscribeFav();
        });

        return () => unsubscribeAuth();
    }, []);

    const removeFavorite = async (
        type,
        id,
        noteIdx
    ) => {
        if (!userId) {
            alert("請先登入或稍後再試");
            return;
        }

        let favPath = `favorites/${userId}/${type}/${id}`;

        // Check if the favorite structure is array or object
        const typeData = favoritesData[type] ;
        if (typeData && typeData[id]) {
            if (Array.isArray(typeData[id])) {
                favPath += `/${noteIdx}`;
            } else if (
                typeof typeData[id] === "object" &&
                !Array.isArray(typeData[id]) &&
                (typeData[id] )[noteIdx ]
            ) {
                favPath += `/${noteIdx}`;
            }
        }

        await remove(ref(database, favPath));
    };

    return {
        userId,
        favoritesData,
        loading,
        removeFavorite
    };
};
