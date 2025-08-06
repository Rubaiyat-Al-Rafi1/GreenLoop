import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Truck, 
  BarChart3, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ModeratorDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Pickup {
  id: string;
  user_id: string;
  center_id: string;
  pickup_date: string;
  pickup_time: string;
  items_description: string;
  estimated_weight: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  points_earned: number;
  created_at: string;
  updated_at: string;
  user_name?: string;
  center_name?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  user_type: string;
  points: number;
  created_at: string;
}

interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  capacity_status: 'low' | 'medium' | 'high';
}

const ModeratorDashboard: React.FC<ModeratorDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('pickups');
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [greenRiders, setGreenRiders] = useState<User[]>([]);
  const [assignedRider, setAssignedRider] = useState('');

  const tabs = [
    { id: 'pickups', label: 'Pickup Requests', icon: Truck },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'centers', label: 'Recycling Centers', icon: BarChart3 },
    { id: 'schedule', label: 'Schedule', icon: Calendar }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch pickups with user and center details
      const { data: pickupsData, error: pickupsError } = await supabase
        .from('pickups')
        .select(`
          *,
          profiles:user_id(name),
          recycling_centers:center_id(name)
        `)
        .order('created_at', { ascending: false });

      if (pickupsError) throw pickupsError;

      const formattedPickups = pickupsData.map((pickup: any) => ({
        ...pickup,
        user_name: pickup.profiles?.name,
        center_name: pickup.recycling_centers?.name
      }));

      setPickups(formattedPickups);

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData);

      // Find users who could be green riders (facility staff)
      const riders = usersData.filter(u => u.user_type === 'facility');
      setGreenRiders(riders);

      // Fetch recycling centers
      const { data: centersData, error: centersError } = await supabase
        .from('recycling_centers')
        .select('*')
        .order('name');

      if (centersError) throw centersError;
      setCenters(centersData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePickupStatus = async (id: string, status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('pickups')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      // Refresh data
      fetchData();
      setShowPickupModal(false);
    } catch (error) {
      console.error('Error updating pickup status:', error);
    }
  };

  const assignPickupToRider = async () => {
    if (!selectedPickup || !assignedRider) return;
    
    try {
      // In a real app, you would have a riders table and create an assignment
      // For now, we'll just update the pickup status to in_progress
      const { error } = await supabase
        .from('pickups')
        .update({ 
          status: 'in_progress', 
          updated_at: new Date().toISOString(),
          // In a real app, you would store the rider_id here
        })
        .eq('id', selectedPickup.id);

      if (error) throw error;
      
      // Refresh data
      fetchData();
      setShowPickupModal(false);
      setAssignedRider('');
    } catch (error) {
      console.error('Error assigning pickup:', error);
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

  const filteredPickups = pickups
    .filter(pickup => statusFilter === 'all' || pickup.status === statusFilter)
    .filter(pickup => 
      pickup.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickup.center_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickup.items_description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const renderPickupsTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Pickup Requests</h2>
        <button 
          onClick={fetchData}
          className="flex items-center text-emerald-600 hover:text-emerald-700"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search pickups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pickup requests...</p>
        </div>
      ) : filteredPickups.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No pickup requests found</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPickups.map((pickup) => (
                <tr key={pickup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{pickup.user_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pickup.center_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(pickup.pickup_date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">{pickup.pickup_time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{pickup.items_description}</div>
                    <div className="text-sm text-gray-500">{pickup.estimated_weight} kg</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pickup.status)}`}>
                      {pickup.status.replace('_', ' ').charAt(0).toUpperCase() + pickup.status.replace('_', ' ').slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedPickup(pickup);
                        setShowPickupModal(true);
                      }}
                      className="text-emerald-600 hover:text-emerald-900"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pickup Management Modal */}
      {showPickupModal && selectedPickup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Pickup Request</h2>
              <button
                onClick={() => setShowPickupModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Pickup Details</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedPickup.user_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Recycling Center</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedPickup.center_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedPickup.pickup_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Time</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedPickup.pickup_time}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Items Description</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedPickup.items_description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estimated Weight</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedPickup.estimated_weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Current Status</p>
                    <p className={`mt-1 text-sm font-medium ${getStatusColor(selectedPickup.status)}`}>
                      {selectedPickup.status.replace('_', ' ').charAt(0).toUpperCase() + selectedPickup.status.replace('_', ' ').slice(1)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedPickup.status === 'scheduled' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Assign to Green Rider</h3>
                  <div className="mt-2">
                    <select
                      value={assignedRider}
                      onChange={(e) => setAssignedRider(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Select a Green Rider</option>
                      {greenRiders.map(rider => (
                        <option key={rider.id} value={rider.id}>{rider.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={assignPickupToRider}
                      disabled={!assignedRider}
                      className="mt-2 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Assign & Start Pickup
                    </button>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium text-gray-900">Update Status</h3>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {selectedPickup.status !== 'scheduled' && (
                    <button
                      onClick={() => updatePickupStatus(selectedPickup.id, 'scheduled')}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Calendar className="h-5 w-5 mr-2 text-yellow-500" />
                      Scheduled
                    </button>
                  )}
                  {selectedPickup.status !== 'in_progress' && (
                    <button
                      onClick={() => updatePickupStatus(selectedPickup.id, 'in_progress')}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Clock className="h-5 w-5 mr-2 text-blue-500" />
                      In Progress
                    </button>
                  )}
                  {selectedPickup.status !== 'completed' && (
                    <button
                      onClick={() => updatePickupStatus(selectedPickup.id, 'completed')}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Completed
                    </button>
                  )}
                  {selectedPickup.status !== 'cancelled' && (
                    <button
                      onClick={() => updatePickupStatus(selectedPickup.id, 'cancelled')}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                      Cancelled
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderUsersTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button 
          onClick={fetchData}
          className="flex items-center text-emerald-600 hover:text-emerald-700"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No users found</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.user_type === 'moderator' ? 'bg-purple-100 text-purple-800' : user.user_type === 'facility' ? 'bg-blue-100 text-blue-800' : user.user_type === 'business' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                      {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.points}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(user.created_at).toLocaleDateString()}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderCentersTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recycling Centers</h2>
        <button 
          onClick={fetchData}
          className="flex items-center text-emerald-600 hover:text-emerald-700"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recycling centers...</p>
        </div>
      ) : centers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No recycling centers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centers.map((center) => (
            <div key={center.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{center.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{center.address}</p>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">Capacity:</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${center.capacity_status === 'high' ? 'bg-red-100 text-red-800' : center.capacity_status === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {center.capacity_status.charAt(0).toUpperCase() + center.capacity_status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderScheduleTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Pickup Schedule</h2>
        <button 
          onClick={fetchData}
          className="flex items-center text-emerald-600 hover:text-emerald-700"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schedule...</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Pickups</h3>
            
            {pickups.filter(p => p.status === 'scheduled' || p.status === 'in_progress').length === 0 ? (
              <p className="text-gray-600">No upcoming pickups scheduled</p>
            ) : (
              <div className="space-y-4">
                {pickups
                  .filter(p => p.status === 'scheduled' || p.status === 'in_progress')
                  .sort((a, b) => new Date(a.pickup_date).getTime() - new Date(b.pickup_date).getTime())
                  .map(pickup => (
                    <div key={pickup.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{pickup.user_name}</p>
                          <p className="text-sm text-gray-600">{pickup.center_name}</p>
                          <div className="mt-2 flex items-center">
                            <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                            <span className="text-sm text-gray-600">{new Date(pickup.pickup_date).toLocaleDateString()}</span>
                            <Clock className="h-4 w-4 text-gray-500 ml-3 mr-1" />
                            <span className="text-sm text-gray-600">{pickup.pickup_time}</span>
                          </div>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pickup.status)}`}>
                          {pickup.status.replace('_', ' ').charAt(0).toUpperCase() + pickup.status.replace('_', ' ').slice(1)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{pickup.items_description} ({pickup.estimated_weight} kg)</p>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => {
                            setSelectedPickup(pickup);
                            setShowPickupModal(true);
                          }}
                          className="text-sm text-emerald-600 hover:text-emerald-700"
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'pickups':
        return renderPickupsTab();
      case 'users':
        return renderUsersTab();
      case 'centers':
        return renderCentersTab();
      case 'schedule':
        return renderScheduleTab();
      default:
        return renderPickupsTab();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Moderator Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage pickup requests, users, and recycling centers</p>
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

      {/* Tab Content */}
      {renderActiveTab()}
    </div>
  );
};

export default ModeratorDashboard;