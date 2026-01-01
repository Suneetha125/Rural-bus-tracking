import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { mockRoutes } from '@/utils/mockData';

const RouteManagement = () => {
  const [routes, setRoutes] = useState(mockRoutes);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleAddRoute = () => {
    toast({
      title: "Feature Coming Soon",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleEditRoute = (id) => {
    toast({
      title: "Feature Coming Soon",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleDeleteRoute = (id) => {
    toast({
      title: "Feature Coming Soon",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Route Management</h2>
        <Button
          onClick={handleAddRoute}
          className="flex items-center gap-2 text-lg py-6 px-6"
          size="lg"
        >
          <Plus className="w-6 h-6" />
          Add New Route
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routes.map((route) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{route.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mt-2">
                  <MapPin className="w-5 h-5" />
                  <span>{route.from} → {route.to}</span>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-600">{route.fare}</span>
            </div>

            <div className="space-y-2 text-base text-gray-600 mb-4">
              <p><span className="font-semibold">Distance:</span> {route.distance}</p>
              <p><span className="font-semibold">Frequency:</span> {route.frequency}</p>
              <p><span className="font-semibold">Stops:</span> {route.stops.length}</p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleEditRoute(route.id)}
                variant="outline"
                className="flex-1 py-4 text-base"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteRoute(route.id)}
                variant="destructive"
                className="flex-1 py-4 text-base"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RouteManagement;