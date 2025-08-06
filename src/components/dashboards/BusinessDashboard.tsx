import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Package, 
  TrendingUp, 
  Calendar,
  Truck,
  Building,
  Settings
} from 'lucide-react';

interface BusinessDashboardProps {
  user: {
    name: string;
  };
}

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('analytics');

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'waste', label: 'Waste Management', icon: Package },
    { id: 'scheduling', label: 'Scheduling', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const metrics = [
    { label: 'Monthly Waste Volume', value: '2.4 tons', icon: Package, color: 'text-blue-600 bg-blue-100' },
    { label: 'Cost Savings', value: '৳45,000', icon: TrendingUp, color: 'text-green-600 bg-green-100' },
    { label: 'Scheduled Pickups', value: '12', icon: Calendar, color: 'text-purple-600 bg-purple-100' },
    { label: 'Employee Participation', value: '89%', icon: Users, color: 'text-orange-600 bg-orange-100' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your organization's recycling performance</p>
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

      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${metric.color}`}>
                    <metric.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Recycling Trend</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chart visualization would go here</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Waste Categories</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Pie chart visualization would go here</p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {[
                { type: 'pickup', message: 'Scheduled pickup for Office Building A', time: '2 hours ago' },
                { type: 'report', message: 'Monthly sustainability report generated', time: '1 day ago' },
                { type: 'achievement', message: 'Reached 90% employee participation rate', time: '3 days ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center p-4 border border-gray-100 rounded-lg">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                    <Building className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'waste' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Waste Management Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Plastic Waste</h4>
              <p className="text-2xl font-bold text-blue-600">847 kg</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Paper Waste</h4>
              <p className="text-2xl font-bold text-green-600">1.2 tons</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Electronic Waste</h4>
              <p className="text-2xl font-bold text-orange-600">23 units</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;