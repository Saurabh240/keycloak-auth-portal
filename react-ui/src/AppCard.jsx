
export const AppCard = ({ index, app }) => {
    return (
        <a
            href={app.url}
            className="border border-black p-4 rounded-lg hover:bg-gray-100 transition"
        >
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 leading-tight mb-4">
                    {app.name}
                </h3>
                {app.roles?.includes('admin') && (
                    <button
                        onClick={(e) => {
                            e.preventDefault(); // Prevent navigation
                            e.stopPropagation();
                            // Handle edit action here
                            console.log('Edit app:', app.name);
                        }}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition flex-shrink-0"
                    >
                        Manage users
                    </button>
                )}
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
                {app.description}
            </p>
        </a>
    )
}
