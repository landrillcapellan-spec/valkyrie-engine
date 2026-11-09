import {
  Film,
  Users,
  MapPin,
  Video,
  Image,
  Settings,
  Plug,
  Shield,
  Play,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "new-project", label: "New Project", icon: Play },
  { id: "recent", label: "Recent Projects", icon: Film },
  { id: "films", label: "My Films", icon: Video },
  { id: "characters", label: "Character Library", icon: Users },
  { id: "locations", label: "Location Library", icon: MapPin },
  { id: "models", label: "Model Library", icon: Image },
  { id: "plugins", label: "Plugin Marketplace", icon: Plug },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ open, onToggle }: { open: boolean; onToggle: (v: boolean) => void }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:relative md:transform md:translate-x-0`}
    >
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-brand-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm">
            AI
          </div>
          <span className="font-bold text-lg tracking-tight">AI Hollywood</span>
        </div>
        <button
          onClick={() => onToggle(false)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
          aria-label="Close sidebar"
        >
          <span className="sr-only">Close</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav className="mt-6 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {}}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t border-slate-800">
        <button
          onClick={() => onToggle(false)}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white"
        >
          <Shield className="w-5 h-5" />
          Safety & Compliance
        </button>
      </div>
    </aside>
  );
}
