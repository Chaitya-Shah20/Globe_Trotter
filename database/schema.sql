-- ============================================================================
-- GLOBETROTTER DATABASE SCHEMA
-- PostgreSQL & pgAdmin Compatible Relational Schema
-- ============================================================================

-- Enable UUID extension if needed (optional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    profile_photo TEXT,
    language VARCHAR(10) DEFAULT 'en',
    currency VARCHAR(10) DEFAULT 'USD',
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ----------------------------------------------------------------------------
-- 2. CITIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cities (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    region VARCHAR(100),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    cost_index INTEGER DEFAULT 3 CHECK (cost_index BETWEEN 1 AND 5),
    popularity_score DOUBLE PRECISION DEFAULT 4.8,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
CREATE INDEX IF NOT EXISTS idx_cities_country ON cities(country);

-- ----------------------------------------------------------------------------
-- 3. TRIPS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trips (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DOUBLE PRECISION DEFAULT 0.0,
    cover_image TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(64) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trips_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_share_token ON trips(share_token);

-- ----------------------------------------------------------------------------
-- 4. TRIP STOPS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trip_stops (
    id VARCHAR(64) PRIMARY KEY,
    trip_id VARCHAR(64) NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    city_id VARCHAR(64),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    stop_order INTEGER DEFAULT 0,
    notes TEXT,
    estimated_cost DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_stops_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_stops_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_order ON trip_stops(trip_id, stop_order);

-- ----------------------------------------------------------------------------
-- 5. ACTIVITIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(64) PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    city_id VARCHAR(64),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Sightseeing, Food, Adventure, Nature, Culture, Shopping
    description TEXT,
    duration VARCHAR(50) DEFAULT '2 hrs',
    duration_minutes INTEGER DEFAULT 120,
    estimated_cost DOUBLE PRECISION DEFAULT 0.0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activities_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_activities_city ON activities(city);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);

-- ----------------------------------------------------------------------------
-- 6. ITINERARY ACTIVITIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS itinerary_activities (
    id VARCHAR(64) PRIMARY KEY,
    trip_stop_id VARCHAR(64) NOT NULL,
    activity_id VARCHAR(64),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'activities',
    activity_date DATE,
    start_time VARCHAR(10) DEFAULT '10:00',
    duration VARCHAR(50) DEFAULT '2 hrs',
    cost DOUBLE PRECISION DEFAULT 0.0,
    location TEXT,
    notes TEXT,
    item_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_itinerary_stop FOREIGN KEY (trip_stop_id) REFERENCES trip_stops(id) ON DELETE CASCADE,
    CONSTRAINT fk_itinerary_activity FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_itinerary_stop_id ON itinerary_activities(trip_stop_id);

-- ----------------------------------------------------------------------------
-- 7. EXPENSES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR(64) PRIMARY KEY,
    trip_id VARCHAR(64) NOT NULL,
    itinerary_activity_id VARCHAR(64),
    category VARCHAR(50) NOT NULL, -- transport, stay, meals, activities, other
    amount DOUBLE PRECISION NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    description TEXT NOT NULL,
    expense_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_expenses_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_expenses_activity FOREIGN KEY (itinerary_activity_id) REFERENCES itinerary_activities(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- ----------------------------------------------------------------------------
-- 8. SAVED DESTINATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_destinations (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    city_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_saved_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_city UNIQUE (user_id, city_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_user_id ON saved_destinations(user_id);
