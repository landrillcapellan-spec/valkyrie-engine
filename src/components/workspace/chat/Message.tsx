export interface MessageProps {
  role: "user" | "assistant";
  content: string;
}

export function Message({ message }: { message: MessageProps }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-brand-600 text-white rounded-tr-none"
            : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
