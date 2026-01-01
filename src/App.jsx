import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import PassengerApp from '@/components/PassengerApp';
import AdminDashboard from '@/components/AdminDashboard';
import { Toaster } from '@/components/ui/toaster';
import { Bus, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [activeView, setActiveView] = useState('passenger');

  return (
    <>
      <Helmet>
        <title>Rural Bus Tracking - Live Bus Tracker & Booking System</title>
        <meta name="description" content="Track rural buses in real-time, view schedules, check seat availability, and book tickets easily. Simple and accessible interface for all users." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Header with App Switcher */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Rural Bus Tracker</h1>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveView('passenger')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeView === 'passenger'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Bus className="w-5 h-5" />
                  <span className="text-lg">Passenger</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveView('admin')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeView === 'admin'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-lg">Admin</span>
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'passenger' ? <PassengerApp /> : <AdminDashboard />}
          </motion.div>
        </main>

        <Toaster />
      </div>
    </>
  );
}

export default App;