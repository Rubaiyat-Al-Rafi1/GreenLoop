import React, { useState } from 'react';
import { 
  Factory, 
  Truck, 
  BarChart3, 
  Users,
  MapPin,
  Package,
  Clock,
  AlertCircle
} from 'lucide-react';

interface FacilityDashboardProps {
  user: {
    name: string;
  };
}

const FacilityDashboard: React.FC<FacilityDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('operations');

  const tabs = [
    { id: 'operations', label: 'Operations', icon: Factory },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'customers', label: 'Customers', icon: Users }
  ];

  const operationalStats = [
    { label: 'Daily Capacity', value: '15 tons', icon: Factory, color: 'text-blue-600 bg-blue-100' },
    { label: 'Active Routes', value: '8', icon: Truck, color: 'text-green-600 bg-green-100' },
    { label: 'Processing Queue', value: '23 items', icon: Package, color: 'text-orange-600 bg-orange-100' },
    { label: 'Response Time', value: '2.4 hrs', icon: Clock, color: 'text-purple-600 bg-purple-100' }
  ];

  const pendingPickups = [
    { id: 1, customer: 'Dhaka Electronics Ltd.', type: 'Electronics', quantity: '50 units', priority: 'High', time: '10:00 AM' },
    { id: 2, customer: 'Green Office Solutions', type: 'Paper', quantity: '200 kg', priority: 'Medium', time: '2:00 PM' },
    { id: 3, customer: 'Residential - Gulshan', type: 'Mixed', quantity: '15 kg', priority: 'Low', time: '4:00 PM' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Facility Operations</h1>
        <p className="text-gray-600 mt-2">Monitor and manage your recycling facility operations</p>
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

      {activeTab === 'operations' && (
        <div className="space-y-8">
          {/* Operational Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {operationalStats.map((stat, index) => (
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

          {/* Facility Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Facility Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="font-medium text-green-800">Processing Unit A</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Operating at 85% capacity</p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="font-medium text-yellow-800">Processing Unit B</span>
                </div>
                <p className="text-sm text-yellow-600 mt-1">Maintenance scheduled</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="font-medium text-blue-800">Storage Area</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">68% capacity</p>
              </div>
            </div>
          </div>

          {/* Pending Pickups */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Pickup Schedule</h3>
            <div className="space-y-4">
              {pendingPickups.map((pickup) => (
                <div key={pickup.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-4">
                      <MapPin className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{pickup.customer}</p>
                      <p className="text-sm text-gray-600">{pickup.type} - {pickup.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(pickup.priority)}`}>
                      {pickup.priority}
                    </span>
                    <span className="text-sm text-gray-500">{pickup.time}</span>
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                      Assign Route
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Processing Volume</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Processing volume chart would go here</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Distribution</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Material distribution chart would go here</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-gray-100 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">94.2%</p>
                <p className="text-sm text-gray-600">Processing Efficiency</p>
              </div>
              <div className="text-center p-4 border border-gray-100 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">2.1 hrs</p>
                <p className="text-sm text-gray-600">Avg Response Time</p>
              </div>
              <div className="text-center p-4 border border-gray-100 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">98.7%</p>
                <p className="text-sm text-gray-600">Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityDashboard;