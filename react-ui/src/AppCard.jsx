
import { useNavigate } from 'react-router-dom';

const AppCard = ({ index, app }) => {
    const navigate = useNavigate();

    const handleManageUsers = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/admin/users/${app.clientId}`);
    };
    return (
        <a
            href={app.url}
            className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
        >
            {app.roles?.includes('admin') && (
                <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 leading-tight mb-4">
                        {app.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        {app.description}
                    </p>
                    <button
                        onClick={handleManageUsers}
                        className="w-full bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Manage users
                    </button>
                </div>
            )}
        </a>
    )
}

export default AppCard;