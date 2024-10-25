'use client'
import Hero from "@/components/Hero/Hero";
import Topbar from "@/components/Topbar/Topbar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', href: '/' },
    { name: 'Investments', href: '/investments' },
    { name: 'Profile', href: '/profile' }
  ];

  return (
    <div className="w-full h-screen flex flex-col items-center bg-[#162022] ">
      {/* <nav className="flex w-full">
        <div className="flex items-center justify-center gap-12 border-b border-gray-200 w-full">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`
                  whitespace-nowrap inline-flex items-center px-1 py-3 mt-10 text-sm font-medium border-b-2 
                  ${isActive 
                    ? 'border-blue-500 border-b mr-2 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      </nav> */}
      <Topbar />
      <Hero />

    </div>
  );
}