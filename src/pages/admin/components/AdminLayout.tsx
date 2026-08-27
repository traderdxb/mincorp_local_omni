import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import RlsHelperModal from './RlsHelperModal';

const navItems = [
  { to: '/admin/dashboard', icon: 'ri-dashboard-line', label: 'Dashboard' },
  { to: '/admin/commodities', icon: 'ri-stack-line', label: 'Commodities' },
  { to: '/admin/leads', icon: 'ri-mail-line', label: 'Leads' },
  { to: '/admin/vcf-contacts', icon: 'ri-contacts-book-2-line', label: 'Contacts & VCF' },
  { to: '/admin/media', icon: 'ri-image-line', label: 'Media' },
  { to: '/admin/site-content', icon: 'ri-file-text-line', label: 'Site Content' },
  { to: '/admin/site-images', icon: 'ri-gallery-line', label: 'Site Images' },
];

const linkBase = 'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap';
const linkActive = 'bg-primary-500 text-background-50';
const linkInactive = 'text-foreground-600 hover:bg-background-200 hover:text-foreground-900';

export default function AdminLayout() {
  const { staffUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [showRlsModal, setShowRlsModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-background-100">
      {/* Sidebar */}
      <aside className="w-[240px] bg-background-50 border-r border-background-200 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-background-200">
          <h1 className="text-lg font-heading font-bold text-primary-500">
            MinCorp
            <span className="text-foreground-400 text-xs font-normal ml-2 tracking-wider">CMS</span>
          </h1>
          {staffUser && (
            <p className="text-[11px] text-foreground-400 mt-1 truncate" title={staffUser.email}>
              {staffUser.email}
            </p>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <span className="w-5 h-5 flex items-center justify-center">
                <i className={item.icon}></i>
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-background-200 space-y-1">
          <button
            onClick={() => setShowRlsModal(true)}
            className={`${linkBase} text-xs text-primary-600 hover:bg-primary-50 w-full text-left font-medium`}
          >
            <span className="w-5 h-5 flex items-center justify-center text-primary-500">
              <i className="ri-shield-keyhole-line"></i>
            </span>
            Fix Database RLS
          </button>
          <NavLink
            to="/"
            target="_blank"
            className={`${linkBase} ${linkInactive} text-xs`}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-external-link-line"></i>
            </span>
            View Public Site
          </NavLink>
          <button
            onClick={handleSignOut}
            className={`${linkBase} ${linkInactive} text-xs w-full text-left`}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-logout-box-line"></i>
            </span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="px-8 py-6">
          <Outlet />
        </div>
      </main>

      <RlsHelperModal isOpen={showRlsModal} onClose={() => setShowRlsModal(false)} />
    </div>
  );
}