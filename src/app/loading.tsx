import React from "react";

const Loading: React.FC = () => (
    <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-0">
        <div className="relative z-50">
            <img src="/Logo.svg" alt="Loading..." className="w-20 h-20 animate-bounce" />
        </div>
    </div>
);

export default Loading;
