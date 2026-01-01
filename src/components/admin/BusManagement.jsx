import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { mockBuses } from '@/utils/mockData';

const BusManagement = () => {
  const [buses, setBuses] = useState(mockBuses);
  const { toast } = useToast();

  const handleAddBus = () => {
    toast({
      title: "Feature Coming Soon",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleEditBus = (id) => {
    toast({
      title: "Feature Coming Soon",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleDeleteBus = (id) => {
    toast({
      title: "Feature Coming Soon",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Bus Fleet Management</h2>
        <Button
          onClick={handleAddBus}
          className="flex items-center gap-2 text-lg py-6 px-6"
          size="lg"
        >
          <Plus className="w-6 h-6" />
          Add New Bus
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buses.map((bus) => (
          <motion.div
            key={bus.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-400 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Bus className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{bus.number}</h3>
                <span
                  className={`text-sm font-semibold ${
                    bus.status === 'running'
                      ? 'text-green-600'
                      : bus.status === 'delayed'
                      ? 'text-orange-600'
                      : 'text-red-600'
                  }`}
                >
                  {bus.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-base text-gray-600 mb-4">
              <p><span className="font-semibold">Route:</span> {bus.route}</p>
              <p><span className="font-semibold">Driver:</span> {bus.driver}</p>
              <p><span className="font-semibold">Seats:</span> {bus.seatsAvailable}/{bus.totalSeats}</p>
              <p><span className="font-semibold">Next Stop:</span> {bus.nextStop}</p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleEditBus(bus.id)}
                variant="outline"
                className="flex-1 py-3 text-base"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteBus(bus.id)}
                variant="destructive"
                className="flex-1 py-3 text-base"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BusManagement;