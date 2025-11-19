
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import WorkspaceChooser from './pages/WorkspaceChooser';
import PropertyManagerDashboard from './pages/PropertyManagerDashboard';
import ManageProperties from './pages/ManageProperties';
import CapitalProjects from './pages/CapitalProjects';
import Tenants from './pages/Tenants';
import Owners from './pages/Owners';
import FinancialOverview from './pages/FinancialOverview';
import RentRoll from './pages/RentRoll';
import Reports from './pages/Reports';
import Maintenance from './pages/Maintenance';
import Vendors from './pages/Vendors';
import Announcements from './pages/Announcements';
import Messages from './pages/Messages';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerProperties from './pages/OwnerProperties';
import OwnerCapitalProjects from './pages/OwnerCapitalProjects';
import OwnerMaintenance from './pages/OwnerMaintenance';
import OwnerFinancialOverview from './pages/OwnerFinancialOverview';
import OwnerReports from './pages/OwnerReports';
import OwnerAnnouncements from './pages/OwnerAnnouncements';
import OwnerMessages from './pages/OwnerMessages';
import OwnerDocuments from './pages/OwnerDocuments';
import OwnerSettings from './pages/OwnerSettings';
import TenantDashboard from './pages/TenantDashboard';
import TenantPayments from './pages/TenantPayments';
import TenantAnnouncements from './pages/TenantAnnouncements';
import TenantMaintenance from './pages/TenantMaintenance';
import TenantMessages from './pages/TenantMessages';
import TenantDocuments from './pages/TenantDocuments';
import TenantSettings from './pages/TenantSettings';
import TenantMoveInInspection from './pages/TenantMoveInInspection';
import NotificationsPage from './pages/NotificationsPage';
import { DataProvider } from './contexts/DataContext';
import LeaseTemplates from './pages/LeaseTemplates';
import TenantScreening from './pages/TenantScreening';

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WorkspaceChooser />} />
      <Route path="/manager" element={<PropertyManagerDashboard />} />
      <Route path="/manager/properties" element={<ManageProperties />} />
      <Route path="/manager/capital-projects" element={<CapitalProjects />} />
      <Route path="/manager/tenants" element={<Tenants />} />
      <Route path="/manager/tenants/:tenantId/screening" element={<TenantScreening />} />
      <Route path="/manager/owners" element={<Owners />} />
      <Route path="/manager/financial-overview" element={<FinancialOverview />} />
      <Route path="/manager/rent-roll" element={<RentRoll />} />
      <Route path="/manager/reports" element={<Reports />} />
      <Route path="/manager/maintenance" element={<Maintenance />} />
      <Route path="/manager/vendors" element={<Vendors />} />
      <Route path="/manager/announcements" element={<Announcements />} />
      <Route path="/manager/messages" element={<Messages />} />
      <Route path="/manager/documents" element={<Documents />} />
      <Route path="/manager/settings" element={<Settings />} />
      <Route path="/manager/lease-templates" element={<LeaseTemplates />} />
      <Route path="/manager/notifications" element={<NotificationsPage />} />

      <Route path="/owner" element={<OwnerDashboard />} />
      <Route path="/owner/properties" element={<OwnerProperties />} />
      <Route path="/owner/capital-projects" element={<OwnerCapitalProjects />} />
      <Route path="/owner/maintenance" element={<OwnerMaintenance />} />
      <Route path="/owner/financial-overview" element={<OwnerFinancialOverview />} />
      <Route path="/owner/reports" element={<OwnerReports />} />
      <Route path="/owner/announcements" element={<OwnerAnnouncements />} />
      <Route path="/owner/messages" element={<OwnerMessages />} />
      <Route path="/owner/documents" element={<OwnerDocuments />} />
      <Route path="/owner/settings" element={<OwnerSettings />} />
      <Route path="/owner/notifications" element={<NotificationsPage />} />

      <Route path="/tenant" element={<TenantDashboard />} />
      <Route path="/tenant/payments" element={<TenantPayments />} />
      <Route path="/tenant/announcements" element={<TenantAnnouncements />} />
      <Route path="/tenant/maintenance" element={<TenantMaintenance />} />
      <Route path="/tenant/messages" element={<TenantMessages />} />
      <Route path="/tenant/documents" element={<TenantDocuments />} />
      <Route path="/tenant/settings" element={<TenantSettings />} />
      <Route path="/tenant/move-in-inspection" element={<TenantMoveInInspection />} />
      <Route path="/tenant/notifications" element={<NotificationsPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <DataProvider>
        <div className="min-h-screen bg-slate-50 text-slate-800">
          <AppContent />
        </div>
      </DataProvider>
    </HashRouter>
  );
};

export default App;
