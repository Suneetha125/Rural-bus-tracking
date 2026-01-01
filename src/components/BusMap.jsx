import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Users } from 'lucide-react';
import { translations } from '@/utils/translations';

const BusMap = ({ buses, routes, language }) => {
  const [selectedBus, setSelectedBus] = useState(null);
  const t = translations[language];

  // Simple map visualization with bus positions
  const mapWidth = 800;
  const mapHeight = 600;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">{t.liveTracking}</h2>
      
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden border-4 border-gray-300" style={{ height: '500px' }}>
        {/* Simple road network visualization */}
        <svg className="absolute inset-0 w-full h-full">
          {routes.map((route) => (
            <motion.path
              key={route.id}
              d={route.pathData}
              stroke="#94a3b8"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />
          ))}
        </svg>

        {/* Bus markers */}
        {buses.map((bus) => (
          <motion.div
            key={bus.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            className="absolute cursor-pointer"
            style={{
              left: `${bus.position.x}%`,
              top: `${bus.position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => setSelectedBus(bus)}
          >
            <div className={`bg-${bus.status === 'running' ? 'green' : bus.status === 'delayed' ? 'orange' : 'red'}-500 rounded-full p-3 shadow-lg`}>
              <Navigation className="w-6 h-6 text-white" style={{ transform: `rotate(${bus.direction}deg)` }} />
            </div>
          </motion.div>
        ))}

        {/* Stop markers */}
        {routes.flatMap((route) =>
          route.stops.map((stop, idx) => (
            <div
              key={`${route.id}-stop-${idx}`}
              className="absolute"
              style={{
                left: `${stop.x}%`,
                top: `${stop.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="bg-white rounded-full p-2 shadow-md border-2 border-blue-500">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bus Info Panel */}
      {selectedBus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{selectedBus.number}</h3>
              <p className="text-lg text-gray-600">{selectedBus.route}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              selectedBus.status === 'running'
                ? 'bg-green-100 text-green-800'
                : selectedBus.status === 'delayed'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {selectedBus.status.toUpperCase()}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="font-semibold">{t.seatsAvailable}:</span>
              <span className="text-green-600 font-bold">{selectedBus.seatsAvailable}/{selectedBus.totalSeats}</span>
            </div>
            <div>
              <span className="font-semibold">{t.nextStop}:</span>
              <p className="text-gray-700">{selectedBus.nextStop}</p>
            </div>
            <div>
              <span className="font-semibold">{t.eta}:</span>
              <p className="text-gray-700">{selectedBus.eta}</p>
            </div>
            <div>
              <span className="font-semibold">{t.driver}:</span>
              <p className="text-gray-700">{selectedBus.driver}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-3">{t.legend}</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            <span className="text-base">{t.running}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
            <span className="text-base">{t.delayed}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-full"></div>
            <span className="text-base">{t.stopped}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusMap;