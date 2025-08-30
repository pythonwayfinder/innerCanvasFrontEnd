import React from 'react';

const moods = [
    { mood: 'happy', color: 'bg-yellow-200' },
    { mood: 'sad', color: 'bg-blue-200' },
    { mood: 'angry', color: 'bg-red-200' },
    { mood: 'neutral', color: 'bg-gray-200' }
];

const MoodLegend: React.FC = () => {
    return (
        <div className="flex justify-center space-x-8 mt-8 text-sm select-none">
            {moods.map(({ mood, color }) => (
                <div key={mood} className="flex items-center space-x-2">
                    <span className={`w-6 h-6 rounded-full ${color} border border-gray-400`} />
                    <span className="capitalize text-[#3b3b58] font-medium">{mood}</span>
                </div>
            ))}
        </div>
    );
};

export default MoodLegend;