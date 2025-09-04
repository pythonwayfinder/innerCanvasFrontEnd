import React from 'react';

const moods = [
    { mood: '분노', color: 'bg-red-200' },
    { mood: '기쁨', color: 'bg-yellow-200' },
    { mood: '상처', color: 'bg-purple-200' },
    { mood: '불안', color: 'bg-blue-200' },
    { mood: '당황', color: 'bg-pink-200' },
    { mood: '슬픔', color: 'bg-gray-300' }
];

const MoodLegend: React.FC = () => {
    return (
        <div className="flex justify-center space-x-8 mt-8 text-sm select-none">
            {moods.map(({ mood, color }) => (
                <div key={mood} className="flex items-center space-x-2">
                    <span className={`w-6 h-6 rounded-full ${color} border border-gray-400`} />
                    <span className="text-[#3b3b58] font-medium">{mood}</span>
                </div>
            ))}
        </div>
    );
};

export default MoodLegend;