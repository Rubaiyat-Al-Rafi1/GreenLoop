import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  operating_hours: string;
  accepted_materials: string[];
  rating: number;
  capacity_status: 'low' | 'medium' | 'high';
  distance?: number;
}

export const useRecyclingCenters = () => {
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recycling_centers')
        .select('*')
        .order('name');

      if (error) throw error;

      setCenters(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const findNearbyCenter = async (userLat: number, userLng: number, radiusKm: number = 10) => {
    try {
      const { data, error } = await supabase
        .from('recycling_centers')
        .select('*');

      if (error) throw error;

      // Calculate distances and filter by radius
      const centersWithDistance = (data || []).map(center => {
        const distance = calculateDistance(userLat, userLng, center.latitude, center.longitude);
        return { ...center, distance };
      }).filter(center => center.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);

      return centersWithDistance;
    } catch (err) {
      console.error('Error finding nearby centers:', err);
      return [];
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  return {
    centers,
    loading,
    error,
    fetchCenters,
    findNearbyCenter,
  };
};