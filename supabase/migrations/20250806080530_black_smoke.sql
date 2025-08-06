/*
  # Seed Sample Data for GreenLoop

  1. Sample Data
    - Insert sample recycling centers across Bangladesh
    - Insert sample user profiles for testing
    - Insert sample pickup records

  2. Notes
    - This data is for development and testing purposes
    - Real production data should be managed through the application
*/

-- Insert sample recycling centers
INSERT INTO recycling_centers (name, address, latitude, longitude, phone, email, operating_hours, accepted_materials, rating, capacity_status) VALUES
('Green Recycling Dhaka', 'Dhanmondi 15, Dhaka 1209', 23.7465, 90.3765, '+880-2-9661234', 'info@greenrecycling.bd', '8:00 AM - 6:00 PM', ARRAY['plastic', 'paper', 'glass', 'metal'], 4.8, 'medium'),
('EcoCenter Gulshan', 'Gulshan Avenue, Dhaka 1212', 23.7808, 90.4176, '+880-2-8821456', 'contact@ecocenter.bd', '9:00 AM - 7:00 PM', ARRAY['plastic', 'electronics'], 4.6, 'high'),
('Bangladesh Recycle Hub', 'Uttara Sector 7, Dhaka 1230', 23.8759, 90.3795, '+880-2-8958789', 'hub@bdrecycle.com', '7:00 AM - 8:00 PM', ARRAY['electronics', 'metal', 'batteries'], 4.9, 'low'),
('Chittagong Green Solutions', 'Agrabad, Chittagong 4100', 22.3569, 91.7832, '+880-31-710123', 'info@ctggreen.bd', '8:30 AM - 5:30 PM', ARRAY['plastic', 'paper', 'glass'], 4.5, 'medium'),
('Sylhet Eco Park', 'Zindabazar, Sylhet 3100', 24.8949, 91.8687, '+880-821-725456', 'contact@sylheteco.bd', '9:00 AM - 6:00 PM', ARRAY['paper', 'cardboard', 'plastic'], 4.7, 'high'),
('Rajshahi Recycling Center', 'Shaheb Bazar, Rajshahi 6000', 24.3745, 88.6042, '+880-721-772789', 'info@rajshahirecycle.bd', '8:00 AM - 6:00 PM', ARRAY['metal', 'plastic', 'glass'], 4.4, 'medium'),
('Khulna Green Initiative', 'Sonadanga, Khulna 9100', 22.8456, 89.5403, '+880-41-760321', 'green@khulna.bd', '8:00 AM - 7:00 PM', ARRAY['plastic', 'paper', 'organic'], 4.6, 'low'),
('Barisal Waste Management', 'Sadar Road, Barisal 8200', 22.7010, 90.3535, '+880-431-64789', 'waste@barisal.bd', '9:00 AM - 5:00 PM', ARRAY['paper', 'cardboard', 'metal'], 4.3, 'medium'),
('Rangpur Eco Solutions', 'Station Road, Rangpur 5400', 25.7439, 89.2752, '+880-521-62456', 'eco@rangpur.bd', '8:30 AM - 6:30 PM', ARRAY['plastic', 'electronics', 'glass'], 4.5, 'high'),
('Mymensingh Green Center', 'Choto Bazar, Mymensingh 2200', 24.7471, 90.4203, '+880-91-66123', 'center@mymensingh.bd', '8:00 AM - 6:00 PM', ARRAY['paper', 'plastic', 'metal'], 4.2, 'medium');

-- Note: In a real application, user profiles would be created through the authentication system
-- This is just sample data for development purposes