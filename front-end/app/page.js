// page.js
'use client'
import Hero from "@/components/Hero/Hero";
import Topbar from "@/components/Topbar/Topbar";
import Work from "@/components/HowItWork/work";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#162022]">
      <Topbar />
      <Hero />
      <Work />
    </div>
  );
}