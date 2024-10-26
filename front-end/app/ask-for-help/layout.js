// components/Layout.js
import Topbar from '@/components/Topbar/Topbar';
import React from 'react';

const Layout = ({ children }) => {
    return (
        <div>
            <Topbar />
            {children}
        </div>
    );
};

export default Layout;
