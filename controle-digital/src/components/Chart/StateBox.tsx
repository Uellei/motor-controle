import React from 'react';
import ProgressCircle from './ProgressCircle';

interface StatBoxProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    progress: number;
    increase?: string;
    progressCircle?: boolean;
}

const StatBox: React.FC<StatBoxProps> = ({ title, subtitle, icon, progress, increase, progressCircle = true }) => {
    return (
        <div className="bg-white text-black p-4 rounded-lg shadow-xl w-72">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <div className="p-2 rounded-full self-start">
                        {icon}
                    </div>
                    <div className="ml-3">
                        <div className="text-xl font-semibold">{title}</div>
                        <div className="text-gray-500 font-medium">{subtitle}</div>
                    </div>
                </div>
                <div className='flex flex-col items-center'>
                    {progressCircle && <ProgressCircle progress={progress} size={60} />}
                    <div className="flex mt-4">
                        <div className="text-xl font-semibold text-blue-600">{increase}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatBox;
