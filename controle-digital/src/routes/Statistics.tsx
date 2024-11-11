import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";

export default function Statistics() {
    const data = [
        {'PWM': 239, 'RPM': 4089, 'Erro': 158, 'AD': 306, 'Tempo': 0.0},
        {'PWM': 205, 'RPM': 4445, 'Erro': 170, 'AD': 306, 'Tempo': 0.05},
        {'PWM': 212, 'RPM': 4343, 'Erro': 102, 'AD': 363, 'Tempo': 0.1},
        {'PWM': 206, 'RPM': 3169, 'Erro': 132, 'AD': 359, 'Tempo': 0.15},
        {'PWM': 234, 'RPM': 3408, 'Erro': 10, 'AD': 317, 'Tempo': 0.2},
        {'PWM': 226, 'RPM': 4352, 'Erro': 36, 'AD': 379, 'Tempo': 0.25},
        {'PWM': 203, 'RPM': 4491, 'Erro': 142, 'AD': 393, 'Tempo': 0.3},
        {'PWM': 242, 'RPM': 4397, 'Erro': 189, 'AD': 376, 'Tempo': 0.35},
        {'PWM': 249, 'RPM': 3574, 'Erro': 18, 'AD': 400, 'Tempo': 0.4},
        {'PWM': 206, 'RPM': 3120, 'Erro': 31, 'AD': 342, 'Tempo': 0.45},
        {'PWM': 246, 'RPM': 3795, 'Erro': 103, 'AD': 357, 'Tempo': 0.5},
        {'PWM': 233, 'RPM': 3476, 'Erro': 134, 'AD': 386, 'Tempo': 0.55},
        {'PWM': 226, 'RPM': 3558, 'Erro': 194, 'AD': 315, 'Tempo': 0.6},
        {'PWM': 235, 'RPM': 3016, 'Erro': 49, 'AD': 391, 'Tempo': 0.65},
        {'PWM': 232, 'RPM': 4025, 'Erro': 163, 'AD': 352, 'Tempo': 0.7},
        {'PWM': 230, 'RPM': 3755, 'Erro': 188, 'AD': 387, 'Tempo': 0.75},
        {'PWM': 230, 'RPM': 3927, 'Erro': 17, 'AD': 306, 'Tempo': 0.8},
        {'PWM': 222, 'RPM': 3223, 'Erro': 52, 'AD': 345, 'Tempo': 0.85},
        {'PWM': 215, 'RPM': 4141, 'Erro': 19, 'AD': 357, 'Tempo': 0.9},
        {'PWM': 236, 'RPM': 3904, 'Erro': 57, 'AD': 399, 'Tempo': 0.95},
        {'PWM': 201, 'RPM': 3873, 'Erro': 143, 'AD': 310, 'Tempo': 1.0},
        {'PWM': 228, 'RPM': 3660, 'Erro': 20, 'AD': 355, 'Tempo': 1.05},
        {'PWM': 234, 'RPM': 4177, 'Erro': 155, 'AD': 351, 'Tempo': 1.1},
        {'PWM': 226, 'RPM': 4162, 'Erro': 143, 'AD': 301, 'Tempo': 1.15},
        {'PWM': 211, 'RPM': 4240, 'Erro': 34, 'AD': 386, 'Tempo': 1.2},
        {'PWM': 209, 'RPM': 3259, 'Erro': 44, 'AD': 377, 'Tempo': 1.25},
        {'PWM': 226, 'RPM': 4217, 'Erro': 62, 'AD': 325, 'Tempo': 1.3},
        {'PWM': 211, 'RPM': 3659, 'Erro': 133, 'AD': 396, 'Tempo': 1.35},
        {'PWM': 249, 'RPM': 3323, 'Erro': 195, 'AD': 331, 'Tempo': 1.4},
        {'PWM': 207, 'RPM': 4269, 'Erro': 150, 'AD': 317, 'Tempo': 1.45}
    ]
    const itemsPerPage = 14; // Define quantos itens mostrar por página
    const [currentPage, setCurrentPage] = useState(0);

    // Calcula o número total de páginas
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Define o início e o fim dos itens da página atual
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
    };

    return (
        <MainLayout activePage="Statistics">
            <div className="text-3xl p-2">Statistics</div>
            <div className="overflow-x-auto font-semibold">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            {Object.keys(data[0]).map((key) => (
                                <th
                                    key={key}
                                    className="px-4 py-2 bg-[#24475f] border-b border-gray-300 text-[#8fb7d4] font-semibold text-left"
                                >
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                {Object.values(row).map((value, i) => (
                                    <td
                                        key={i}
                                        className="px-4 py-2 border-b border-gray-300 text-gray-700"
                                    >
                                        {value}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-end gap-5 bg-[#24475f] py-3 pr-5 items-center">
                    <span>Página {currentPage + 1} de {totalPages}</span>
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 0}
                        className="disabled:opacity-50 "
                    >
                        <FaAngleLeft size={20}/>
                    </button>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages - 1}
                        className="disabled:opacity-50"
                    >
                       <FaAngleRight size={20}/>
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}
