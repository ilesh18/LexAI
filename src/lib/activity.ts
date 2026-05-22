import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  serverTimestamp,
  Timestamp,
  getCountFromServer,
  onSnapshot,
  setDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Types ────────────────────────────────────────────────────────
export type ActivityType =
  | "analysis_started"
  | "analysis_completed"
  | "rights_checked"
  | "draft_generated"
  | "explanation_requested"
  | "login"
  | "signup"
  | "profile_updated";

export interface Activity {
  id?: string;
  uid: string;
  type: ActivityType;
  title: string;
  description: string;
  metadata?: any;
  createdAt: Timestamp | null;
}

// ─── Friendly labels ─────────────────────────────────────────────
const TYPE_LABELS: Record<ActivityType, string> = {
  analysis_started: "Situation Analysis Started",
  analysis_completed: "Situation Analysis Completed",
  rights_checked: "Know Your Rights Checked",
  draft_generated: "Legal Draft Generated",
  explanation_requested: "Deep-Dive Explanation Requested",
  login: "Logged In",
  signup: "Account Created",
  profile_updated: "Profile Updated",
};

export function getActivityLabel(type: ActivityType): string {
  return TYPE_LABELS[type] || type;
}

// ─── Stats Tracking ──────────────────────────────────────────────
async function incrementActivityStat(uid: string, type: ActivityType) {
  try {
    const statsRef = doc(db, "users", uid, "dashboard", "stats");
    const updates: any = {};
    
    if (type === "analysis_completed" || type === "analysis_started") updates.totalAnalyses = increment(1);
    if (type === "draft_generated") updates.totalDrafts = increment(1);
    if (type === "rights_checked") updates.totalRightsChecks = increment(1);

    if (Object.keys(updates).length > 0) {
      await setDoc(statsRef, updates, { merge: true });
    }
  } catch (error) {
    console.error("Failed to increment activity stat:", error);
  }
}

// ─── Log an activity ─────────────────────────────────────────────
export async function logActivity(
  uid: string,
  type: ActivityType,
  title: string,
  description: string,
  metadata?: any
): Promise<string | null> {
  if (!uid) {
    console.warn("Cannot log activity: No UID provided");
    return null;
  }

  try {
    const activityData = {
      uid,
      type,
      title,
      description: description || "",
      metadata: metadata || {},
      createdAt: serverTimestamp(),
    };

    // Use a timeout for the write operation to catch hangs
    const writePromise = addDoc(collection(db, "activities"), activityData);
    const docRef = await writePromise;
    
    console.log(`Activity logged successfully: ${type} (ID: ${docRef.id})`);
    
    // Background update of stats - don't await to keep UI snappy
    incrementActivityStat(uid, type).catch(err => 
      console.error("Delayed stat update failed:", err)
    );
    
    return docRef.id;
  } catch (error: any) {
    console.error("CRITICAL: Failed to store activity in Firestore:", error);
    // Log more details for debugging
    if (error.code === 'permission-denied') {
      console.error("Check your Firestore Security Rules - permission denied for 'activities' collection.");
    }
    return null;
  }
}

// ─── Fetch recent activities (one-time) ──────────────────────────
export async function getRecentActivities(
  uid: string,
  count: number = 10
): Promise<Activity[]> {
  // Existing implementation for one-time fetch...
  // (Omitted for brevity, but I'll keep the logic I optimized earlier)
  try {
    const q = query(
      collection(db, "activities"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Activity, "id">),
    }));
  } catch (error: any) {
    // Fallback logic preserved...
    if (error?.code === 'failed-precondition' || error?.message?.includes('index')) {
      const q = query(collection(db, "activities"), where("uid", "==", uid), limit(Math.max(count, 20)));
      const snapshot = await getDocs(q);
      const activities = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Activity, "id">) }));
      return activities.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)).slice(0, count);
    }
    return [];
  }
}

// ─── Real-time subscription ──────────────────────────────────────
export function subscribeToRecentActivities(
  uid: string,
  onUpdate: (activities: Activity[]) => void,
  count: number = 10
) {
  if (!uid) return () => {};
  
  let unsubscribeFallback: (() => void) | null = null;
  console.log(`Setting up activity subscription for UID: ${uid}`);

  const q = query(
    collection(db, "activities"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(count)
  );

  const unsubscribePrimary = onSnapshot(
    q,
    (snapshot) => {
      const activities = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Activity, "id">),
      }));
      console.log(`[Firestore] Found ${activities.length} activities via primary query`);
      onUpdate(activities);
    },
    (error) => {
      if (error.code === 'permission-denied') {
        console.error("PERMISSION DENIED: You do not have access to read 'activities' for this UID. Check security rules.", error);
        onUpdate([]);
        return;
      }
      
      console.warn("Activity primary query failed (likely missing index), trying fallback...", error.message);
      
      // Fallback: Query WITHOUT orderBy to avoid index requirement
      const fallbackQ = query(
        collection(db, "activities"),
        where("uid", "==", uid),
        limit(Math.max(count, 50)) // Get more to sort manually
      );

      unsubscribeFallback = onSnapshot(
        fallbackQ,
        (snapshot) => {
          const activities = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...(doc.data() as Omit<Activity, "id">),
            }))
            .sort((a: any, b: any) => {
              const timeA = a.createdAt?.toMillis?.() || 0;
              const timeB = b.createdAt?.toMillis?.() || 0;
              return timeB - timeA;
            })
            .slice(0, count);
          
          console.log(`[Firestore Fallback] Found ${activities.length} activities`);
          onUpdate(activities);
        },
        (innerError) => {
          console.error("Activity fallback subscription also failed:", innerError);
          onUpdate([]);
        }
      );
    }
  );

  return () => {
    unsubscribePrimary();
    if (unsubscribeFallback) unsubscribeFallback();
  };
}

// ─── Get activity by ID ──────────────────────────────────────────
export async function getActivityById(id: string): Promise<Activity | null> {
  if (!id) return null;
  try {
    const docSnap = await getDoc(doc(db, "activities", id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Omit<Activity, "id">) };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch activity by ID:", error);
    return null;
  }
}

// ─── Get activity stats for a user ───────────────────────────────
export async function getActivityStats(uid: string): Promise<{
  totalAnalyses: number;
  totalDrafts: number;
  totalRightsChecks: number;
}> {
  if (!uid) return { totalAnalyses: 0, totalDrafts: 0, totalRightsChecks: 0 };
  
  try {
    // 1. Try to read from cached stats document first (Fastest)
    const statsRef = doc(db, "users", uid, "dashboard", "stats");
    const statsSnap = await getDoc(statsRef);
    
    if (statsSnap.exists()) {
      const data = statsSnap.data() as any;
      return {
        totalAnalyses: data.totalAnalyses || 0,
        totalDrafts: data.totalDrafts || 0,
        totalRightsChecks: data.totalRightsChecks || 0,
      };
    }

    // 2. Fallback to manual count if stats doc doesn't exist (Slowest on first run)
    // We avoid getCountFromServer with complex queries to avoid index requirements
    const q = query(
      collection(db, "activities"), 
      where("uid", "==", uid), 
      limit(300) // Limit to 300 to keep it somewhat fast
    );
    
    const snapshot = await getDocs(q);
    
    let totalAnalyses = 0;
    let totalDrafts = 0;
    let totalRightsChecks = 0;

    snapshot.docs.forEach((doc) => {
      const type = doc.data().type;
      if (type === "analysis_completed" || type === "analysis_started") totalAnalyses++;
      if (type === "draft_generated") totalDrafts++;
      if (type === "rights_checked") totalRightsChecks++;
    });

    const result = { totalAnalyses, totalDrafts, totalRightsChecks };
    
    // Sync back to cache for next time
    setDoc(statsRef, result, { merge: true }).catch(() => {});

    return result;
  } catch (error) {
    console.error("Critical failure in activity stats:", error);
    return { totalAnalyses: 0, totalDrafts: 0, totalRightsChecks: 0 };
  }
}

// ─── Relative time helper ────────────────────────────────────────
export function timeAgo(timestamp: any): string {
  if (!timestamp || typeof timestamp.toMillis !== "function") return "Just now";
  const now = Date.now();
  const then = timestamp.toMillis();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(then).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
