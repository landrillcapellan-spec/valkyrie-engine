import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project, HardwareProfile, ViewMode, Department } from "@/types";

interface AppStore {
  // Projects
  projects: Project[];
  activeProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project | null) => void;
  addProject: (project: Project) => void;

  // UI
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Hardware
  hardware: HardwareProfile | null;
  setHardware: (hw: HardwareProfile | null) => void;

  // Departments
  departments: Department[];
  setDepartmentStatus: (id: string, status: Department["status"]) => void;

  // Production bible
  productionBible: string | null;
  setProductionBible: (content: string | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      projects: [],
      activeProject: null,
      setProjects: (projects) => set({ projects }),
      setActiveProject: (project) => set({ activeProject: project }),
      addProject: (project) =>
        set((s) => ({ projects: [project, ...s.projects] })),

      viewMode: "chat",
      setViewMode: (mode) => set({ viewMode: mode }),
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      hardware: null,
      setHardware: (hw) => set({ hardware: hw }),

      departments: [],
      setDepartmentStatus: (id, status) =>
        set((s) => ({
          departments: s.departments.map((d) =>
            d.id === id ? { ...d, status } : d,
          ),
        })),

      productionBible: null,
      setProductionBible: (content) => set({ productionBible: content }),
    }),
    { name: "ai-hollywood-storage" },
  ),
);
