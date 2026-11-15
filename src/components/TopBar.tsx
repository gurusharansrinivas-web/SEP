import React from 'react';
import {
  Bell,
  Calendar,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X,
} from 'lucide-react';
import type { NavSection, NotificationItem } from '../types/gaushala';
import type { SearchResultItem } from '../utils/dashboardCalculations';

interface TopBarProps {
  activeSection: NavSection;
  sectionLabel: string;
  onOpenMobileSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchResults: SearchResultItem[];
  onSelectSearchResult: (item: SearchResultItem) => void;
  notifications: NotificationItem[];
  onMarkAllNotificationsRead: () => void;
  onSelectNotification: (notif: NotificationItem) => void;
  onSelectSection: (section: NavSection) => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  adminAvatarUrl: string;
  formattedDate: string;
}

export function TopBar({
  activeSection,
  sectionLabel,
  onOpenMobileSidebar,
  searchQuery,
  onSearchChange,
  searchResults,
  onSelectSearchResult,
  notifications,
  onMarkAllNotificationsRead,
  onSelectNotification,
  onSelectSection,
  onOpenProfile,
  onLogout,
  adminAvatarUrl,
  formattedDate,
}: TopBarProps) {
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [avatarFailed, setAvatarFailed] = React.useState(false);

  const notifRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#E3E8E1] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0 shrink-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 -ml-2 rounded-lg text-[#26352D] hover:bg-[#F6F8F5] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm min-w-0">
          <button
            type="button"
            onClick={() => onSelectSection('dashboard')}
            className="text-[#78857C] hover:text-[#245C43] transition-colors hidden sm:inline whitespace-nowrap"
          >
            Sri Krishna Gaushala
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#78857C] hidden sm:inline shrink-0" />
          <span className="font-semibold text-[#26352D] truncate">
            {activeSection === 'dashboard' ? 'Dashboard' : sectionLabel}
          </span>
        </nav>
      </div>

      {/* Center: Global Search */}
      <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
        <label htmlFor="global-dashboard-search" className="sr-only">
          Search cows, records or activities
        </label>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#78857C] absolute left-3 pointer-events-none" />
          <input
            id="global-dashboard-search"
            type="search"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setSearchFocused(true);
            }}
            placeholder="Search cows, records or activities..."
            className="w-full h-9 pl-9 pr-8 text-[13px] bg-[#F6F8F5] border border-[#DCE4DA] rounded-lg text-[#26352D] placeholder:text-[#78857C] focus:outline-none focus:bg-white focus:border-[#245C43] focus:ring-2 focus:ring-[#245C43]/15 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 text-[#78857C] hover:text-[#26352D]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Dropdown */}
        {searchFocused && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 mt-1.5 bg-white border border-[#DCE4DA] rounded-xl shadow-lg overflow-hidden z-40">
            {searchResults.length > 0 ? (
              <ul className="divide-y divide-[#F0F3EE] max-h-80 overflow-y-auto">
                {searchResults.map((result) => (
                  <li key={result.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSearchResult(result);
                        setSearchFocused(false);
                      }}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-[#F6F8F5] transition-colors flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-[#26352D] truncate">
                          {result.title}
                        </div>
                        <div className="text-[12px] text-[#78857C] truncate mt-0.5">
                          {result.subtitle}
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-[#245C43] shrink-0 pt-0.5">
                        {result.kind}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-4 text-[13px] text-[#78857C]">
                No matching cows, medical records, tasks, or inventory found for &ldquo;{searchQuery}&rdquo;.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Date + Notification Bell + Admin Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="hidden xl:flex items-center gap-1.5 text-[12.5px] text-[#78857C] tabular-nums pr-2 border-r border-[#E3E8E1]">
          <Calendar className="w-3.5 h-3.5 text-[#78857C]" />
          <span>{formattedDate}</span>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            aria-label={`Notifications (${unreadCount} unread)`}
            aria-expanded={notifOpen}
            className="relative p-2 rounded-lg text-[#4B5A51] hover:text-[#26352D] hover:bg-[#F6F8F5] transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#D95C55] text-white text-[10px] font-semibold leading-4 text-center tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              role="region"
              aria-label="Notifications panel"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#DCE4DA] rounded-xl shadow-lg z-40 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#EDF1EB]">
                <span className="text-[13.5px] font-semibold text-[#26352D]">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllNotificationsRead}
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-[#245C43] hover:underline"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>
              <ul className="divide-y divide-[#F0F3EE] max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <li key={notif.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectNotification(notif);
                        setNotifOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-[#F6F8F5] transition-colors ${
                        notif.read ? 'opacity-75' : 'bg-[#F9FBF9]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[13px] font-semibold text-[#26352D]">
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="text-[11px] font-medium text-[#245C43] shrink-0">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#78857C] mt-0.5 leading-snug">
                        {notif.detail}
                      </p>
                      <span className="text-[11px] text-[#78857C] mt-1 block tabular-nums">
                        {notif.time}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotifOpen(false);
            }}
            aria-expanded={profileOpen}
            aria-label="Administrator account menu"
            className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-[#F6F8F5] transition-colors"
          >
            {!avatarFailed ? (
              <img
                src={adminAvatarUrl}
                alt="Administrator Arvind Kulkarni"
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
                className="w-8 h-8 rounded-full object-cover border border-[#DCE4DA]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#245C43] text-white text-xs font-semibold flex items-center justify-center">
                AK
              </div>
            )}
            <span className="hidden sm:inline text-[13px] font-medium text-[#26352D] whitespace-nowrap">
              Administrator
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#78857C]" />
          </button>

          {profileOpen && (
            <div
              role="menu"
              aria-label="Administrator menu"
              className="absolute right-0 mt-2 w-52 bg-white border border-[#DCE4DA] rounded-xl shadow-lg z-40 py-1.5"
            >
              <div className="px-3.5 py-2 border-b border-[#EDF1EB]">
                <div className="text-[13px] font-semibold text-[#26352D]">
                  Arvind Kulkarni
                </div>
                <div className="text-[11.5px] text-[#78857C]">
                  admin@srikrishnagaushala.org
                </div>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onOpenProfile();
                  setProfileOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-[13px] text-[#26352D] hover:bg-[#F6F8F5] flex items-center gap-2.5"
              >
                <User className="w-4 h-4 text-[#78857C]" />
                Profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelectSection('settings');
                  setProfileOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-[13px] text-[#26352D] hover:bg-[#F6F8F5] flex items-center gap-2.5"
              >
                <Settings className="w-4 h-4 text-[#78857C]" />
                Settings
              </button>
              <div className="my-1 border-t border-[#EDF1EB]" />
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onLogout();
                  setProfileOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-[13px] text-[#D95C55] hover:bg-[#FDF3F2] flex items-center gap-2.5"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
