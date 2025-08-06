import React, { useState } from 'react';
import { usePickups } from '../../hooks/usePickups';
import { useRecyclingCenters } from '../../hooks/useRecyclingCenters';
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Package, 
  Clock,
  Award,
  Leaf,
  Plus,
  CheckCircle
} from 'lucide-react';

interface ConsumerDashboardProps {
  user: {
    id: string;
    name: string;
    points: number;
    user_type: string;
  };
}

const ConsumerDashboard: React.FC<ConsumerDashboardProps> = ({ user }) => {
  const { pickups, createPickup, loading: pickupsLoading } = usePickups();
  const { centers, loading: centersLoading } = useRecyclingCenters();
  const [activeTab, setActiveTab] = useState('overview');
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [pickupForm, setPickupForm] = useState({
    center_id: '',
    pickup_date: '',
    pickup_time: '',
    items_description: '',
    estimated_weight: 1,
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'pickups', label: 'Pickups', icon: Calendar },
    { id: 'centers', label: 'Centers', icon: MapPin },
    { id: 'rewards', label: 'Rewards', icon: Trophy }
  ];

  const stats = [
    { label: 'GreenPoints', value: user.points, icon: Trophy, color: 'text-yellow-600 bg-yellow-100' },
    { label: 'Items Recycled', value: pickups.filter(p => p.status === 'completed').length, icon: Package, color: 'text-green-600 bg-green-100' },
    { label: 'CO₂ Saved', value: `${Math.round(pickups.filter(p => p.status === 'completed').reduce((acc, p) => acc + (p.estimated_weight * 0.5), 0))}kg`, icon: Leaf, color: 'text-blue-600 bg-blue-100' },
    { label: 'Pickups This Month', value: pickups.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).length, icon: Calendar, color: 'text-purple-600 bg-purple-100' }
  ];

  const handleSchedulePickup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await createPickup(pickupForm);
      if (error) throw error;
      
      setShowPickupModal(false);
      setPickupForm({
        center_id: '',
        pickup_date: '',
        pickup_time: '',
        items_description: '',
        estimated_weight: 1,
      });
    } catch (error) {
      console.error('Error scheduling pickup:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 mt-2">Track your recycling progress and environmental impact</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowPickupModal(true)}
                className="flex items-center justify-center p-4 border-2 border-dashed border-emerald-300 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors group"
              >
                <Plus className="h-5 w-5 text-emerald-600 mr-2" />
                <span className="text-emerald-600 font-medium">Schedule Pickup</span>
              </button>
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-blue-600 font-medium">Find Centers</span>
              </button>
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
                <Award className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-purple-600 font-medium">View Rewards</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Pickups</h3>
            {pickupsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading pickups...</p>
              </div>
            ) : pickups.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No pickups scheduled yet</p>
                <button
                  onClick={() => setShowPickupModal(true)}
                  className="mt-2 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Schedule your first pickup
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {pickups.slice(0, 5).map((pickup) => (
                  <div key={pickup.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-4 ${getStatusColor(pickup.status)}`}>
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{pickup.items_description}</p>
                        <p className="text-sm text-gray-500">{new Date(pickup.pickup_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium capitalize ${getStatusColor(pickup.status).split(' ')[0]}`}>
                        {pickup.status.replace('_', ' ')}
                      </p>
                      {pickup.points_earned > 0 && (
                        <p className="text-sm text-gray-500">+{pickup.points_earned} points</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'centers' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Nearby Recycling Centers</h3>
          {centersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
              <p className="text-gray-500">Loading centers...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {centers.slice(0, 10).map((center) => (
                <div key={center.id} className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{center.name}</h4>
                      <p className="text-sm text-gray-600">{center.accepted_materials.join(', ')}</p>
                      <p className="text-sm text-gray-500 mt-1">{center.address}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-sm font-medium">{center.rating}</span>
                      </div>
                      <button className="mt-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                        Get Directions
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pickup Modal */}
      {showPickupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule Pickup</h3>
            <form onSubmit={handleSchedulePickup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recycling Center
                </label>
                <select
                  value={pickupForm.center_id}
                  onChange={(e) => setPickupForm({ ...pickupForm, center_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="">Select a center</option>
                  {centers.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name} - {center.address}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={pickupForm.pickup_date}
                  onChange={(e) => setPickupForm({ ...pickupForm, pickup_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Time
                </label>
                <input
                  type="time"
                  value={pickupForm.pickup_time}
                  onChange={(e) => setPickupForm({ ...pickupForm, pickup_time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items to Recycle
                </label>
                <textarea
                  value={pickupForm.items_description}
                  onChange={(e) => setPickupForm({ ...pickupForm, items_description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                  placeholder="Describe the items you want to recycle..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Weight (kg)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={pickupForm.estimated_weight}
                  onChange={(e) => setPickupForm({ ...pickupForm, estimated_weight: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowPickupModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumerDashboard;