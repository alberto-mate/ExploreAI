## Create a database

```sql
CREATE TABLE users (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
clerk_id VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE cities (
id SERIAL PRIMARY KEY,
name VARCHAR(30) NOT NULL,
latitude DOUBLE PRECISION,
longitude DOUBLE PRECISION,
image TEXT
);

CREATE TABLE landmarks (
id SERIAL PRIMARY KEY,
city_id INTEGER NOT NULL,
name VARCHAR(100) NOT NULL,
latitude DOUBLE PRECISION,
longitude DOUBLE PRECISION,
address VARCHAR(255) NOT NULL,
image TEXT,
FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

CREATE TABLE userLandmarks (
  id SERIAL PRIMARY KEY,
  clerk_id VARCHAR(50) NOT NULL,
  landmark_id INTEGER NOT NULL,
  is_unlocked BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (clerk_id) REFERENCES users(clerk_id) ON DELETE CASCADE,
  FOREIGN KEY (landmark_id) REFERENCES landmarks(id) ON DELETE CASCADE
);

ALTER TABLE userLandmarks
ADD CONSTRAINT userLandmarks_unique UNIQUE (landmark_id, clerk_id);

ALTER TABLE userLandmarks
ADD COLUMN unlocked_date DATE;
```

## Insert data

```sql
INSERT INTO cities (name, latitude, longitude, image) VALUES
('Singapore', 1.3521, 103.8198, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Marina_Bay_Sands_in_the_evening_-_20101120.jpg/800px-Marina_Bay_Sands_in_the_evening_-_20101120.jpg'),
('Paris', 48.8566, 2.3522, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/800px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg'),
('London', 51.5074, -0.1278, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/800px-London_Skyline_%28125508655%29.jpeg'),
('New York', 40.7128, -74.006, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/800px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg'),
('Tokyo', 35.6762, 139.6503, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/800px-Skyscrapers_of_Shinjuku_2009_January.jpg');
```

```sql
INSERT INTO landmarks (id, city_id, name, latitude, longitude, address, image)
VALUES
(1, 1, 'Marina Bay Sands', 1.2834, 103.8607, '10 Bayfront Ave, Singapore 018956', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Marina_Bay_Sands_in_the_evening_-_20101120.jpg/800px-Marina_Bay_Sands_in_the_evening_-_20101120.jpg'),
(2, 1, 'Gardens by the Bay', 1.2816, 103.8636, '18 Marina Gardens Dr, Singapore 018953', 'https://imgcdn.flamingotravels.co.in/Images/PlacesOfInterest/Gardens-By-The-Bay-3.jpg'),
(3, 1, 'Merlion Park', 1.2868, 103.8545, '1 Fullerton Rd, Singapore 049213', 'https://www.visitsingapore.com/content/dam/visitsingapore/neighbourhoods/marina-bay/page-image-merlion-park_756x560.jpg'),
(4, 1, 'Singapore Flyer', 1.2894, 103.8631, '30 Raffles Ave, Singapore 039803', 'https://cdn-imgix.headout.com/media/images/706e97bad1b8bb4fbf133d849130ba9d-AdobeStock-310569188.jpeg?auto=format&w=900&h=562.5&q=90&fit=crop&ar=16%3A10'),
(5, 1, 'Chinatown', 1.2833, 103.8437, 'Chinatown, Singapore', 'https://thescarletsingapore.com/uploads/blog/china-town.webp'),
(6, 2, 'Eiffel Tower', 48.8584, 2.2945, 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg'),
(7, 2, 'Louvre Museum', 48.8606, 2.3376, 'Rue de Rivoli, 75001 Paris, France', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Louvre_aile_Richelieu.jpg/800px-Louvre_aile_Richelieu.jpg'),
(8, 3, 'Tower Bridge', 51.5055, -0.0754, 'Tower Bridge Rd, London SE1 2UP, UK', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Tower_Bridge_from_Shad_Thames.jpg/800px-Tower_Bridge_from_Shad_Thames.jpg'),
(9, 3, 'Big Ben', 51.5007, -0.1246, 'Westminster, London SW1A 0AA, UK', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg/800px-Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg'),
(10, 4, 'Statue of Liberty', 40.6892, -74.0445, 'Liberty Island, New York, NY 10004, USA', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Lady_Liberty_under_a_blue_sky_%28cropped%29.jpg/800px-Lady_Liberty_under_a_blue_sky_%28cropped%29.jpg'),
(11, 4, 'Empire State Building', 40.7484, -73.9857, '20 W 34th St, New York, NY 10001, USA', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg'),
(12, 5, 'Tokyo Skytree', 35.71, 139.8107, '1 Chome-1-2 Oshiage, Sumida City, Tokyo 131-0045, Japan', 'https://www.japan-guide.com/g18/3064_01a.jpg'),
(13, 5, 'Senso-ji Temple', 35.7147, 139.7967, '2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan', 'https://en.japantravel.com/photo/poi-5-214199/1200x630/tokyo-sensoji-temple-214199.jpg');
```

```sql
INSERT INTO userLandmarks (clerk_id, landmark_id, is_unlocked)
VALUES
('user_2mmcl1qej9xfTFwP750xTGW42gZ', 1, TRUE),   -- Marina Bay Sands (Singapore)
('user_2mmcl1qej9xfTFwP750xTGW42gZ', 2, FALSE),  -- Gardens by the Bay (Singapore)
('user_2mmcl1qej9xfTFwP750xTGW42gZ', 3, TRUE),   -- Merlion Park (Singapore)
('user_2mmcl1qej9xfTFwP750xTGW42gZ', 6, TRUE),   -- Eiffel Tower (Paris)
('user_2mmcl1qej9xfTFwP750xTGW42gZ', 7, FALSE),  -- Louvre Museum (Paris)
('user_2mmcl1qej9xfTFwP750xTGW42gZ', 8, TRUE),   -- Tower Bridge (London)
('user_2mmcl1qej9xfTFwP750xTGW42gZ', 9, FALSE),  -- Big Ben (London)
('user_2mmcl1qej9xfTFwP750xTGW42gZ', 12, TRUE),  -- Tokyo Skytree (Tokyo)
('user_2mmcl1qej9xfTFwP750xTGW42gZ', 13, FALSE); -- Senso-ji Temple (Tokyo)
```
