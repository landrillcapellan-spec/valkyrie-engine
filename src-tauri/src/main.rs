use std::path::{Path, PathBuf};
use std::sync::Mutex;
use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use tauri::{State, Manager};
use rusqlite::{Connection, params};
use uuid::Uuid;
use chrono::Utc;

// ============================================================================
// MODEL ADAPTER INTERFACE (Phase 1)
// ============================================================================

/// Every model adapter implements this trait.

#[tauri::command]
fn model_adapter_list() -> Vec<ModelAdapterInfo> {
    ModelRegistry::list()
}

/// Describes a model adapter's capabilities and requirements.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelAdapterInfo {
    pub id: String,
    pub name: String,
    pub version: String,
    pub department: String,
    pub capabilities: Vec<String>,
    pub input_requirements: Vec<String>,
    pub output_format: String,
    pub hardware_requirements: HardwareRequirements,
    pub dependencies: Vec<String>,
    pub license: String,
    pub status: ModelStatus,
}

/// Hardware requirements reported by a model adapter.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HardwareRequirements {
    pub min_vram_mb: u64,
    pub recommended_vram_mb: u64,
    pub min_ram_mb: u64,
    pub requires_gpu: bool,
    pub supports_cpu_fallback: bool,
}

/// Current status of a model.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ModelStatus {
    NotInstalled,
    Installing,
    Installed,
    Updating,
    Removing,
    Error,
    Incompatible,
}

/// Result of a model operation.
#[derive(Debug, Serialize, Deserialize)]
pub struct ModelOperationResult {
    pub success: bool,
    pub model_id: String,
    pub message: String,
    pub details: Option<String>,
}

/// Registry of available model adapters.
#[derive(Default)]
pub struct ModelRegistry {
    adapters: Mutex<HashMap<String, Box<dyn ModelAdapter + Send + Sync>>>,
}

impl ModelRegistry {
    pub fn list() -> Vec<ModelAdapterInfo> {
        // Phase 1: returns the known model adapter definitions.
        // Actual adapter instances are registered as integrations are implemented.
        vec![
            ModelAdapterInfo {
                id: "wan-2.2".to_string(),
                name: "Wan 2.2".to_string(),
                version: "2.2".to_string(),
                department: "video_generation".to_string(),
                capabilities: vec!["text_to_video".into(), "image_to_video".into()],
                input_requirements: vec!["text_prompt".into(), "optional_image".into()],
                output_format: "video/mp4".into(),
                hardware_requirements: HardwareRequirements {
                    min_vram_mb: 8192,
                    recommended_vram_mb: 12288,
                    min_ram_mb: 16384,
                    requires_gpu: true,
                    supports_cpu_fallback: false,
                },
                dependencies: vec!["torch".into(), "diffusers".into()],
                license: "Apache-2.0 (Wan models)".into(),
                status: ModelStatus::NotInstalled,
            },
            ModelAdapterInfo {
                id: "ltx-video".to_string(),
                name: "LTX-Video".to_string(),
                version: "1.0".to_string(),
                department: "video_generation".to_string(),
                capabilities: vec!["text_to_video".into(), "image_to_video".into()],
                input_requirements: vec!["text_prompt".into(), "optional_image".into()],
                output_format: "video/mp4".into(),
                hardware_requirements: HardwareRequirements {
                    min_vram_mb: 6144,
                    recommended_vram_mb: 8192,
                    min_ram_mb: 12288,
                    requires_gpu: true,
                    supports_cpu_fallback: false,
                },
                dependencies: vec!["torch".into(), "diffusers".into()],
                license: "Apache-2.0".into(),
                status: ModelStatus::NotInstalled,
            },
            ModelAdapterInfo {
                id: "realvisxl".to_string(),
                name: "RealVisXL".to_string(),
                version: "1.0".to_string(),
                department: "image_generation".to_string(),
                capabilities: vec!["text_to_image".into()],
                input_requirements: vec!["text_prompt".into()],
                output_format: "image/png".into(),
                hardware_requirements: HardwareRequirements {
                    min_vram_mb: 6144,
                    recommended_vram_mb: 8192,
                    min_ram_mb: 12288,
                    requires_gpu: true,
                    supports_cpu_fallback: true,
                },
                dependencies: vec!["torch".into(), "diffusers".into()],
                license: "RealVisXL License".into(),
                status: ModelStatus::NotInstalled,
            },
        ]
    }

    pub fn install(&self, _model_id: &str) -> ModelOperationResult {
        ModelOperationResult {
            success: false,
            model_id: _model_id.to_string(),
            message: "Model installation not yet implemented (Phase 3)".to_string(),
            details: Some("Requires Python backend service and model downloader".into()),
        }
    }
}


#[tauri::command]
fn model_install(model_id: String) -> ModelOperationResult {
    ModelRegistry::default().install(&model_id)
}


#[tauri::command]
fn model_info() -> Vec<ModelAdapterInfo> {
    ModelRegistry::list()
}

/// Trait every model adapter must implement.
pub trait ModelAdapter {
    fn info(&self) -> ModelAdapterInfo;
    fn load(&self) -> Result<(), String>;
    fn unload(&self) -> Result<(), String>;
    fn is_loaded(&self) -> bool;
}

// ============================================================================
// HARDWARE DETECTION (Phase 1)
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HardwareProfile {
    pub gpu: Option<GpuInfo>,
    pub vram_mb: u64,
    pub ram_mb: u64,
    pub cpu_cores: u32,
    pub storage_free_mb: u64,
    pub storage_total_mb: u64,
    pub os: OsInfo,
    pub recommended_preset: Preset,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GpuInfo {
    pub name: String,
    pub vendor: String,
    pub vram_mb: u64,
    pub driver_version: Option<String>,
    pub cuda_available: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OsInfo {
    pub platform: String,
    pub version: String,
    pub architecture: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Preset {
    Low,
    Medium,
    High,
    Ultra,
}


#[tauri::command]
fn hardware_detect() -> HardwareProfile {
    let gpu = detect_gpu();
    let vram_mb = gpu.as_ref().map(|g| g.vram_mb).unwrap_or(0);
    let ram_mb = detect_ram();
    let cpu_cores = std::thread::available_parallelism().map(|n| n.get()).unwrap_or(1) as u32;
    let storage = detect_storage();
    let os = detect_os();
    let preset = recommend_preset(vram_mb, ram_mb);

    HardwareProfile {
        gpu,
        vram_mb,
        ram_mb,
        cpu_cores,
        storage_free_mb: storage.0,
        storage_total_mb: storage.1,
        os,
        recommended_preset: preset,
    }
}

fn detect_gpu() -> Option<GpuInfo> {
    // Phase 1: best-effort GPU detection.
    // On Linux without nvidia-smi, we report unknown until the Python backend
    // provides hardware telemetry.
    let output = std::process::Command::new("nvidia-smi")
        .args(["--query-gpu=name,driver_version,memory.total", "--format=csv,noheader,nounits"])
        .output();

    if let Ok(out) = output {
        if out.status.success() {
            let text = String::from_utf8_lossy(&out.stdout);
            let line = text.lines().next().unwrap_or("");
            let parts: Vec<&str> = line.split(',').map(|s| s.trim()).collect();
            if parts.len() >= 3 {
                return Some(GpuInfo {
                    name: parts[0].to_string(),
                    vendor: "NVIDIA".to_string(),
                    vram_mb: parts[2].parse().unwrap_or(0),
                    driver_version: Some(parts[1].to_string()),
                    cuda_available: true,
                });
            }
        }
    }

    None
}

fn detect_ram() -> u64 {
    // Read /proc/meminfo for total memory in MB.
    if let Ok(contents) = std::fs::read_to_string("/proc/meminfo") {
        for line in contents.lines() {
            if line.starts_with("MemTotal:") {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() >= 2 {
                    // /proc/meminfo reports kB
                    let kb: u64 = parts[1].parse().unwrap_or(0);
                    return kb / 1024;
                }
            }
        }
    }
    0
}

fn detect_storage() -> (u64, u64) {
    // Best-effort: report root filesystem stats.
    if let Ok(metadata) = std::fs::metadata("/") {
        // Simplified: we cannot get free space portably without a crate;
        // report 0 until proper implementation.
        let _ = metadata;
    }
    (0, 0)
}

fn detect_os() -> OsInfo {
    OsInfo {
        platform: std::env::consts::OS.to_string(),
        version: std::env::consts::ARCH.to_string(),
        architecture: std::env::consts::ARCH.to_string(),
    }
}

fn recommend_preset(vram_mb: u64, _ram_mb: u64) -> Preset {
    match vram_mb {
        v if v >= 16384 => Preset::Ultra,
        v if v >= 12288 => Preset::High,
        v if v >= 8192 => Preset::Medium,
        _ => Preset::Low,
    }
}

// ============================================================================
// PROJECT DATABASE (SQLite) (Phase 1)
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub mode: String,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
    pub path: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateProjectRequest {
    pub name: String,
    pub description: Option<String>,
    pub mode: Option<String>,
}

pub struct DbState(pub Mutex<Option<PathBuf>>);


#[tauri::command]
fn project_create(state: State<'_, DbState>, req: CreateProjectRequest) -> Result<Project, String> {
    let db_path = state.0.lock().unwrap().clone().unwrap_or_else(|| default_db_path());
    ensure_schema(&db_path)?;

    let id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();
    let mode = req.mode.unwrap_or_else(|| "chat".to_string());
    let project_dir = format!("projects/{}", id);

    let conn = Connection::open(&db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO projects (id, name, description, mode, status, created_at, updated_at, path)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![id, req.name, req.description, mode, "created", now, now, project_dir],
    ).map_err(|e| e.to_string())?;

    // Create project directory on disk
    let _ = std::fs::create_dir_all(&project_dir);

    Ok(Project {
        id,
        name: req.name,
        description: req.description,
        mode,
        status: "created".to_string(),
        created_at: now.clone(),
        updated_at: now.clone(),
        path: Some(project_dir),
    })
}


#[tauri::command]
fn project_list(state: State<'_, DbState>) -> Result<Vec<Project>, String> {
    let db_path = state.0.lock().unwrap().clone().unwrap_or_else(|| default_db_path());
    ensure_schema(&db_path)?;
    let conn = Connection::open(&db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT id, name, description, mode, status, created_at, updated_at, path FROM projects ORDER BY created_at DESC"
    ).map_err(|e| e.to_string())?;
    let rows = stmt.query_map([], |row| {
        Ok(Project {
            id: row.get(0)?,
            name: row.get(1)?,
            description: row.get(2)?,
            mode: row.get(3)?,
            status: row.get(4)?,
            created_at: row.get(5)?,
            updated_at: row.get(6)?,
            path: row.get(7)?,
        })
    }).map_err(|e| e.to_string())?;
    let mut out = Vec::new();
    for r in rows { out.push(r.map_err(|e| e.to_string())?); }
    Ok(out)
}


#[tauri::command]
fn project_get(state: State<'_, DbState>, id: String) -> Result<Option<Project>, String> {
    let db_path = state.0.lock().unwrap().clone().unwrap_or_else(|| default_db_path());
    ensure_schema(&db_path)?;
    let conn = Connection::open(&db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT id, name, description, mode, status, created_at, updated_at, path FROM projects WHERE id = ?1"
    ).map_err(|e| e.to_string())?;
    let mut rows = stmt.query_map(params![id], |row| {
        Ok(Project {
            id: row.get(0)?,
            name: row.get(1)?,
            description: row.get(2)?,
            mode: row.get(3)?,
            status: row.get(4)?,
            created_at: row.get(5)?,
            updated_at: row.get(6)?,
            path: row.get(7)?,
        })
    }).map_err(|e| e.to_string())?;
    let r = rows.next().transpose().map_err(|e| e.to_string())?;
    Ok(r)
}

fn default_db_path() -> PathBuf {
    dirs_next::data_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("AI Hollywood Studio")
        .join("database.sqlite")
}

fn ensure_schema(path: &Path) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let conn = Connection::open(path).map_err(|e| e.to_string())?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            mode TEXT NOT NULL DEFAULT 'chat',
            status TEXT NOT NULL DEFAULT 'created',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            path TEXT
        )",
        [],
    ).map_err(|e| e.to_string())?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS production_bibles (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(project_id) REFERENCES projects(id)
        )",
        [],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

// ============================================================================
// APP SETUP
// ============================================================================


#[tauri::command]
fn app_info() -> serde_json::Value {
    serde_json::json!({
        "name": "AI Hollywood Studio",
        "version": "0.1.0",
        "phase": 1,
        "status": "foundation",
        "python_backend": "planned - phase 2",
        "models": ["wan-2.2", "ltx-video", "realvisxl"]
    })
}

fn run() {
    tauri::Builder::default()
        .manage(DbState(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![
            model_adapter_list,
            model_info,
            model_install,
            hardware_detect,
            project_create,
            project_list,
            project_get,
            app_info,
        ])
        .setup(|app| {
            let handle = app.handle();
            // Initialize default db path
            let db_path = default_db_path();
            let state: State<'_, DbState> = handle.state();
            *state.0.lock().unwrap() = Some(db_path.clone());
            let _ = ensure_schema(&db_path);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    run();
}
