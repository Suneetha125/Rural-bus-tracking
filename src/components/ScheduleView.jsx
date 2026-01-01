import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { translations } from '@/utils/translations';

const ScheduleView = ({ routes, language }) => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const t = translations[language];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{t.schedule}</h2>

      {/* Route Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routes.map((route) => (
          <motion.button
            key={route.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedRoute(route)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedRoute?.id === route.id
                ? 'border-blue-600 bg-blue-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">{route.name}</h3>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span className="text-base">{route.from}</span>
              <ArrowRight className="w-4 h-4" />
              <span className="text-base">{route.to}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mt-2">
              <Clock className="w-5 h-5" />
              <span className="text-base">{route.frequency}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Schedule Details */}
      {selectedRoute && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {selectedRoute.name} - {t.schedule}
          </h3>

          <div className="space-y-3">
            {selectedRoute.schedule.map((time, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <span className="text-xl font-bold text-gray-800">{time.departure}</span>
                </div>
                <div className="text-right">
                  <p className="text-base text-gray-600">{t.arrives}: {time.arrival}</p>
                  <p className="text-sm text-gray-500">{t.duration}: {time.duration}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stops List */}
          <div className="mt-6">
            <h4 className="text-xl font-bold text-gray-800 mb-3">{t.stops}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedRoute.stops.map((stop, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-base text-gray-700">{stop.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ScheduleView;