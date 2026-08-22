-- ============================================================================
-- GLOBETROTTER DATABASE SEED SCRIPT
-- PostgreSQL & pgAdmin Compatible Seed Data
-- ============================================================================

-- Clear existing data
TRUNCATE TABLE expenses CASCADE;
TRUNCATE TABLE itinerary_activities CASCADE;
TRUNCATE TABLE trip_stops CASCADE;
TRUNCATE TABLE trips CASCADE;
TRUNCATE TABLE saved_destinations CASCADE;
TRUNCATE TABLE activities CASCADE;
TRUNCATE TABLE cities CASCADE;
TRUNCATE TABLE users CASCADE;

-- ----------------------------------------------------------------------------
-- 1. SEED USERS (Password: password123)
-- ----------------------------------------------------------------------------
INSERT INTO users (id, name, email, password_hash, profile_photo, language, currency, role)
VALUES 
('usr_demo_001', 'Elena Rostova', 'demo@globetrotter.app', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'en', 'USD', 'ADMIN'),
('usr_demo_002', 'Marcus Vance', 'marcus@globetrotter.app', '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'en', 'EUR', 'USER');

-- ----------------------------------------------------------------------------
-- 2. SEED CITIES
-- ----------------------------------------------------------------------------
INSERT INTO cities (id, name, country, region, lat, lng, cost_index, popularity_score, image_url, description)
VALUES
('city_paris', 'Paris', 'France', 'Europe', 48.8566, 2.3522, 5, 4.95, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', 'The City of Light, world-renowned for art, gastronomy, and historic architecture.'),
('city_tokyo', 'Tokyo', 'Japan', 'Asia', 35.6762, 139.6503, 4, 4.98, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', 'A mesmerizing blend of hyper-modern neon skylines, tranquil shrines, and culinary excellence.'),
('city_rome', 'Rome', 'Italy', 'Europe', 41.9028, 12.4964, 4, 4.92, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80', 'The Eternal City with thousands of years of art, ancient amphitheaters, and lively piazzas.'),
('city_amsterdam', 'Amsterdam', 'Netherlands', 'Europe', 52.3676, 4.9041, 4, 4.88, 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80', 'Historic canal belts, world-class art museums, cycling culture, and open-air cafés.'),
('city_dubai', 'Dubai', 'UAE', 'Middle East', 25.2048, 55.2708, 5, 4.91, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', 'Futuristic architecture, ultra-luxury shopping, dune adventures, and breathtaking coastlines.'),
('city_kyoto', 'Kyoto', 'Japan', 'Asia', 35.0116, 135.7681, 3, 4.94, 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', 'The cultural heart of Japan with thousands of classical Buddhist temples, gardens, and geisha districts.'),
('city_bali', 'Bali', 'Indonesia', 'Asia', -8.4095, 115.1889, 2, 4.89, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', 'Tropical paradise with volcanic mountains, iconic terraced rice paddies, and world-class surfing.'),
('city_newyork', 'New York', 'United States', 'Americas', 40.7128, -74.0060, 5, 4.97, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80', 'The vibrant global metropolis of finance, Broadway theater, world cuisine, and iconic skyline.');

-- ----------------------------------------------------------------------------
-- 3. SEED ACTIVITIES
-- ----------------------------------------------------------------------------
INSERT INTO activities (id, city, country, city_id, name, category, description, duration, duration_minutes, estimated_cost, image_url)
VALUES
-- Paris Activities
('act_p_01', 'Paris', 'France', 'city_paris', 'Eiffel Tower Summit & Gardens Tour', 'Sightseeing', 'Ascend to the summit for breathtaking 360-degree panoramic views of Paris.', '2.5 hrs', 150, 45.0, 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80'),
('act_p_02', 'Paris', 'France', 'city_paris', 'Louvre Classical Masterpieces Tour', 'Culture', 'Explore the Mona Lisa, Venus de Milo, and Winged Victory with an expert curator.', '3.0 hrs', 180, 35.0, 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=800&q=80'),
('act_p_03', 'Paris', 'France', 'city_paris', 'Seine River Twilight Dinner Cruise', 'Food', 'Savor gourmet French cuisine as illuminated monuments glide past.', '2.0 hrs', 120, 85.0, 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80'),
('act_p_04', 'Paris', 'France', 'city_paris', 'Montmartre Artists & Sacré-Cœur Walk', 'Culture', 'Wander bohemian cobbled alleyways and discover historic artist studios.', '2.0 hrs', 120, 20.0, 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=800&q=80'),

-- Rome Activities
('act_r_01', 'Rome', 'Italy', 'city_rome', 'Colosseum & Roman Forum Guided Walk', 'Sightseeing', 'Step into gladiatorial history and explore the ancient civic center of the Roman Empire.', '3.5 hrs', 210, 50.0, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'),
('act_r_02', 'Rome', 'Italy', 'city_rome', 'Vatican Museums & Sistine Chapel', 'Culture', 'Marvel at Michelangelo’s ceiling frescoes and Renaissance sculpture collections.', '3.0 hrs', 180, 48.0, 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=800&q=80'),
('act_r_03', 'Rome', 'Italy', 'city_rome', 'Trastevere Sunset Food & Wine Journey', 'Food', 'Tasting tour featuring handmade pasta, Roman supplì, pecorino, and local vintages.', '2.5 hrs', 150, 65.0, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'),

-- Tokyo Activities
('act_t_01', 'Tokyo', 'Japan', 'city_tokyo', 'Tokyo Skytree Panoramic Deck', 'Sightseeing', 'Stand above the world’s largest metropolis with views extending to Mount Fuji.', '2.0 hrs', 120, 28.0, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80'),
('act_t_02', 'Tokyo', 'Japan', 'city_tokyo', 'Tsukiji Outer Market Gourmet Tasting', 'Food', 'Sample fresh sashimi, tamagoyaki, wagyu skewers, and matcha sweets.', '2.5 hrs', 150, 40.0, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80'),
('act_t_03', 'Tokyo', 'Japan', 'city_tokyo', 'Authentic Edo Sushi Masterclass', 'Food', 'Learn nigiri and maki rolling techniques directly from a veteran sushi chef.', '2.0 hrs', 120, 95.0, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80'),
('act_t_04', 'Tokyo', 'Japan', 'city_tokyo', 'Akihabara Tech & Vintage Gaming Walk', 'Shopping', 'Discover retro gaming arcades, electronics alleys, and collector shops.', '2.5 hrs', 150, 15.0, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'),

-- Amsterdam Activities
('act_a_01', 'Amsterdam', 'Netherlands', 'city_amsterdam', 'Heritage Canal Ring Boat Cruise', 'Sightseeing', 'Glide through UNESCO-listed golden age waterways aboard a classic salon boat.', '1.5 hrs', 90, 26.0, 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80'),
('act_a_02', 'Amsterdam', 'Netherlands', 'city_amsterdam', 'Van Gogh Museum Exhibition Walk', 'Culture', 'Explore the world’s largest collection of paintings and drawings by Vincent van Gogh.', '2.0 hrs', 120, 24.0, 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=800&q=80'),

-- Dubai Activities
('act_d_01', 'Dubai', 'UAE', 'city_dubai', 'Burj Khalifa Sky Lounge Access (Level 148)', 'Sightseeing', 'Luxury viewing experience from the pinnacle of the world’s tallest tower.', '2.0 hrs', 120, 110.0, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'),
('act_d_02', 'Dubai', 'UAE', 'city_dubai', 'Desert Safari, Dune Bashing & Camp Barbecue', 'Adventure', '4x4 dune drive, sunset camel rides, and Arabic culinary feast under the stars.', '6.0 hrs', 360, 75.0, 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80'),

-- Kyoto Activities
('act_k_01', 'Kyoto', 'Japan', 'city_kyoto', 'Fushimi Inari Torii Shrine Early Walk', 'Nature', 'Hike the iconic thousand vermilion torii gates winding up sacred Mount Inari.', '3.0 hrs', 180, 0.0, 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'),
('act_k_02', 'Kyoto', 'Japan', 'city_kyoto', 'Arashiyama Bamboo Grove & Tenryu-ji', 'Nature', 'Immerse in the towering bamboo forest and UNESCO Zen temple gardens.', '2.5 hrs', 150, 12.0, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'),

-- Bali Activities
('act_b_01', 'Bali', 'Indonesia', 'city_bali', 'Ubud Sacred Monkey Forest & Rice Terraces', 'Nature', 'Explore lush jungle sanctuaries and cascading emerald rice field valley walks.', '4.0 hrs', 240, 25.0, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'),
('act_b_02', 'Bali', 'Indonesia', 'city_bali', 'Mount Batur Sunrise Volcano Trek', 'Adventure', 'Early morning trek to witness the sunrise above the clouds over volcanic craters.', '5.0 hrs', 300, 45.0, 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80'),

-- New York Activities
('act_ny_01', 'New York', 'United States', 'city_newyork', 'Summit One Vanderbilt Immersive Experience', 'Sightseeing', 'Sensory multi-level observation deck overlooking Manhattan skyline.', '2.0 hrs', 120, 42.0, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'),
('act_ny_02', 'New York', 'United States', 'city_newyork', 'Broadway Evening Theater Ticket', 'Culture', 'Premier theatrical production in the world-famous theater district.', '3.0 hrs', 180, 120.0, 'https://images.unsplash.com/photo-1508973379184-75072182ed9c?auto=format&fit=crop&w=800&q=80');

-- ----------------------------------------------------------------------------
-- 4. SEED SAMPLE TRIP
-- ----------------------------------------------------------------------------
INSERT INTO trips (id, user_id, name, description, start_date, end_date, budget, cover_image, is_public, share_token)
VALUES
('trip_euro_2026', 'usr_demo_001', 'European Grand Escape', 'Curated journey through art, culture, and cuisine in Paris, Amsterdam, and Rome.', '2026-09-12', '2026-09-24', 3500.0, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', TRUE, 'gt-share-euro-2026');

-- ----------------------------------------------------------------------------
-- 5. SEED TRIP STOPS
-- ----------------------------------------------------------------------------
INSERT INTO trip_stops (id, trip_id, city, country, city_id, start_date, end_date, stop_order, notes, estimated_cost)
VALUES
('stop_01_paris', 'trip_euro_2026', 'Paris', 'France', 'city_paris', '2026-09-12', '2026-09-16', 0, 'Explore world-renowned museums, historic architecture, and Seine twilight cruises.', 1200.0),
('stop_02_ams', 'trip_euro_2026', 'Amsterdam', 'Netherlands', 'city_amsterdam', '2026-09-16', '2026-09-20', 1, 'Canal cruises, Van Gogh Museum archives, and bicycle rides through historic districts.', 950.0),
('stop_03_rome', 'trip_euro_2026', 'Rome', 'Italy', 'city_rome', '2026-09-20', '2026-09-24', 2, 'Colosseum tours, Roman Forum, Vatican treasures, and Trastevere culinary dining.', 1350.0);

-- ----------------------------------------------------------------------------
-- 6. SEED ITINERARY ACTIVITIES
-- ----------------------------------------------------------------------------
INSERT INTO itinerary_activities (id, trip_stop_id, activity_id, name, category, activity_date, start_time, duration, cost, location, notes, item_order)
VALUES
('it_act_01', 'stop_01_paris', 'act_p_01', 'Eiffel Tower Summit & Gardens Tour', 'activities', '2026-09-13', '09:30', '2.5 hrs', 45.0, 'Champ de Mars, Paris', 'Skip-the-line summit tickets reserved.', 0),
('it_act_02', 'stop_01_paris', NULL, 'Lunch at Café de Flore', 'meals', '2026-09-13', '12:30', '1.5 hrs', 35.0, 'Saint-Germain-des-Prés', 'Iconic café outdoor seating.', 1),
('it_act_03', 'stop_01_paris', 'act_p_02', 'Louvre Classical Masterpieces Tour', 'activities', '2026-09-13', '15:00', '3.0 hrs', 35.0, 'Rue de Rivoli, Paris', 'Focus on Denon wing highlights.', 2),
('it_act_04', 'stop_01_paris', 'act_p_03', 'Seine River Twilight Dinner Cruise', 'meals', '2026-09-14', '19:30', '2.0 hrs', 85.0, 'Port de la Bourdonnais', 'Formal dress code recommended.', 3),
('it_act_05', 'stop_02_ams', 'act_a_01', 'Heritage Canal Ring Boat Cruise', 'activities', '2026-09-17', '11:00', '1.5 hrs', 26.0, 'Prinsengracht, Amsterdam', 'Open air wooden salon boat.', 0),
('it_act_06', 'stop_02_ams', 'act_a_02', 'Van Gogh Museum Exhibition Walk', 'activities', '2026-09-17', '14:30', '2.0 hrs', 24.0, 'Museumplein, Amsterdam', 'Audio guide included.', 1),
('it_act_07', 'stop_03_rome', 'act_r_01', 'Colosseum & Roman Forum Guided Walk', 'activities', '2026-09-21', '09:00', '3.5 hrs', 50.0, 'Piazza del Colosseo, Rome', 'Gladiator arena floor access.', 0),
('it_act_08', 'stop_03_rome', 'act_r_03', 'Trastevere Sunset Food & Wine Journey', 'meals', '2026-09-21', '18:30', '2.5 hrs', 65.0, 'Trastevere, Rome', 'Wine tasting paired with authentic pastas.', 1),
('it_act_09', 'stop_03_rome', 'act_r_02', 'Vatican Museums & Sistine Chapel', 'activities', '2026-09-22', '10:00', '3.0 hrs', 48.0, 'Vatican City', 'St. Peter Basilica direct pass-through.', 2);

-- ----------------------------------------------------------------------------
-- 7. SEED EXPENSES
-- ----------------------------------------------------------------------------
INSERT INTO expenses (id, trip_id, itinerary_activity_id, category, amount, currency, description, expense_date)
VALUES
('exp_01', 'trip_euro_2026', 'it_act_01', 'activities', 45.0, 'USD', 'Eiffel Tower Tickets', '2026-09-13'),
('exp_02', 'trip_euro_2026', 'it_act_02', 'meals', 35.0, 'USD', 'Lunch at Café de Flore', '2026-09-13'),
('exp_03', 'trip_euro_2026', 'it_act_03', 'activities', 35.0, 'USD', 'Louvre Museum Admission', '2026-09-13'),
('exp_04', 'trip_euro_2026', 'it_act_04', 'meals', 85.0, 'USD', 'Seine Twilight Dinner Cruise', '2026-09-14'),
('exp_05', 'trip_euro_2026', NULL, 'stay', 650.0, 'USD', 'Le Marais Boutique Hotel (4 nights)', '2026-09-12'),
('exp_06', 'trip_euro_2026', NULL, 'transport', 140.0, 'USD', 'Eurostar Express (Paris -> Amsterdam)', '2026-09-16'),
('exp_07', 'trip_euro_2026', 'it_act_05', 'activities', 26.0, 'USD', 'Canal Ring Cruise', '2026-09-17'),
('exp_08', 'trip_euro_2026', 'it_act_06', 'activities', 24.0, 'USD', 'Van Gogh Museum Entrance', '2026-09-17'),
('exp_09', 'trip_euro_2026', NULL, 'stay', 520.0, 'USD', 'Jordaan Canal Loft Hotel (4 nights)', '2026-09-16'),
('exp_10', 'trip_euro_2026', NULL, 'transport', 180.0, 'USD', 'Flight (Amsterdam -> Rome FCO)', '2026-09-20'),
('exp_11', 'trip_euro_2026', 'it_act_07', 'activities', 50.0, 'USD', 'Colosseum Guided Walk', '2026-09-21'),
('exp_12', 'trip_euro_2026', 'it_act_08', 'meals', 65.0, 'USD', 'Trastevere Food Tour', '2026-09-21'),
('exp_13', 'trip_euro_2026', 'it_act_09', 'activities', 48.0, 'USD', 'Vatican Museums Ticket', '2026-09-22'),
('exp_14', 'trip_euro_2026', NULL, 'stay', 680.0, 'USD', 'Piazza Navona Historic Suite (4 nights)', '2026-09-20');

-- ----------------------------------------------------------------------------
-- 8. SEED SAVED DESTINATIONS
-- ----------------------------------------------------------------------------
INSERT INTO saved_destinations (id, user_id, city_id)
VALUES
('sd_01', 'usr_demo_001', 'city_tokyo'),
('sd_02', 'usr_demo_001', 'city_kyoto'),
('sd_03', 'usr_demo_001', 'city_dubai');
