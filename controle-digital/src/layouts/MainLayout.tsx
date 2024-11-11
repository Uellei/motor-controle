// components/MainLayout.tsx
import { ReactNode } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BiMath } from "react-icons/bi";
import { FaRegChartBar } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { SideBar } from "../components/Sidebar/Sidebar";
import { SideBarItem } from "../components/Sidebar/SidebarItem";

interface MainLayoutProps {
    children: ReactNode;
    activePage: string;
}

export default function MainLayout({ children, activePage  }: MainLayoutProps) {
    return (
        <main className="w-screen h-screen text-white flex flex-col overflow">
            <header className="w-full h-14 bg-white flex items-center px-4">
                <span className="text-black font-bold text-2xl">TMNT</span>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <SideBar>
                <SideBarItem text="Dashboard" icon={<LuLayoutDashboard size={24} />} active={activePage === "Dashboard"} />
                    <SideBarItem text="Statistics" icon={<FaRegChartBar size={24} />} active={activePage === "Statistics"} />
                    <SideBarItem text="Mathematic" icon={<BiMath size={24} />} active={activePage === "Mathematic"} />
                    <SideBarItem text="About" icon={<AiOutlineInfoCircle size={24} />} active={activePage === "About"} />
                </SideBar>
                <div className="p-5 mr-3 mb-3 bg-[#99bfdd] flex-1 rounded-xl overflow-auto scrollbar-hide">
                    {children} {/* Aqui entra o conteúdo de cada página */}
                </div>
            </div>
        </main>
    );
}
