export interface ProjectCardProps {
  project: { id: string; name: string; status: string; mode: string };
  active: boolean;
  onSelect: () => void;
}

export function ProjectCard({ project, active, onSelect }: ProjectCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
        active
          ? "bg-brand-600/20 border border-brand-500 text-white"
          : "text-slate-300 hover:bg-slate-800"
      }`}
    >
      <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
      <div className="flex-1 truncate">{project.name}</div>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">
        {project.mode}
      </span>
    </button>
  );
}
