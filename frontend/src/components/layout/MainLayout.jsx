import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopNav setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
