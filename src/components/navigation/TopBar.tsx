import { useAppStore } from "@/store/useAppStore";
import { Menu, Sun } from "lucide-react";

export function TopBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { setViewMode, viewMode } = useAppStore();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-semibold text-lg tracking-tight">AI Hollywood Studio</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Production Ready
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 text-sm font-medium text-slate-300">
          {viewMode === "chat" ? (
            <button
              onClick={() => setViewMode("studio")}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Chat Mode
            </button>
          ) : (
            <button
              onClick={() => setViewMode("chat")}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Studio Mode
            </button>
          )}
          <span className="w-px h-4 bg-slate-600 mx-2" />
          <button className="text-slate-400 hover:text-white transition-colors" aria-label="Theme">
            <Sun className="w-5 h-5" />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors" aria-label="User profile">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold">U</div>
          </button>
        </div>
      </div>
    </header>
  );
}
