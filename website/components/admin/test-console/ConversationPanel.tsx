"use client";

import type {
  ConversationMessage,
} from "./DeveloperConsole";

interface Props {
  messages: ConversationMessage[];
}

export default function ConversationPanel({
  messages,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h3 className="mb-4 text-lg font-semibold">
        Conversation
      </h3>

      {messages.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-slate-500">
          No conversation yet.
        </div>
      ) : (
        <div className="space-y-4">

          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-lg p-4 ${
                message.role === "user"
                  ? "bg-blue-50"
                  : "bg-green-50"
              }`}
            >
              <div className="mb-1 text-xs font-semibold uppercase">
                {message.role}
              </div>

              <div>
                {message.content}
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}