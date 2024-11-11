import { useEffect, useRef } from "react";
import { useDataContext } from "../contexts/DataContext";
import MainLayout from "../layouts/MainLayout";

export default function About() {
    const { data, setData, resetData } = useDataContext();
    const { K, T, L, Kp, Ti } = data;

    const refs = {
        K: useRef<HTMLInputElement>(null),
        T: useRef<HTMLInputElement>(null),
        L: useRef<HTMLInputElement>(null),
        Kp: useRef<HTMLInputElement>(null),
        Ti: useRef<HTMLInputElement>(null)
    }

    const variables = [
        {
            title: "K",
            description: "Set a maximum traversal depth for incoming queries (0 = disabled).",
            key: "K" as const,
            defaultValue: K
        },
        {
            title: "Tau",
            description: "Set a maximum traversal depth for incoming queries (0 = disabled).",
            key: "T" as const,
            defaultValue: T
        },
        {
            title: "L",
            description: "Set a maximum traversal depth for incoming queries (0 = disabled).",
            key: "L" as const,
            defaultValue: L
        },
        {
            title: "Kp",
            description: "Set a maximum traversal depth for incoming queries (0 = disabled).",
            key: "Kp" as const,
            defaultValue: Kp
        },
        {
            title: "Ti",
            description: "Set a maximum traversal depth for incoming queries (0 = disabled).",
            key: "Ti" as const,
            defaultValue: Ti
        }
    ];

    const handleSave = () => {
        setData({
            K: parseFloat(refs.K.current?.value || "0"),
            T: parseFloat(refs.T.current?.value || "0"),
            L: parseFloat(refs.L.current?.value || "0"),
            Kp: parseFloat(refs.Kp.current?.value || "0"),
            Ti: parseFloat(refs.Ti.current?.value || "0")
        })
    };

    useEffect(() => {
        refs.K.current!.value = data.K.toString();
        refs.T.current!.value = data.T.toString();
        refs.L.current!.value = data.L.toString();
        refs.Kp.current!.value = data.Kp.toString();
        refs.Ti.current!.value = data.Ti.toString();
    }, [data])

    return (
        <MainLayout activePage="About">
            <h1 className="text-4xl text-black font-semibold">Sobre</h1>
            <h3 className="text-xl text-black mt-5 font-semibold">Variáveis</h3>
            <div className="bg-white max-w-[55vw] max-h-[95vh] shadow-xl rounded-xl p-6 mt-5 flex flex-col">
                <div className="flex flex-col text-black">
                    {variables.map((variable, index) => (
                        <div key={index} className="p-4 rounded-lg flex justify-between items-center">
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-semibold">{variable.title}</h2>
                                </div>
                                <p className="text-gray-600">{variable.description}</p>
                            </div>
                            <input
                                ref={refs[variable.key]} // Usa o ref correspondente
                                defaultValue={data[variable.key]}
                                className="border rounded-xl w-[4vw] flex text-center h-[5vh]"
                            />
                        </div>
                    ))}
                </div>
                <div className="self-end flex gap-5">
                    <button onClick={resetData} className="font-medium py-2 px-5 rounded-xl border text-[#24475f] border-[#24475f] hover:border-[#8fb7d4] hover:bg-[#8fb7d4] hover:text-white">Resetar</button>
                    <button onClick={handleSave} className="font-medium py-2 px-5 rounded-xl bg-[#24475f] hover:bg-[#8fb7d4] border border-[#8fb7d4]">Salvar</button>
                </div>
            </div>
        </MainLayout>
    );
}
