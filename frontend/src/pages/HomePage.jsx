import Navbar from "../components/Navbar";
import { ArrowRight, Users, MessageSquare, Calendar } from "lucide-react";
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-900 via-gray-50 to-gray-100 text-gray-900">


      {/* Hero Section */}
      <section className="text-center py-24 px-5 md:px-20">
        <h1 className="text-5xl md:text-6xl text-indigo-400 font-extrabold mb-6">
          Collaborate. Organize.{" "}
          <span className="text-indigo-600">Succeed.</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Empower your teams with seamless communication, task tracking, and
          real-time updates — all in one place.
        </p>
        <div className="flex justify-center gap-5">
        <Link to="/signup" className="border border-gray-300 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-amber-50 font-extralight">Create Account</Link>
        <Link to="/login" className="border border-gray-300 px-6 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-indigo-500 font-bold">Already a User!</Link>

        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-10">
        <h2 className="text-4xl font-bold text-center mb-12 text-indigo-300">
          Built for Modern Teams
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
          {[
            {
              icon: <Users className="text-indigo-600 w-10 h-10 mb-4 mx-auto" />,
              title: "Real-Time Collaboration",
              text: "Work together live — chat, edit, and plan with your team in one place."
            },
            {
              icon: <MessageSquare className="text-indigo-600 w-10 h-10 mb-4 mx-auto" />,
              title: "Smart Communication",
              text: "Keep everyone on the same page with instant messages and project threads."
            },
            {
              icon: <Calendar className="text-indigo-600 w-10 h-10 mb-4 mx-auto" />,
              title: "Task Scheduling",
              text: "Plan deadlines, assign roles, and never miss an important update again."
            }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl p-8 text-center shadow hover:shadow-lg transition"
            >
              {item.icon}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-24 bg-indigo-600 text-white">
        <h2 className="text-4xl font-bold mb-6">Start Collaborating Smarter</h2>
        <p className="mb-8 text-lg">
          Join thousands of teams using Collabify to streamline their work and
          achieve more together.
        </p>
        <button className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100">
          Get Started Now
        </button>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-900 text-gray-400 text-center">
        <div className="text-lg text-white font-bold mb-2">Collabify</div>
        <p>© {new Date().getFullYear()} Collabify Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
