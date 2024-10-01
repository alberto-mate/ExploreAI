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
```

## Insert data

```sql
INSERT INTO
cities (name, latitude, longitude, image)
VALUES
(
'Singapore',
1.3521,
103.8198,
'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Marina_Bay_Sands_in_the_evening_-_20101120.jpg/800px-Marina_Bay_Sands_in_the_evening_-_20101120.jpg'
),
(
'Paris',
48.8566,
2.3522,
'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/800px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg'
),
(
'London',
51.5074,
-0.1278,
'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/800px-London_Skyline_%28125508655%29.jpeg'
),
(
'New York',
40.7128,
-74.006,
'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/800px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg'
),
(
'Tokyo',
35.6762,
139.6503,
'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/800px-Skyscrapers_of_Shinjuku_2009_January.jpg'
);

```
