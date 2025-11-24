import { Link } from "react-router-dom";
import { Users, MessageSquare, Calendar } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060815] via-[#0D1228] to-[#141A35] text-gray-100 relative">

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-28 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-24 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative text-center py-32 px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-200">
          Collaborate. Organize. Succeed.
        </h1>

        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12">
          Bring your team together with real time communication, organized tasks, and smart workflow planning.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition shadow-md shadow-indigo-700/30"
          >
            Create Account
          </Link>

          <Link
            to="/login"
            className="px-7 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur transition"
          >
            Already a User?
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-14 text-indigo-200">
          Built for modern teams
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
          {[
            {
              icon: <Users className="w-12 h-12 mx-auto text-indigo-400 mb-4" />,
              title: "Real time teamwork",
              text: "Instant updates and synced data on every device."
            },
            {
              icon: <MessageSquare className="w-12 h-12 mx-auto text-indigo-400 mb-4" />,
              title: "Clear communication",
              text: "Channels, threads and organized messaging."
            },
            {
              icon: <Calendar className="w-12 h-12 mx-auto text-indigo-400 mb-4" />,
              title: "Smart scheduling",
              text: "Plan ahead with structured timelines."
            }
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-xl shadow-lg hover:shadow-indigo-700/30 hover:bg-white/10 transition"
            >
              {f.icon}
              <h3 className="text-xl font-semibold text-indigo-200 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-300">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow section */}
      <section className="py-28 px-6 bg-gradient-to-b from-[#0B1023] to-[#0F1430]/20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-6 text-indigo-200">
            Everything your team needs in one place
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-14">
            From communication to task management, experience a smooth and unified workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {[
            { title: "Communication", text: "Manage chats, threads, and team interactions clearly." },
            { title: "Tasks", text: "Track tasks and assign responsibilities easily." },
            { title: "Projects", text: "Stay aligned with clear goals and timelines." },
            { title: "Scheduling", text: "Plan ahead with synced calendars and reminders." }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur shadow-md shadow-black/10 hover:bg-white/10 transition"
            >
              <h3 className="text-xl font-semibold text-indigo-200 mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA - FIXED COLOR TO MATCH THEME */}
      <section className="text-center py-24 bg-gradient-to-r from-[#1A1F45] to-[#242B60] text-white mt-20 rounded-t-3xl shadow-xl shadow-black/30 border-t border-white/10">
        <h2 className="text-4xl font-bold mb-4">Start working smarter</h2>
        <p className="text-lg mb-8 opacity-90">Join teams improving productivity every day.</p>

        <Link
          to="/signup"
          className="px-8 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition font-medium text-white shadow-md shadow-indigo-600/30"
        >
          Get started now
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-400">
        <div className="text-lg text-white font-semibold mb-1">Collabify</div>
        <p>© {new Date().getFullYear()} Collabify. All rights reserved.</p>
      </footer>

    </div>
  );
}
