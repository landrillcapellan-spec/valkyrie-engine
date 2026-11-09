import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { LayoutDashboard, Play } from "lucide-react";

const DEPARTMENTS = [
  { id: "executive", name: "Executive Director", status: "idle" as const },
  { id: "screenwriting", name: "Screenwriting", status: "idle" as const },
  { id: "casting", name: "Casting & Performance", status: "idle" as const },
  { id: "cinematography", name: "Cinematography", status: "idle" as const },
  { id: "vfx", name: "Visual Effects", status: "idle" as const },
  { id: "action", name: "Action & Stunt", status: "idle" as const },
  { id: "tactical", name: "AI Tactical Director", status: "idle" as const },
  { id: "crowd", name: "Crowd Director", status: "idle" as const },
  { id: "physics", name: "Physics & Motion", status: "idle" as const },
  { id: "audio", name: "Sound & Music", status: "idle" as const },
  { id: "editing", name: "Editing", status: "idle" as const },
  { id: "qa", name: "Quality Assurance", status: "idle" as const },
  { id: "post", name: "Post-Production", status: "idle" as const },
];

export function StudioWorkspace() {
  const { hardware } = useAppStore();

  useEffect(() => {}, []);

  return (
    <div className="h-full flex flex-col bg-slate-950">
      <div className="border-b border-slate-800 p-4 bg-slate-900/50">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-brand-500" />
          Virtual Production Studio
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Switch between conversational and studio modes without interrupting production.
        </p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="border-b border-slate-800 p-3 flex justify-between items-center bg-slate-900/30">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Play className="w-4 h-4 text-emerald-500" />
            Production Active
          </div>
          <div className="text-xs text-slate-500">No active job</div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Production Crew</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DEPARTMENTS.map((dept) => (
                <div
                  key={dept.id}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-200">{dept.name}</div>
                    <div className="text-xs text-slate-500">Standing by</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-slate-500" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Hardware Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {hardware ? (
                <>
                  <StatCard label="GPU" value={hardware.gpu?.name ?? "Not detected"} />
                  <StatCard label="VRAM" value={`${hardware.vram_mb} MB`} />
                  <StatCard label="RAM" value={`${hardware.ram_mb} MB`} />
                  <StatCard label="Preset" value={hardware.recommended_preset} />
                </>
              ) : (
                <div className="col-span-4 p-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-400">
                  Hardware detection pending...
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm font-medium text-slate-200">{value}</div>
    </div>
  );
}
