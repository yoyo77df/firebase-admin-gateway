import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signOut as fbSignOut,
  type User as FbUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firebaseAuth, firestore } from "@/integrations/firebase/client";

export type AppRole = "admin" | "moderator" | "user";

interface AuthCtx {
  user: FbUser | null;
  roles: AppRole[];
  loading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

async function fetchRoles(uid: string): Promise<AppRole[]> {
  try {
    // Admin role is granted by creating a doc at: admins/{uid}
    // Optional moderator: moderators/{uid}
    const [adminSnap, modSnap] = await Promise.all([
      getDoc(doc(firestore, "admins", uid)),
      getDoc(doc(firestore, "moderators", uid)),
    ]);
    const roles: AppRole[] = [];
    if (adminSnap.exists()) roles.push("admin");
    if (modSnap.exists()) roles.push("moderator");
    return roles;
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FbUser | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, async (u) => {
      setUser(u);
      if (u) setRoles(await fetchRoles(u.uid));
      else setRoles([]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value: AuthCtx = {
    user,
    roles,
    loading,
    isAdmin: roles.includes("admin"),
    isModerator: roles.includes("admin") || roles.includes("moderator"),
    signOut: async () => {
      await fbSignOut(firebaseAuth);
    },
    refresh: async () => {
      if (user) setRoles(await fetchRoles(user.uid));
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
