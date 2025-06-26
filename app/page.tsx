'use client';

import { useAuth } from '@/lib/auth-context';
import { LoginForm } from '@/components/auth/login-form';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { FileUpload } from '@/components/uploads/file-upload';
import { AnalyticsCharts } from '@/components/analytics/analytics-charts';
import { LeetCodeIntegration } from '@/components/external/leetcode-integration';
import { Toaster } from '@/components/ui/sonner';
import { useState } from 'react';

export default function Home() {
  const { isAuthenticated, loading, user } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'uploads' | 'analytics' | 'leetcode'>('dashboard');

  console.log('Home: Auth state - authenticated:', isAuthenticated, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginForm />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <>
      <DashboardLayout currentPage={currentView}>
        {currentView === 'dashboard' && <DashboardOverview />}
        {currentView === 'uploads' && <FileUpload />}
        {currentView === 'analytics' && <AnalyticsCharts />}
        {currentView === 'leetcode' && <LeetCodeIntegration username={user?.username} />}
        
        {/* Navigation buttons for demo */}
        <div className="fixed bottom-6 right-6 flex flex-wrap gap-2 max-w-xs">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
              currentView === 'dashboard' 
                ? 'bg-primary-blue text-white' 
                : 'bg-dark-card text-text-secondary hover:text-text-primary'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
              currentView === 'analytics' 
                ? 'bg-primary-blue text-white' 
                : 'bg-dark-card text-text-secondary hover:text-text-primary'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setCurrentView('uploads')}
            className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
              currentView === 'uploads' 
                ? 'bg-primary-blue text-white' 
                : 'bg-dark-card text-text-secondary hover:text-text-primary'
            }`}
          >
            Uploads
          </button>
          <button
            onClick={() => setCurrentView('leetcode')}
            className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
              currentView === 'leetcode' 
                ? 'bg-primary-blue text-white' 
                : 'bg-dark-card text-text-secondary hover:text-text-primary'
            }`}
          >
            LeetCode
          </button>
        </div>
      </DashboardLayout>
      <Toaster position="top-right" />
    </>
  );
}
