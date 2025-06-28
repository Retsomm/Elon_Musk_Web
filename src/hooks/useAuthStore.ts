import { create } from 'zustand';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
} from "firebase/auth";
import "../firebase";

type User = {
  email: string | null;
  name?: string | null;
  photoURL?: string | null;
} | null;
type LoginType = "google" | "email" | null;

interface AuthState {
  user: User;
  loginType: LoginType;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setLoginType: (type: LoginType) => void;
  setLoading: (loading: boolean) => void;
}

const auth = getAuth();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loginType: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoginType: (type) => set({ loginType: type }),
  setLoading: (loading) => set({ loading }),
  register: async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
  },
  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    set({ user: { email: userCredential.user.email }, loginType: "email" });
  },
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    set({
      user: {
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL,
      },
      loginType: "google",
    });
  },
  logout: () => {
    set({ user: null, loginType: null });
    auth.signOut();
  },
}));

// 監聽 Firebase 認證狀態變化
auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
  const { setUser, setLoginType, setLoading } = useAuthStore.getState();
  if (firebaseUser) {
    setUser({
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    });
    const providerId = firebaseUser.providerData[0]?.providerId;
    setLoginType(providerId === "google.com" ? "google" : "email");
  } else {
    setUser(null);
    setLoginType(null);
  }
  setLoading(false);
});