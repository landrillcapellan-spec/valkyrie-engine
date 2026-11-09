export interface InputComposerProps {
  value: string;
  onChange: (v: string) => void;
  onSend: (e: React.FormEvent) => void;
  disabled: boolean;
}

export function InputComposer({
  value,
  onChange,
  onSend,
  disabled,
}: InputComposerProps) {
  return (
    <div className="border-t border-slate-800 bg-slate-900 p-4">
      <form onSubmit={onSend} className="flex gap-2">
        <button
          type="button"
          onClick={() => {}}
          className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
          aria-label="Attachments"
          title="Attachments (image, video, audio, document) — Phase 2"
        >
          <span className="sr-only">Attachments</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your film idea…"
          disabled={disabled}
          className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
        >
          Send
        </button>
      </form>
      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
        <span>Phase 1 foundation — AI director integration coming in Phase 2</span>
      </div>
    </div>
  );
}
