// pages/Dashboard.tsx

import { useEffect, useState } from "react";
import { IoMdSpeedometer } from "react-icons/io";
import StateBox from "../components/Chart/StateBox";
import { ImageSelectorHeader } from "../components/ImageSelectorHeader";
import { useDataContext } from "../contexts/DataContext";
import MainLayout from "../layouts/MainLayout";

export default function Dashboard() {
    const { images, fetchImages, vref, setVref, loading } = useDataContext();
    const [selectedImage, setSelectedImage] = useState<"img1" | "img2" | "img3" | null>(null);

    const handleImageSelection = (key: "img1" | "img2" | "img3") => {
        setSelectedImage(key);
    };

    const handleButtonClick = () => {
        console.log(vref); // vref já vem do contexto
        fetchImages();

        const percent = calculatePercent(vref);
        console.log("Porcentagem:", percent);
    };

    useEffect(() => {
        if (images.img1 && !selectedImage) {
            setSelectedImage("img1");
        }
    }, [images, selectedImage]);

    const calculatePercent = (value: number) => {
        const max = 4000;
        return value / max;
    };

    return (
        <MainLayout activePage="Dashboard">
            <h1 className="text-4xl text-black font-semibold">Dashboard</h1>
            <input
                type="text"
                className="text-black border"
                value={vref}
                onChange={(e) => setVref(parseFloat(e.target.value) || 0)}
            />
            <button onClick={handleButtonClick} className="bg-blue-500 p-2 rounded mt-4" disabled={loading}>
                {loading ? "Carregando..." : "Gerar Gráfico"}
            </button>
            {images.img1 && (
                <>
                    <ImageSelectorHeader
                        selectedImageKey={selectedImage || "img1"}
                        onSelectImage={handleImageSelection}
                    />
                    <div className="flex justify-between mt-7">
                        <div className="rounded-lg border p-2 bg-white shadow-xl">
                            {selectedImage && (
                                <img width={700} src={images[selectedImage]} alt="Gráfico selecionado" />
                            )}
                        </div>
                        <div className="grid-cols-2 grid gap-10 grid-rows-2 max-h-[40vh]">
                            <StateBox title="4000" progress={0.20} subtitle="RPM" increase="85%" icon={<IoMdSpeedometer color="black" size={24} />} />
                            <StateBox title="255" progress={0.20} subtitle="PWM" increase="85%" icon={<IoMdSpeedometer color="black" size={24} />} />
                            <StateBox title="325" progress={0.20} subtitle="AD" increase="90%" icon={<IoMdSpeedometer color="black" size={24} />} />
                            <StateBox title="Anti horário" progress={0.80} subtitle="Direção" progressCircle={false} icon={<IoMdSpeedometer color="black" size={24} />} />
                        </div>
                    </div>
                </>
            )}
        </MainLayout>
    );
}
