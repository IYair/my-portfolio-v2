import { create } from "zustand";
import { devtools } from "zustand/middleware";
import apiClient from "@/lib/api-client";

// Types
interface DashboardStats {
  posts: number;
  publishedPosts: number;
  projects: number;
  featuredProjects: number;
  contacts: number;
  unreadContacts: number;
}

interface RecentActivity {
  posts: Array<{ id: string; title: string; published: boolean; createdAt: string }>;
  projects: Array<{ id: string; title: string; featured: boolean; createdAt: string }>;
  contacts: Array<{ id: string; name: string; read: boolean; createdAt: string }>;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  published: boolean;
  featured: boolean;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  tags: Array<{ id: number; name: string }>;
  [key: string]: unknown;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description?: string;
  longDescription?: string;
  image?: string;
  demoUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
  [key: string]: unknown;
}

// Store State
interface AdminStore {
  // Dashboard data
  dashboardData: DashboardData | null;
  dashboardLoading: boolean;
  dashboardError: string | null;

  // Posts data
  posts: Post[];
  postsLoading: boolean;
  postsError: string | null;

  // Projects data
  projects: Project[];
  projectsLoading: boolean;
  projectsError: string | null;

  // Contacts data
  contacts: Contact[];
  contactsLoading: boolean;
  contactsError: string | null;

  // Actions
  fetchDashboardData: () => Promise<void>;
  fetchPosts: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchContacts: () => Promise<void>;

  // Reset functions
  resetDashboard: () => void;
  resetPosts: () => void;
  resetProjects: () => void;
  // Cache invalidation
  invalidatePostsCache: () => void;
  invalidateAllCache: () => void;
  resetContacts: () => void;
}

// Cache timestamps to prevent unnecessary refetches
const cacheTimestamps = {
  dashboard: 0,
  posts: 0,
  projects: 0,
  contacts: 0,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const useAdminStore = create<AdminStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      dashboardData: null,
      dashboardLoading: false,
      dashboardError: null,

      posts: [],
      postsLoading: false,
      postsError: null,

      projects: [],
      projectsLoading: false,
      projectsError: null,

      contacts: [],
      contactsLoading: false,
      contactsError: null,

      // Dashboard actions
      fetchDashboardData: async () => {
        const now = Date.now();
        const lastFetch = cacheTimestamps.dashboard;

        // Skip if recently fetched
        if (now - lastFetch < CACHE_DURATION && get().dashboardData) {
          return;
        }

        set({ dashboardLoading: true, dashboardError: null });

        try {
          const response = await apiClient.get("/api/dashboard/stats");

          set({
            dashboardData: response.data,
            dashboardLoading: false,
          });

          cacheTimestamps.dashboard = now;
        } catch (error) {
          console.error("❌ Dashboard fetch error:", error);
          set({
            dashboardError:
              error instanceof Error ? error.message : "Failed to fetch dashboard data",
            dashboardLoading: false,
          });
        }
      },

      // Posts actions
      fetchPosts: async () => {
        const now = Date.now();
        const lastFetch = cacheTimestamps.posts;

        // Skip if recently fetched
        if (now - lastFetch < CACHE_DURATION && get().posts.length > 0) {
          return;
        }

        set({ postsLoading: true, postsError: null });

        try {
          const response = await apiClient.get("/api/posts");

          set({
            posts: response.data,
            postsLoading: false,
          });

          cacheTimestamps.posts = now;
        } catch (error) {
          console.error("❌ Posts fetch error:", error);
          set({
            postsError: error instanceof Error ? error.message : "Failed to fetch posts",
            postsLoading: false,
          });
        }
      },

      // Projects actions
      fetchProjects: async () => {
        const now = Date.now();
        const lastFetch = cacheTimestamps.projects;

        // Skip if recently fetched
        if (now - lastFetch < CACHE_DURATION && get().projects.length > 0) {
          return;
        }

        set({ projectsLoading: true, projectsError: null });

        try {
          const response = await apiClient.get("/api/projects");

          set({
            projects: response.data,
            projectsLoading: false,
          });

          cacheTimestamps.projects = now;
        } catch (error) {
          console.error("❌ Projects fetch error:", error);
          set({
            projectsError: error instanceof Error ? error.message : "Failed to fetch projects",
            projectsLoading: false,
          });
        }
      },

      // Contacts actions
      fetchContacts: async () => {
        const now = Date.now();
        const lastFetch = cacheTimestamps.contacts;

        // Skip if recently fetched
        if (now - lastFetch < CACHE_DURATION && get().contacts.length > 0) {
          return;
        }

        set({ contactsLoading: true, contactsError: null });

        try {
          const response = await apiClient.get("/api/contacts");

          set({
            contacts: response.data,
            contactsLoading: false,
          });

          cacheTimestamps.contacts = now;
        } catch (error) {
          console.error("❌ Contacts fetch error:", error);
          set({
            contactsError: error instanceof Error ? error.message : "Failed to fetch contacts",
            contactsLoading: false,
          });
        }
      },

      // Reset functions
      resetDashboard: () => {
        set({ dashboardData: null, dashboardError: null, dashboardLoading: false });
        cacheTimestamps.dashboard = 0;
      },

      resetPosts: () => {
        set({ posts: [], postsError: null, postsLoading: false });
        cacheTimestamps.posts = 0;
      },

      resetProjects: () => {
        set({ projects: [], projectsError: null, projectsLoading: false });
        cacheTimestamps.projects = 0;
      },

      resetContacts: () => {
        set({ contacts: [], contactsError: null, contactsLoading: false });
        cacheTimestamps.contacts = 0;
      },

      // Cache invalidation functions
      invalidatePostsCache: () => {
        cacheTimestamps.posts = 0;
      },

      invalidateAllCache: () => {
        cacheTimestamps.dashboard = 0;
        cacheTimestamps.posts = 0;
        cacheTimestamps.projects = 0;
        cacheTimestamps.contacts = 0;
      },
    }),
    {
      name: "admin-store", // DevTools name
    }
  )
);

export default useAdminStore;
