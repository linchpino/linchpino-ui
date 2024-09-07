export default function ProfileSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                <div className="flex-1">
                    <div className="w-24 h-4 bg-gray-300 rounded"></div>
                    <div className="w-32 h-4 bg-gray-300 rounded mt-2"></div>
                </div>
            </div>

            <div className="mt-4">
                <div className="w-full h-6 bg-gray-300 rounded"></div>
                <div className="w-full h-6 bg-gray-300 rounded mt-2"></div>
                <div className="w-full h-6 bg-gray-300 rounded mt-2"></div>
            </div>
        </div>
    );
}
