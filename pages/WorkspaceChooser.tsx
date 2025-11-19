
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import { ShieldIcon, BuildingIcon, ChartBarIcon, KeyIcon } from '../components/Icons';

interface RoleCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
  linkTo: string;
}

const RoleCard: React.FC<RoleCardProps> = ({ icon: Icon, title, description, buttonText, linkTo }) => (
  <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200 flex flex-col text-center items-center">
    <div className="bg-blue-100 rounded-full p-3 mb-4">
      <Icon className="w-8 h-8 text-blue-600" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 mb-6 flex-grow">{description}</p>
    <Link
      to={linkTo}
      className="w-full text-center px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
    >
      {buttonText}
    </Link>
  </div>
);

const WorkspaceChooser: React.FC = () => {
    const adminButton = (
        <button
          disabled
          className="w-full text-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg transition-colors opacity-50 cursor-not-allowed"
        >
         Open administrator portal
        </button>
    )

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="py-20 px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Choose your workspace</h2>
          <p className="text-lg text-slate-600">
            Pick the experience that matches your role and jump straight into your dashboard.
          </p>
        </div>
        <div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200 flex flex-col text-center items-center">
            <div className="bg-blue-100 rounded-full p-3 mb-4">
              <ShieldIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Administrator</h3>
            <p className="text-slate-500 mb-6 flex-grow">Govern roles, audit activity, and keep your organization running smoothly.</p>
            {adminButton}
          </div>
          <RoleCard
            icon={BuildingIcon}
            title="Property Manager"
            description="Oversee properties, coordinate maintenance, and support residents day-to-day."
            buttonText="Open manager portal"
            linkTo="/manager"
          />
          <RoleCard
            icon={ChartBarIcon}
            title="Owner"
            description="Monitor asset performance, approve projects, and stay informed with transparent reporting."
            buttonText="Open owner portal"
            linkTo="/owner"
          />
          <RoleCard
            icon={KeyIcon}
            title="Tenant"
            description="Pay rent, submit maintenance requests, and review lease documents from any device."
            buttonText="Open tenant portal"
            linkTo="/tenant"
          />
        </div>
      </main>
      <footer className="w-full px-8 py-4 border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-slate-500">
          <span>© {new Date().getFullYear()} - EZProperty</span>
        </div>
      </footer>
    </div>
  );
};

export default WorkspaceChooser;