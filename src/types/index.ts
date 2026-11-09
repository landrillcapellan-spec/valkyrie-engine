export interface Project {
  id: string;
  name: string;
  description?: string | null;
  mode: string;
  status: string;
  created_at: string;
  updated_at: string;
  path?: string | null;
}

export interface HardwareProfile {
  gpu: GpuInfo | null;
  vram_mb: number;
  ram_mb: number;
  cpu_cores: number;
  storage_free_mb: number;
  storage_total_mb: number;
  os: OsInfo;
  recommended_preset: Preset;
}

export interface GpuInfo {
  name: string;
  vendor: string;
  vram_mb: number;
  driver_version?: string | null;
  cuda_available: boolean;
}

export interface OsInfo {
  platform: string;
  version: string;
  architecture: string;
}

export type Preset = "Low" | "Medium" | "High" | "Ultra";

export interface ModelAdapterInfo {
  id: string;
  name: string;
  version: string;
  department: string;
  capabilities: string[];
  input_requirements: string[];
  output_format: string;
  hardware_requirements: HardwareRequirements;
  dependencies: string[];
  license: string;
  status: ModelStatus;
}

export interface HardwareRequirements {
  min_vram_mb: number;
  recommended_vram_mb: number;
  min_ram_mb: number;
  requires_gpu: boolean;
  supports_cpu_fallback: boolean;
}

export type ModelStatus =
  | "NotInstalled"
  | "Installing"
  | "Installed"
  | "Updating"
  | "Removing"
  | "Error"
  | "Incompatible";

export interface AppInfo {
  name: string;
  version: string;
  phase: number;
  status: string;
  python_backend: string;
  models: string[];
}

export type ViewMode = "chat" | "studio";

export interface Department {
  id: string;
  name: string;
  status: "idle" | "active" | "completed" | "error";
  model?: string;
}

export interface ModelOperationResult {
  success: boolean;
  model_id: string;
  message: string;
  details: string | null;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  mode?: string;
}

export interface ProductionBible {
  id?: string;
  project_id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}
