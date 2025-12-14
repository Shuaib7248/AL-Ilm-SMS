
import React, { useState } from 'react';
import { MOCK_VEHICLES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { Bus, MapPin, Phone, User, Plus, X, Save, Trash2 } from 'lucide-react';
import { Vehicle } from '../types';

export const TransportModule: React.FC = () => {
  const { t } = useLanguage();
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
      vehicleNumber: '',
      driverName: '',
      driverContact: '',
      route: '',
      capacity: 40
  });

  const handleAddVehicle = (e: React.FormEvent) => {
      e.preventDefault();
      const vehicle: Vehicle = {
          id: Date.now().toString(),
          vehicleNumber: newVehicle.vehicleNumber,
          driverName: newVehicle.driverName,
          driverContact: newVehicle.driverContact,
          route: newVehicle.route,
          capacity: newVehicle.capacity,
          studentsCount: 0,
          status: 'Active'
      };
      setVehicles([...vehicles, vehicle]);
      setIsModalOpen(false);
      setNewVehicle({ vehicleNumber: '', driverName: '', driverContact: '', route: '', capacity: 40 });
      alert(t('success'));
  };

  const handleDeleteVehicle = (id: string) => {
      if(confirm('Are you sure you want to delete this vehicle?')) {
          setVehicles(prev => prev.filter(v => v.id !== id));
      }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bus className="w-6 h-6 text-amber-500" /> {t('fleetManagement')}
            </h3>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
                <Plus className="w-4 h-4" /> {t('addVehicle')}
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vehicles.map(vehicle => {
            const loadPercentage = (vehicle.studentsCount / vehicle.capacity) * 100;
            return (
              <div key={vehicle.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow relative group">
                <button 
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex justify-between items-start mb-4 pr-8">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{vehicle.vehicleNumber}</h4>
                    <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                      <MapPin className="w-3 h-3" /> {vehicle.route}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${vehicle.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {t(vehicle.status.toLowerCase()) || vehicle.status}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{t('capacityStatus')}</span>
                    <span>{vehicle.studentsCount} / {vehicle.capacity}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${loadPercentage}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{vehicle.driverName}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {vehicle.driverContact}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-slate-900">{t('addVehicle')}</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <form onSubmit={handleAddVehicle} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('vehicleNo')}</label>
                          <input 
                              type="text" 
                              required
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={newVehicle.vehicleNumber}
                              onChange={e => setNewVehicle({...newVehicle, vehicleNumber: e.target.value})}
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('driverName')}</label>
                            <input 
                                type="text" 
                                required
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newVehicle.driverName}
                                onChange={e => setNewVehicle({...newVehicle, driverName: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('driverContact')}</label>
                            <input 
                                type="tel" 
                                required
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newVehicle.driverContact}
                                onChange={e => setNewVehicle({...newVehicle, driverContact: e.target.value})}
                            />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('route')}</label>
                            <input 
                                type="text" 
                                required
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newVehicle.route}
                                onChange={e => setNewVehicle({...newVehicle, route: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('vehicleCapacity')}</label>
                            <input 
                                type="number" 
                                required
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newVehicle.capacity}
                                onChange={e => setNewVehicle({...newVehicle, capacity: parseInt(e.target.value)})}
                            />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                          <button 
                              type="button" 
                              onClick={() => setIsModalOpen(false)}
                              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                              {t('cancel')}
                          </button>
                          <button 
                              type="submit"
                              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2"
                          >
                              <Save className="w-4 h-4" /> {t('save')}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
