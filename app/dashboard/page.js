"use client";
import { useRouter } from "next/navigation";

const cards = [
  { title: "Candidates", icon: "👤", href: "/admin/candidates" },
  { title: "Buildings", icon: "🏢", href: "/admin/buildings" },
  { title: "Layouts", icon: "🗺️", href: "/admin/layouts" },
  { title: "Committee", icon: "👥", href: "/admin/committee" },
  { title: "Users", icon: "🧑", href: "/admin/users" },
];

export default function DashboardPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 flex flex-col items-center justify-center px-4 py-8">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-green-900 drop-shadow">
        Dashboard
      </h2>
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className="group bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center cursor-pointer border border-green-100 hover:border-green-400 hover:shadow-2xl transition-all duration-200 hover:-translate-y-1"
            onClick={() => router.push(card.href)}
          >
            <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">
              {card.icon}
            </div>
            <div className="text-xl md:text-2xl font-bold text-green-700 group-hover:text-green-900">
              {card.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
