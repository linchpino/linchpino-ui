interface CrudSkeletonProps {
    rows?: number;
}

const CrudSkeleton: React.FC<CrudSkeletonProps> = ({ rows = 5 }) => {
    return (
        <div className="animate-pulse">
            <div className="grid grid-cols-4 gap-4 mb-2">
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 mb-4">
                    <div className="h-4 w-full bg-gray-300 rounded"></div>
                    <div className="h-4 w-full bg-gray-300 rounded"></div>
                    <div className="h-4 w-full bg-gray-300 rounded"></div>
                    <div className="h-4 w-full bg-gray-300 rounded"></div>
                </div>
            ))}
        </div>
    );
};

export default CrudSkeleton;
