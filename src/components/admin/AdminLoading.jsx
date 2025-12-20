import React from 'react';
import LoadingScreen from '../LoadingScreen';

const AdminLoading = ({ message = 'Loading...' }) => {
    return <LoadingScreen message={message} />;
};

export default AdminLoading;
