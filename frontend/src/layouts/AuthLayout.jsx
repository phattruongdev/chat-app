import { MessageCircle } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-panel lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <MessageCircle className="h-7 w-7 text-teal-300" />
          ProChat
        </div>
        <div className="max-w-lg">
          <h1 className="text-5xl font-semibold leading-tight">Realtime messaging for focused teams</h1>
          <p className="mt-5 text-base leading-7 text-gray-300">
            Private one-to-one chat, online presence, message history and a clean responsive interface.
          </p>
        </div>
        <p className="text-sm text-gray-400">Socket.IO + Express + MongoDB + React</p>
      </section>
      <section className="flex items-center justify-center px-5 py-10">
        <Outlet />
      </section>
    </main>
  );
}
