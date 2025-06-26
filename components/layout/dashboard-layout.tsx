'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Upload, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Home,
  FileText,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { id: 'reports', label: 'Reports', icon: FileText, href: '/reports' },
  { id: 'uploads', label: 'File Uploads', icon: Upload, href: '/uploads' },
  { id: 'users', label: 'User Management', icon: Users, href: '/users', adminOnly: true },
  { id: 'performance', label: 'Performance', icon: TrendingUp, href: '/performance' },
  { id: 'security', label: 'Security', icon: Shield, href: '/security', adminOnly: true },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];

export function DashboardLayout({ children, currentPage = 'dashboard' }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();

  console.log('DashboardLayout: Rendering with user:', user?.username, 'page:', currentPage);

  const handleLogout = () => {
    console.log('DashboardLayout: Logging out user');
    logout();
    toast.success('Logged out successfully');
  };

  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 0 : -200 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-40 h-full w-64 glass-card border-r border-dark-border"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-dark-border">
            <motion.h1 
              className="text-xl font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
            >
              Analytics Pro
            </motion.h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {filteredNavItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-primary-blue text-white shadow-lg'
                    : 'text-text-secondary hover:text-text-primary hover:bg-dark-card'
                }`}
                onClick={() => console.log('Navigate to:', item.href)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
                {item.adminOnly && (
                  <Shield className="w-3 h-3 ml-auto text-warning-amber" />
                )}
              </motion.button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t border-dark-border p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary-blue text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-text-secondary capitalize">
                  {user?.role}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-text-secondary hover:text-error-red"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Bar */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card border-b border-dark-border px-6 py-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-text-secondary hover:text-text-primary"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold text-text-primary capitalize">
                {currentPage}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">
                  Welcome back, {user?.username}!
                </p>
                <p className="text-xs text-text-secondary">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}