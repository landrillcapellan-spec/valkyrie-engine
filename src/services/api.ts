import { invoke } from "@tauri-apps/api/core";
import type {
  AppInfo,
  HardwareProfile,
  ModelAdapterInfo,
  ModelOperationResult,
  Project,
  CreateProjectRequest,
} from "@/types";

export const api = {
  appInfo: () => invoke<AppInfo>("app_info"),
  hardwareDetect: () => invoke<HardwareProfile>("hardware_detect"),
  modelList: () => invoke<ModelAdapterInfo[]>("model_adapter_list"),
  modelInfo: () => invoke<ModelAdapterInfo[]>("model_info"),
  modelInstall: (modelId: string) =>
    invoke<ModelOperationResult>("model_install", { modelId }),
  projectCreate: (req: CreateProjectRequest) =>
    invoke<Project>("project_create", { req }),
  projectList: () => invoke<Project[]>("project_list"),
  projectGet: (id: string) => invoke<Project | null>("project_get", { id }),
};
