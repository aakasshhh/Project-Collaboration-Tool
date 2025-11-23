import { Link } from "react-router-dom";
import { Users, MessageSquare, Calendar } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-gray-900 to-slate-900 text-gray-100">

      {/* Hero */}
      <section className="text-center py-28 px-5">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-indigo-300">
          Collaborate. Organize.  
          <span className="text-indigo-500"> Succeed.</span>
        </h1>

        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
          Bring your team together with real time communication, organized tasks,
          and effortless workflow tracking.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white"
          >
            Create Account
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur hover:bg-white/20 transition text-indigo-200"
          >
            Already a User?
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <h2 className="text-4xl font-semibold text-center mb-14 text-indigo-300">
          Built for modern teams
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
          {[
            {
              icon: <Users className="w-12 h-12 mx-auto text-indigo-400 mb-4" />,
              title: "Real time teamwork",
              text: "Work together naturally with instant updates across every device."
            },
            {
              icon: <MessageSquare className="w-12 h-12 mx-auto text-indigo-400 mb-4" />,
              title: "Clear communication",
              text: "Keep conversations structured with channels, threads and direct chat."
            },
            {
              icon: <Calendar className="w-12 h-12 mx-auto text-indigo-400 mb-4" />,
              title: "Smart scheduling",
              text: "Plan tasks, track deadlines and stay ahead with organized timelines."
            }
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition"
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

      {/* CTA */}
      <section className="text-center py-24 bg-linear-to-r from-indigo-700 to-indigo-500 rounded-t-3xl mt-10 text-white">
        <h2 className="text-4xl font-bold mb-4">Start collaborating smarter</h2>
        <p className="text-lg mb-8 opacity-90">
          Join teams everywhere who manage their work the simple way.
        </p>

        <Link
          to="/signup"
          className="px-8 py-3 rounded-xl bg-white text-indigo-600 hover:bg-gray-100 transition font-medium"
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
