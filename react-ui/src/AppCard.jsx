import React from 'react';

export const AppCard = ({ app, onClick }) => (
    <div
        className="p-6 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
        onClick={() => onClick(app.url)}
    >
        <h3 className="text-lg font-semibold">{app.name}</h3>
        <p className="text-gray-500">Click to access</p>
    </div>
);