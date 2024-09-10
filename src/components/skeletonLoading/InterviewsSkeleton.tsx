import React from 'react';

const InterviewsSkeleton = () => {
    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({length: 6}).map((_, index) => (
                <div key={index} className="animate-pulse h-32 bg-gray-200 rounded-lg p-4"/>
            ))}
        </div>
    );
};

export default InterviewsSkeleton;
