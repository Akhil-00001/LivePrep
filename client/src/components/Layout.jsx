import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import { FocusModeProvider } from './FocusMode';
import { useFocusModeState } from './focusModeContext';

// The element tree must stay identical in both modes: if focus mode swapped in a
// different wrapper, React would remount the page and reset its state (e.g. the
// interview would jump back to the setup step). Only the chrome is toggled.
const Shell = ({ children }) => {
  const focus = useFocusModeState();
  // Desktop-only: collapse the sidebar to an icon rail. Remembered per browser.
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('liveprep-sidebar-collapsed') === 'true'; } catch { return false; }
  });
  const toggleSidebar = () => {
    setCollapsed((c) => {
      try { localStorage.setItem('liveprep-sidebar-collapsed', String(!c)); } catch { /* storage unavailable */ }
      return !c;
    });
  };

  return (
    <div className={`min-h-screen bg-paper ${focus ? '' : 'pb-16 md:pb-0'}`}>
      {!focus && <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />}
      <div className={focus ? 'min-h-screen' : `flex min-h-screen flex-col transition-[margin] duration-200 ${collapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        {!focus && <Navbar />}
        <main className={focus ? '' : 'flex-1 px-4 py-8 sm:px-8 sm:py-10'}>
          <div className={focus ? '' : 'mx-auto w-full max-w-5xl'}>{children}</div>
        </main>
        {!focus && <Footer />}
      </div>
    </div>
  );
};

const Layout = ({ children }) => (
  <FocusModeProvider>
    <Shell>{children}</Shell>
  </FocusModeProvider>
);

export default Layout;
