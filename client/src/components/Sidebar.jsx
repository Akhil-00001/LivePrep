import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiMic, FiMessageSquare, FiCpu, FiInfo, FiFileText, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const menuItems = [
  { path: '/', icon: FiHome, label: 'Home', mobileLabel: 'Home' },
  // One tab for every interview type; the type is chosen on the setup screen.
  // /hr-interview still exists (it preselects HR) and highlights this tab.
  { path: '/interview', icon: FiMic, label: 'Interview', mobileLabel: 'Interview', also: ['/hr-interview'] },
  { path: '/behavioural-interview', icon: FiMessageSquare, label: 'Behavioural guide', mobileLabel: 'Behaviour' },
  { path: '/aptitude', icon: FiCpu, label: 'Aptitude test', mobileLabel: 'Aptitude' },
  { path: '/history', icon: FiFileText, label: 'Reports', mobileLabel: 'Reports' },
  { path: '/about', icon: FiInfo, label: 'About', mobileLabel: 'About', desktopOnly: true },
];

const Sidebar = ({ collapsed = false, onToggle }) => {
  const location = useLocation();

  return (
    <aside className={`fixed inset-x-0 bottom-0 z-50 border-t border-rule bg-sheet transition-[width] duration-200 md:inset-y-0 md:left-0 md:right-auto md:border-r md:border-t-0 ${collapsed ? 'md:w-16' : 'md:w-60'}`}>
      <div className={`hidden items-center pb-6 pt-7 md:flex ${collapsed ? 'justify-center px-3' : 'justify-between pl-6 pr-3'}`}>
        {!collapsed && (
          <Link to="/" className="voice text-title text-ink">
            LivePrep
          </Link>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="rounded-sm p-1.5 text-graphite transition-colors hover:bg-paper hover:text-ink"
        >
          {collapsed ? <FiChevronsRight className="text-[17px]" /> : <FiChevronsLeft className="text-[17px]" />}
        </button>
      </div>

      <nav aria-label="Main" className="grid grid-cols-5 md:block md:px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || item.also?.includes(location.pathname);
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? 'page' : undefined}
              aria-label={collapsed ? item.label : undefined}
              title={collapsed ? item.label : undefined}
              className={`relative min-w-0 flex-col items-center gap-1 px-1 py-2 text-[11px] transition-colors md:mb-0.5 md:flex-row md:gap-3 md:rounded-sm md:px-3 md:py-2 md:text-body ${collapsed ? 'md:justify-center' : ''} ${
                item.desktopOnly ? 'hidden md:flex' : 'flex'
              } ${
                isActive
                  ? 'font-semibold text-ink md:bg-paper'
                  : 'text-graphite hover:text-ink'
              }`}
            >
              {isActive && (
                <span aria-hidden className="absolute inset-x-3 top-0 h-0.5 bg-ink md:inset-x-auto md:inset-y-1.5 md:left-0 md:h-auto md:w-0.5" />
              )}
              <Icon className="shrink-0 text-base md:text-[17px]" />
              <span className="max-w-full truncate md:hidden">{item.mobileLabel}</span>
              {!collapsed && <span className="hidden truncate md:inline">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
