import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { ChatWorkspace } from "@/components/workspace/ChatWorkspace";
import { StudioWorkspace } from "@/components/workspace/StudioWorkspace";
import { useAppStore } from "@/store/useAppStore";

export default function App() {
  const { viewMode, sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar open={sidebarOpen} onToggle={setSidebarOpen} />
      <div className="flex-1 flex flex-col relative">
        <TopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="flex-1 overflow-hidden">
          {viewMode === "chat" ? <ChatWorkspace /> : <StudioWorkspace />}
        </div>
      </div>
    </div>
  );
}
