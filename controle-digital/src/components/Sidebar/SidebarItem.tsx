import { Link } from "react-router-dom";
import { useSideBarContext } from "../../contexts/SidebarContext";

interface SideBarItemProps {
    icon: React.ReactNode;
    text: string;
    active?: boolean;
}

export function SideBarItem({icon, text, active = false}: SideBarItemProps) {
    const { open } = useSideBarContext()
    return (
        <Link to={`/${text.toLocaleLowerCase()}`}>
        <li
          className={`
            relative flex items-center py-2 px-3 my-1
            font-medium rounded-md cursor-pointer
            transition-colors group text-xl
            ${
              active
                ? "bg-[#24475f] text-white"
                : "hover:bg-[#99bfdd] text-[#24475f]"
            }
        `}
        >
          {icon}
          <span
            className={`overflow-hidden transition-all ${
              open ? "w-36 ml-3" : "w-0"
            }`}
          >
            {text}
          </span>
    
          {!open && (
            <div
              className={`
              absolute left-full rounded-md px-2 py-1 ml-6
              bg-[#24475f] text-white text-sm
              invisible opacity-20 -translate-x-3 transition-all
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
            >
              {text}
            </div>
          )}
        </li>
    </Link>
      )
}