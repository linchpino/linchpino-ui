import React from 'react';

const PasswordChangeSkeleton = () => {
    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md space-y-4">
            <div className="space-y-4">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
            <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    );
};

export default PasswordChangeSkeleton;
