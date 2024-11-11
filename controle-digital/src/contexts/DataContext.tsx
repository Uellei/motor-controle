// Adicione o estado de loading no seu contexto

import { createContext, ReactNode, useContext, useState } from "react";

interface ImageContextType {
    images: { img1?: string; img2?: string; img3?: string };
    fetchImages: () => Promise<void>;
    data: { K: number; T: number; L: number; Kp: number; Ti: number };
    setData: React.Dispatch<React.SetStateAction<{ K: number; T: number; L: number; Kp: number; Ti: number }>>;
    resetData: () => void;
    vref: number;
    setVref: (vref: number) => void;
    loading: boolean;
}

const ImageContext = createContext<ImageContextType | null>(null);

interface DataProviderProps {
    children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
    const [images, setImages] = useState<{ img1?: string; img2?: string; img3?: string }>({});
    const [data, setData] = useState({ K: 1.875, T: 0.15, L: 0.03, Kp: 1.69, Ti: 0.15 });
    const [vref, setVref] = useState(0);
    const [loading, setLoading] = useState(false); // estado de loading

    const resetData = () => {
        setData({ K: 1.875, T: 0.15, L: 0.03, Kp: 1.69, Ti: 0.15 });
    };

    const fetchImages = async () => {
        setLoading(true); // inicia o loading
        const routes = [
            { url: "http://127.0.0.1:5000/pid/step_response", body: data },
            { url: "http://127.0.0.1:5000/motor/set_vref", body: { vref } },
            { url: "http://127.0.0.1:5000/pid/step_comparison", body: data }
        ];
        const images = await Promise.all(routes.map(async (route) => {
            const response = await fetch(route.url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(route.body)
            });
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        }));
        setImages({
            img1: images[0],
            img2: images[1],
            img3: images[2]
        });
        setLoading(false); // finaliza o loading
    };

    return (
        <ImageContext.Provider value={{ images, fetchImages, data, setData, resetData, vref, setVref, loading }}>
            {children}
        </ImageContext.Provider>
    );
};

export const useDataContext = () => {
    const context = useContext(ImageContext);
    if (!context) {
        throw new Error("useImageContext must be used within an ImageProvider");
    }
    return context;
};
