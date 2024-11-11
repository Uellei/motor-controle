// SideBarContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

// Interface que define o tipo do contexto
interface SidebarContextProps {
    open: boolean;
    toggleOpen: () => void;
}

// Contexto inicial com valores padrão
export const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

// Hook personalizado para facilitar o uso do contexto
export function useSideBarContext() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSideBarContext deve ser usado dentro de um SideBarProvider");
    }
    return context;
}

// Provider que irá encapsular os componentes que usarem o contexto
export function SideBarProvider({ children }: { children: React.ReactNode }) {
    // Recupera o estado inicial de `open` do localStorage, com fallback para `true` caso não exista
    const [open, setOpen] = useState<boolean>(() => {
        const savedState = localStorage.getItem("sidebarOpen");
        return savedState !== null ? JSON.parse(savedState) : true;
    });

    // Atualiza o localStorage sempre que `open` muda
    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(open));
    }, [open]);

    const toggleOpen = () => setOpen((curr) => !curr);

    return (
        <SidebarContext.Provider value={{ open, toggleOpen }}>
            {children}
        </SidebarContext.Provider>
    );
}
