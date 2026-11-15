import React from 'react';
import {
  Activity,
  Boxes,
  ClipboardCheck,
  FileBarChart2,
  HeartHandshake,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  Stethoscope,
  Users,
  Wheat,
  X,
} from 'lucide-react';
import type { NavSection } from '../types/gaushala';
import { CowLineIcon, GaushalaEmblem } from './Icons';

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  adminAvatarUrl: string;
}

interface NavItemConfig {
  id: NavSection;
  label: string;
  renderIcon: (active: boolean) => React.ReactNode;
}

const PRIMARY_NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    renderIcon: (active) => (
      <LayoutDashboard className={`w-[18px] h-[18px] ${active ? 'text-[#245C43]' : 'text-[#78857C]'}`} />
    ),
  },
  {
    id: 'cows',
    label: 'Cow Management',
    renderIcon: (active) => (
      <CowLineIcon className={`w-[18px] h-[18px] ${active ? 'text-[#245C43]' : 'text-[#78857C]'}`} />
    ),
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    renderIcon: (active) => (
      <Stethoscope className={`w-[18px] h-[18px] ${active ? 'text-[#245C43]' : 'text-[#78857C]'}`} />
    ),
  },
  {
    id: 'feeding',
    label: 'Feeding & Nutrition',
    renderIcon: (active) => (
      <Wheat className={`w-[18px] h-[18px] ${active ? 'text-[#245C43]' : 'text-[#78857C]'}`} />
    ),
  },
  {
    id: 'inventory',
    label: 'Inventory',
    renderIcon: (active) => (
      <Boxes className={`w-[18px] h-[18px] ${active ? 'text-[#245C43]' : 'text-[#78857C]'}`} />
    ),
  },
  {
    id: 'staff',
    label: 'Staff Management',
    renderIcon: (active) => (
      <Users className={`w-[18px] h-[18px] ${active ? 'text-[#245C43]' : 'text-[#78857C]'}`} />
    ),
  },
  {
    id: 'rescue',
    label: 'Rescue Records',
    renderIcon: (active) => (
      <HeartHandshake className={`w-[18px] h-[18px] ${active ? 'text-[#245C43]' : 'text-[#78857C]'}`} />
    ),
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    renderIcon: (active) => (
      <FileBarChart2 className={`w-[18px] h-[18px] ${active ? 'text-[#245C43]' : 'text-[#78857C]'}`} />
    ),
  },
];

export function Sidebar({
  activeSection,
  onSelectSection,
  mobileOpen,
  onCloseMobile,
  onOpenProfile,
  onLogout,
  adminAvatarUrl,
}: SidebarProps) {
  const [avatarFailed, setAvatarFailed] = React.useState(false);

  const handleNavClick = (section: NavSection) => {
    onSelectSection(section);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full w-[250px] bg-white border-r border-[#E3E8E1] select-none">
      {/* Brand Block */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[#EDF1EB]">
        <div className="flex items-center gap-3 min-w-0">
          <GaushalaEmblem className="w-9 h-9 shrink-0" />
          <div className="min-w-0">
            <div className="font-display text-[13px] font-bold tracking-tight text-[#26352D] leading-tight">
              SRI KRISHNA GAUSHALA
            </div>
            <div className="text-[11px] text-[#78857C] mt-0.5 truncate">
              Animal Care Management
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="lg:hidden p-1.5 rounded-lg text-[#78857C] hover:text-[#26352D] hover:bg-[#F6F8F5] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Navigation */}
      <nav aria-label="Primary Sidebar Navigation" className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {PRIMARY_NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] transition-colors text-left whitespace-nowrap ${
                isActive
                  ? 'bg-[#E9F2EC] text-[#245C43] font-semibold'
                  : 'text-[#4B5A51] font-medium hover:bg-[#F6F8F5] hover:text-[#26352D]'
              }`}
            >
              <span className="shrink-0">{item.renderIcon(isActive)}</span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Utility Navigation & Profile */}
      <div className="px-3 pt-3 pb-4 border-t border-[#EDF1EB] space-y-1">
        <button
          type="button"
          onClick={() => handleNavClick('settings')}
          aria-current={activeSection === 'settings' ? 'page' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] transition-colors text-left whitespace-nowrap ${
            activeSection === 'settings'
              ? 'bg-[#E9F2EC] text-[#245C43] font-semibold'
              : 'text-[#4B5A51] font-medium hover:bg-[#F6F8F5] hover:text-[#26352D]'
          }`}
        >
          <Settings
            className={`w-[18px] h-[18px] shrink-0 ${
              activeSection === 'settings' ? 'text-[#245C43]' : 'text-[#78857C]'
            }`}
          />
          <span>Settings</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick('help')}
          aria-current={activeSection === 'help' ? 'page' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] transition-colors text-left whitespace-nowrap ${
            activeSection === 'help'
              ? 'bg-[#E9F2EC] text-[#245C43] font-semibold'
              : 'text-[#4B5A51] font-medium hover:bg-[#F6F8F5] hover:text-[#26352D]'
          }`}
        >
          <HelpCircle
            className={`w-[18px] h-[18px] shrink-0 ${
              activeSection === 'help' ? 'text-[#245C43]' : 'text-[#78857C]'
            }`}
          />
          <span>Help &amp; Support</span>
        </button>

        <div className="pt-2 mt-2 border-t border-[#EDF1EB]">
          <button
            type="button"
            onClick={() => {
              onOpenProfile();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#F6F8F5] transition-colors text-left"
          >
            {!avatarFailed ? (
              <img
                src={adminAvatarUrl}
                alt="Arvind Kulkarni"
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
                className="w-8 h-8 rounded-full object-cover border border-[#DCE4DA] shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#245C43] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                AK
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-[#26352D] truncate">
                Arvind Kulkarni
              </div>
              <div className="text-[11px] text-[#78857C] truncate">
                Chief Administrator
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="mt-1 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-[#78857C] hover:text-[#D95C55] hover:bg-[#FDF3F2] transition-colors text-left"
          >
            <LogOut className="w-[17px] h-[17px] shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30 w-[250px]">
        {sidebarContent}
      </aside>

      {/* Mobile & Tablet Slide-Over Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#26352D]/35 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full shadow-xl">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
