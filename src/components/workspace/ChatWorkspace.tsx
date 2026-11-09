import { useEffect, useState, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { api } from "@/services/api";
import { Message } from "@/components/workspace/chat/Message";
import { InputComposer } from "@/components/workspace/chat/InputComposer";
import { Plus } from "lucide-react";
import { ProjectCard } from "@/components/workspace/chat/ProjectCard";

export function ChatWorkspace() {
  const { projects, setProjects, setActiveProject, activeProject } = useAppStore();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.projectList()
      .then(setProjects)
      .catch((err) => console.error("Failed to load projects", String(err)));
  }, [setProjects]);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const reply = aiResponse(userMsg);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } finally {
      setLoading(false);
    }
    scrollToBottom();
  };

  const aiResponse = (text: string): string => {
    // Simulated conversational director response until Python backend is integrated (Phase 2).
    return `I've received your direction: "${text}".\n\nThis is Phase 1 of AI Hollywood Studio. The conversational filmmaking director will be fully wired to the Python AI production backend in Phase 2. Right now you can create and manage projects using the "New Project" button, and the project list is persisted locally via SQLite.\n\nWhat would you like to make?`;
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try {
      const project = await api.projectCreate({
        name: newProjectName,
        mode: "chat",
      });
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Project "${project.name}" created and persisted locally.` },
      ]);
      setActiveProject(project);
      setProjects([project, ...projects]);
      setNewProjectName("");
      setShowNewProject(false);
      scrollToBottom();
    } catch (err) {
      alert(`Failed to create project: ${String(err)}`);
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-950">
      {/* Projects rail (left) */}
      <div className="w-80 border-r border-slate-800 bg-slate-900 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Projects</h2>
        </div>
        <div className="p-3 space-y-2">
          <button
            onClick={() => setShowNewProject(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brand-400 hover:bg-brand-500/10 rounded-lg border border-brand-500/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
          {projects.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-4">No projects yet</div>
          ) : (
            <div className="space-y-1">
              {projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  active={activeProject?.id === p.id}
                  onSelect={() => setActiveProject(p)}
                />
              ))}
            </div>
          )}
        </div>
        {showNewProject && (
          <div className="p-3 border-t border-slate-800 bg-slate-900/50">
            <form onSubmit={(e) => { void handleCreateProject(e); }} className="flex gap-2">
              <input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name"
                className="flex-1 px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 rounded text-xs font-medium text-white transition-colors"
              >
                Create
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Main conversation area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          {messages.length === 0 && (
            <div className="text-center text-slate-500 mt-20">
              <div className="text-2xl mb-2">🎬</div>
              <p className="text-lg">Welcome to AI Hollywood Studio</p>
              <p className="text-sm mt-2 max-w-xs mx-auto text-slate-400">
                Describe your film idea, upload a novel, or continue an existing video.
                The AI production crew is ready when you are.
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <Message key={i} message={m} />
          ))}
          {loading && (
            <div className="flex items-start gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs">
                AI
              </div>
              <div className="flex flex-col text-slate-400 text-sm">
                <div className="w-32 h-2 bg-slate-800 rounded mb-1.5" />
                <div className="w-24 h-2 bg-slate-800 rounded" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <InputComposer onSend={(e) => { void handleSend(e); }} value={input} onChange={setInput} disabled={loading} />
      </div>
    </div>
  );
}
