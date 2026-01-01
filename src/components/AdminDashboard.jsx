import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bus, Route, DollarSign, Plus } from 'lucide-react';
import RouteManagement from '@/components/admin/RouteManagement';
import BusManagement from '@/components/admin/BusManagement';
import FareManagement from '@/components/admin/FareManagement';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('routes');

  const sections = [
    { id: 'routes', label: 'Manage Routes', icon: Route, color: 'blue' },
    { id: 'buses', label: 'Manage Buses', icon: Bus, color: 'green' },
    { id: 'fares', label: 'Manage Fares', icon: DollarSign, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
        
        {/* Section Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection(section.id)}
                className={`p-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  activeSection === section.id
                    ? `bg-${section.color}-600 text-white shadow-xl`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={
                  activeSection === section.id
                    ? {
                        backgroundColor:
                          section.color === 'blue'
                            ? '#2563eb'
                            : section.color === 'green'
                            ? '#16a34a'
                            : '#9333ea',
                      }
                    : {}
                }
              >
                <Icon className="w-7 h-7" />
                <span>{section.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeSection === 'routes' && <RouteManagement />}
        {activeSection === 'buses' && <BusManagement />}
        {activeSection === 'fares' && <FareManagement />}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;