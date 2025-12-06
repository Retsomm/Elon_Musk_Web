declare module 'firebase/database' {
  export function ref(database: unknown, path?: string): unknown;
  export function set(ref: unknown, value: unknown): Promise<void>;
  export function get(ref: unknown): Promise<unknown>;
  export function onValue(ref: unknown, callback: (snapshot: unknown) => void): () => void;
  export function off(ref: unknown, callback?: (snapshot: unknown) => void): void;
}
declare module 'firebase/app' {
  export function initializeApp(config: unknown): unknown;
  export function getApps(): unknown[];
  export function getApp(name?: string): unknown;
}
declare module 'firebase/auth' {
  export function getAuth(app?: unknown): unknown;
  export function signInWithEmailAndPassword(auth: unknown, email: string, password: string): Promise<unknown>;
  export function createUserWithEmailAndPassword(auth: unknown, email: string, password: string): Promise<unknown>;
  export function signOut(auth: unknown): Promise<void>;
  export function onAuthStateChanged(auth: unknown, callback: (user: unknown) => void): () => void;
}