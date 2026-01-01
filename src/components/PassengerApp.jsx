import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Users, Ticket, Globe, Wifi, WifiOff } from 'lucide-react';
import BusMap from '@/components/BusMap';
import ScheduleView from '@/components/ScheduleView';
import BookingInterface from '@/components/BookingInterface';
import { useToast } from '@/components/ui/use-toast';
import { translations } from '@/utils/translations';
import { mockBuses, mockRoutes } from '@/utils/mockData';

const PassengerApp = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [language, setLanguage] = useState('en');
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();
  const t = translations[language];

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: t.online,
        description: t.onlineMessage,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: t.offline,
        description: t.offlineMessage,
        variant: 'destructive',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [language, t, toast]);

  const tabs = [
    { id: 'map', label: t.liveTracking, icon: MapPin },
    { id: 'schedule', label: t.schedule, icon: Clock },
    { id: 'booking', label: t.booking, icon: Ticket },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'te', label: 'తెలుగు' },
  ];

  return (
    <div className="space-y-4">
      {/* Language Selector & Online Status */}
      <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-blue-600" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-lg font-semibold border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="w-6 h-6 text-green-600" />
              <span className="text-lg font-semibold text-green-600">{t.online}</span>
            </>
          ) : (
            <>
              <WifiOff className="w-6 h-6 text-red-600" />
              <span className="text-lg font-semibold text-red-600">{t.offline}</span>
            </>
          )}
        </div>
      </div>

      {/* Large Tab Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`p-6 rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-lg ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xl'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-8 h-8" />
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          {activeTab === 'map' && <BusMap buses={mockBuses} routes={mockRoutes} language={language} />}
          {activeTab === 'schedule' && <ScheduleView routes={mockRoutes} language={language} />}
          {activeTab === 'booking' && <BookingInterface routes={mockRoutes} language={language} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PassengerApp;