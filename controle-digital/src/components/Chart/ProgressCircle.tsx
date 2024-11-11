import React from 'react';

interface ProgressCircleProps {
    progress?: number;
    size?: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ progress = 0.75, size = 40 }) => {
    const angle = progress * 360;
    const circleStyle = {
        background: `radial-gradient(circle at center, #fff 55%, transparent 56%), 
        conic-gradient(transparent 0deg ${angle}deg, #8fb7d4 ${angle}deg 360deg), 
        #24475f`,
        borderRadius: '50%',
        width: `${size}px`,
        height: `${size}px`,
    };

    return <div style={circleStyle} className='self-end'/>;
};

export default ProgressCircle;
