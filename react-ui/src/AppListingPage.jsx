import React, { useState, useEffect } from 'react';
import { useAuth } from '../../frontend/src/hooks/useAuth';
import { AppCard } from './AppCard';
import { Button } from './common/Button';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';

export const AppListingPage = () => {
    const { authState, logout } = useAuth();
    const navigate = useNavigate();
    const [apps, setApps] = useState([]);

    useEffect(() => {
        if (!authState.isAuthenticated) {
            navigate('/');
            return;
        }
        // Mock app data
        const allApps = [
            { name: 'Frappe ERP', url: 'https://erp.example.com', roles: ['user', 'admin'] },
            { name: 'Custom Web App', url: 'https://webapp.example.com', roles: ['user'] },
            { name: 'Admin Dashboard', url: 'https://admin.example.com', roles: ['admin'] },
        ];
        setApps(allApps.filter((app) => app.roles.some((role) => authState.roles.includes(role))));
    }, [authState, navigate]);

    const handleAppClick = (url) => {
        window.location.href = url;
    };

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Applications</h2>
                <Button variant="danger" onClick={logout}>
                    Logout
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.map((app, index) => (
                    <AppCard key={index} app={app} onClick={handleAppClick} />
                ))}
            </div>
            {authState.roles.includes('admin') && (
                <div className="mt-6">
                    <Button onClick={() => navigate('/admin')}>User Management</Button>
                </div>
            )}
        </div>
    );
};