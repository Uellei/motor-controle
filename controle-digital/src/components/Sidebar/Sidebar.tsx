import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { useSideBarContext } from "../../contexts/SidebarContext";

export function SideBar({children}: {children: React.ReactNode}) {
    const {open, toggleOpen} = useSideBarContext()
    return (
        <aside className="h-screen">
            <nav className="h-full flex flex-col bg-white pt-6 relative">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <button onClick={toggleOpen} className={`p-2  ${open ? "bg-[#99bfdd]" : "bg-white"} rounded-full absolute right-[-16px]`}>
                        {open ? <FaAnglesLeft color="black"/> : <FaAnglesRight color="black"/>}
                    </button>
                </div>
                    <ul className="flex-1 px-3 mt-7">{children}</ul>
                <div>

                </div>
            </nav>
        </aside>
    )
}