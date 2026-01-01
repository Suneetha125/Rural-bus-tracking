import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { mockRoutes } from '@/utils/mockData';

const FareManagement = () => {
  const [routes, setRoutes] = useState(mockRoutes);
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast();

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = (id) => {
    setEditingId(null);
    toast({
      title: "Fare Updated",
      description: "Route fare has been updated successfully.",
    });
  };

  const handleFareChange = (id, newFare) => {
    setRoutes(routes.map(route => 
      route.id === id ? { ...route, fare: `₹${newFare}` } : route
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Fare Management</h2>
      </div>

      <div className="space-y-4">
        {routes.map((route) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{route.name}</h3>
                <p className="text-base text-gray-600">{route.from} → {route.to}</p>
                <p className="text-sm text-gray-500 mt-1">Distance: {route.distance}</p>
              </div>

              <div className="flex items-center gap-4">
                {editingId === route.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">₹</span>
                    <input
                      type="number"
                      value={parseInt(route.fare.replace('₹', ''))}
                      onChange={(e) => handleFareChange(route.id, e.target.value)}
                      className="w-24 px-4 py-2 text-xl font-bold border-2 border-purple-500 rounded-lg focus:outline-none focus:border-purple-600"
                    />
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-purple-600">
                    {route.fare}
                  </div>
                )}

                {editingId === route.id ? (
                  <Button
                    onClick={() => handleSave(route.id)}
                    className="py-4 px-6 text-base"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleEdit(route.id)}
                    variant="outline"
                    className="py-4 px-6 text-base"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            {/* Fare Calculation Breakdown */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">Base Fare:</span>
                  <p className="text-base font-bold text-gray-800">
                    ₹{Math.round(parseInt(route.fare.replace('₹', '')) * 0.7)}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Per KM:</span>
                  <p className="text-base font-bold text-gray-800">
                    ₹{Math.round(parseInt(route.fare.replace('₹', '')) / parseInt(route.distance))}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Service Tax:</span>
                  <p className="text-base font-bold text-gray-800">
                    ₹{Math.round(parseInt(route.fare.replace('₹', '')) * 0.1)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FareManagement;