CREATE TABLE public.wards (
  id text PRIMARY KEY,
  name text NOT NULL,
  city text NOT NULL,
  country text NOT NULL DEFAULT 'IN',
  population integer NOT NULL DEFAULT 50000,
  infra_score numeric NOT NULL DEFAULT 5,
  grid_x integer NOT NULL,
  grid_y integer NOT NULL,
  lat numeric NOT NULL DEFAULT 0,
  lng numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wards TO anon;
GRANT SELECT ON public.wards TO authenticated;
GRANT ALL ON public.wards TO service_role;
ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wards_public_read" ON public.wards FOR SELECT USING (true);

CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code text NOT NULL UNIQUE,
  ward_id text NOT NULL REFERENCES public.wards(id),
  lat numeric NOT NULL DEFAULT 0,
  lng numeric NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'other',
  urgency integer NOT NULL DEFAULT 3,
  sentiment text NOT NULL DEFAULT 'neutral',
  language text NOT NULL DEFAULT 'en',
  original_text text NOT NULL DEFAULT '',
  translated_text text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  channel text NOT NULL DEFAULT 'web',
  status text NOT NULL DEFAULT 'submitted',
  official_note text,
  audio_url text,
  reporter_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.reports TO anon;
GRANT SELECT, INSERT, UPDATE ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_public_read" ON public.reports FOR SELECT USING (true);
CREATE POLICY "reports_public_insert" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "reports_official_update" ON public.reports FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.hotspot_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ward_id text NOT NULL REFERENCES public.wards(id),
  category text NOT NULL,
  priority_score numeric NOT NULL DEFAULT 0,
  brief text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hotspot_briefs TO anon;
GRANT SELECT, INSERT ON public.hotspot_briefs TO authenticated;
GRANT ALL ON public.hotspot_briefs TO service_role;
ALTER TABLE public.hotspot_briefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "briefs_public_read" ON public.hotspot_briefs FOR SELECT USING (true);
CREATE POLICY "briefs_auth_insert" ON public.hotspot_briefs FOR INSERT TO authenticated WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER reports_touch BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX reports_ward_idx ON public.reports(ward_id);
CREATE INDEX reports_created_idx ON public.reports(created_at DESC);

INSERT INTO public.wards (id, name, city, country, population, infra_score, grid_x, grid_y, lat, lng) VALUES
('IN-W01','Kothrud','Pune','IN',142000,4.2,0,0,18.5074,73.8077),
('IN-W02','Hadapsar','Pune','IN',198000,3.1,1,0,18.5089,73.9260),
('IN-W03','Shivajinagar','Pune','IN',96000,7.4,2,0,18.5308,73.8478),
('IN-W04','Yerawada','Pune','IN',175000,2.8,3,0,18.5510,73.8890),
('IN-W05','Kharadi','Pune','IN',124000,5.6,0,1,18.5515,73.9470),
('IN-W06','Warje','Pune','IN',88000,4.0,1,1,18.4790,73.8010),
('IN-W07','Katraj','Pune','IN',210000,3.4,2,1,18.4529,73.8600),
('IN-W08','Dhanori','Pune','IN',134000,3.9,3,1,18.5980,73.8990),
('IN-W09','Bibvewadi','Pune','IN',115000,4.8,0,2,18.4700,73.8620),
('IN-W10','Vishrantwadi','Pune','IN',102000,4.4,1,2,18.5750,73.8790),
('IN-W11','Aundh','Pune','IN',79000,8.1,2,2,18.5590,73.8070),
('IN-W12','Wagholi','Pune','IN',186000,2.4,3,2,18.5800,73.9800),
('BR-W01','Cidade Tiradentes','Sao Paulo','BR',210000,3.0,0,0,-23.5900,-46.4100),
('BR-W02','Capao Redondo','Sao Paulo','BR',270000,3.6,1,0,-23.6700,-46.7800),
('BR-W03','Pinheiros','Sao Paulo','BR',65000,8.4,2,0,-23.5670,-46.7020),
('BR-W04','Itaquera','Sao Paulo','BR',204000,4.1,3,0,-23.5400,-46.4600),
('BR-W05','Brasilandia','Sao Paulo','BR',264000,3.2,0,1,-23.4600,-46.6900),
('BR-W06','Santo Amaro','Sao Paulo','BR',71000,7.2,1,1,-23.6540,-46.7200),
('ZA-W01','Khayelitsha','Cape Town','ZA',391000,2.6,0,0,-34.0400,18.6800),
('ZA-W02','Mitchells Plain','Cape Town','ZA',310000,3.3,1,0,-34.0300,18.6100),
('ZA-W03','Claremont','Cape Town','ZA',58000,8.0,2,0,-33.9800,18.4650),
('ZA-W04','Langa','Cape Town','ZA',80000,3.8,3,0,-33.9450,18.5300),
('ZA-W05','Gugulethu','Cape Town','ZA',98000,3.1,0,1,-33.9800,18.5700),
('ZA-W06','Sea Point','Cape Town','ZA',42000,8.6,1,1,-33.9200,18.3860);

INSERT INTO public.reports (tracking_code, ward_id, lat, lng, category, urgency, sentiment, language, original_text, translated_text, summary, channel, status, created_at) VALUES
('JS-4A7K21','IN-W04',18.5512,73.8892,'water',5,'angry','hi','हमारे इलाके में पिछले चार दिन से पानी नहीं आ रहा है, टैंकर भी नहीं आया।','No water supply in our area for the past four days, no tanker either.','Four-day water outage with no tanker relief.','whatsapp','acknowledged', now() - interval '2 days'),
('JS-9B3M55','IN-W04',18.5495,73.8871,'water',4,'frustrated','mr','नळाला गढूळ पाणी येते, मुलं आजारी पडत आहेत.','Muddy water from the tap, children are falling ill.','Contaminated tap water causing illness.','web','submitted', now() - interval '1 day'),
('JS-2C8P10','IN-W04',18.5530,73.8905,'water',5,'angry','hi','चार दिन से नल सूखा है, पूरे मोहल्ले का हाल यही है।','Tap dry for four days, the whole neighbourhood is the same.','Neighbourhood-wide dry taps.','voice','submitted', now() - interval '20 hours'),
('JS-7D1Q34','IN-W04',18.5488,73.8850,'sanitation',3,'concerned','en','Garbage has not been collected from the lane behind the market for a week.','Garbage has not been collected from the lane behind the market for a week.','Uncollected garbage behind market lane.','web','submitted', now() - interval '3 days'),
('JS-5E6R78','IN-W07',18.4531,73.8602,'roads',5,'angry','mr','रस्त्यावर मोठे खड्डे, काल दुचाकीस्वार पडला.','Large potholes on the road, a two-wheeler rider fell yesterday.','Dangerous potholes causing accidents.','web','in_progress', now() - interval '5 days'),
('JS-1F2S90','IN-W07',18.4540,73.8615,'roads',4,'frustrated','hi','सड़क पूरी टूट गई है, बारिश में तालाब बन जाता है।','The road is completely broken, becomes a pond in the rain.','Broken road floods during rain.','whatsapp','in_progress', now() - interval '4 days'),
('JS-3G4T11','IN-W07',18.4519,73.8588,'roads',4,'angry','hi','गड्ढों की वजह से स्कूल बस नहीं आती।','School bus does not come because of the potholes.','Potholes blocking school bus route.','voice','submitted', now() - interval '2 days'),
('JS-8H5U22','IN-W07',18.4560,73.8630,'electricity',3,'neutral','en','Street lights on the main approach road have been off for two weeks.','Street lights on the main approach road have been off for two weeks.','Street lighting failure on approach road.','web','submitted', now() - interval '6 days'),
('JS-6I7V33','IN-W12',18.5802,73.9805,'sanitation',5,'angry','mr','उघड्या गटारामुळे डेंग्यूचे रुग्ण वाढले आहेत.','Open drains have increased dengue cases.','Open drains linked to dengue rise.','web','submitted', now() - interval '3 days'),
('JS-4J8W44','IN-W12',18.5790,73.9780,'sanitation',4,'frustrated','hi','कचरा गाड़ी दस दिन से नहीं आई।','The garbage truck has not come in ten days.','Ten days without garbage collection.','whatsapp','submitted', now() - interval '2 days'),
('JS-2K9X55','IN-W12',18.5815,73.9822,'water',4,'concerned','hi','बोरवेल सूख गया है, महिलाओं को दूर जाना पड़ता है।','The borewell has dried up, women have to walk far.','Dried borewell forcing long water walks.','voice','submitted', now() - interval '1 day'),
('JS-9L1Y66','IN-W12',18.5778,73.9769,'electricity',4,'frustrated','mr','रोज सहा तास वीज जाते, पाण्याचा पंप चालत नाही.','Six hours of power cuts daily, the water pump does not run.','Daily long power cuts stopping water pump.','web','acknowledged', now() - interval '4 days'),
('JS-7M2Z77','IN-W02',18.5091,73.9262,'electricity',5,'angry','hi','ट्रांसफार्मर से चिंगारी निकल रही है, हादसा हो सकता है।','Sparks coming from the transformer, an accident could happen.','Sparking transformer poses safety risk.','whatsapp','in_progress', now() - interval '1 day'),
('JS-5N3A88','IN-W02',18.5075,73.9240,'electricity',4,'concerned','en','Frequent voltage fluctuation has damaged appliances in our building.','Frequent voltage fluctuation has damaged appliances in our building.','Voltage fluctuation damaging appliances.','web','submitted', now() - interval '2 days'),
('JS-3O4B99','IN-W02',18.5099,73.9285,'roads',3,'neutral','mr','फुटपाथ तुटलेला आहे, ज्येष्ठ नागरिकांना त्रास होतो.','The footpath is broken, senior citizens face trouble.','Broken footpath obstructs pedestrians.','web','submitted', now() - interval '7 days'),
('JS-1P5C10','IN-W01',18.5076,73.8079,'sanitation',2,'neutral','en','Public toilet near the bus stop needs cleaning.','Public toilet near the bus stop needs cleaning.','Public toilet cleaning request.','web','resolved', now() - interval '9 days'),
('JS-8Q6D21','IN-W01',18.5060,73.8050,'water',3,'concerned','hi','सुबह सिर्फ आधा घंटा पानी आता है।','Water comes for only half an hour in the morning.','Very short daily water supply window.','voice','submitted', now() - interval '3 days'),
('JS-6R7E32','IN-W05',18.5517,73.9472,'roads',3,'frustrated','en','Construction debris dumped on the service road for a month.','Construction debris dumped on the service road for a month.','Debris blocking service road.','web','acknowledged', now() - interval '5 days'),
('JS-4S8F43','IN-W05',18.5500,73.9455,'water',2,'neutral','hi','पानी का बिल गलत आया है और नल में दबाव कम है।','Water bill is wrong and tap pressure is low.','Billing error and low water pressure.','web','submitted', now() - interval '6 days'),
('JS-2T9G54','IN-W08',18.5982,73.8992,'sanitation',4,'angry','mr','कचरा जाळल्याने धूर घरात येतो.','Smoke enters homes because garbage is burned.','Garbage burning causing smoke pollution.','whatsapp','submitted', now() - interval '2 days'),
('JS-9U1H65','IN-W08',18.5970,73.8975,'water',4,'frustrated','hi','पाइपलाइन लीक से सड़क पर पानी बह रहा है।','Water flowing on the road due to a pipeline leak.','Pipeline leak wasting water on road.','web','in_progress', now() - interval '3 days'),
('JS-7V2I76','IN-W10',18.5752,73.8792,'electricity',3,'neutral','en','Street light pole is leaning dangerously after the storm.','Street light pole is leaning dangerously after the storm.','Leaning street light pole after storm.','web','submitted', now() - interval '4 days'),
('JS-5W3J87','IN-W09',18.4702,73.8622,'roads',2,'neutral','mr','सिग्नल बंद असल्याने वाहतूक कोंडी होते.','Traffic jams because the signal is not working.','Non-functional traffic signal.','web','resolved', now() - interval '11 days'),
('JS-3X4K98','IN-W03',18.5310,73.8480,'sanitation',2,'neutral','en','Recycling bins near the park are overflowing on weekends.','Recycling bins near the park are overflowing on weekends.','Overflowing recycling bins on weekends.','web','submitted', now() - interval '8 days'),
('JS-1Y5L09','IN-W06',18.4792,73.8012,'water',3,'concerned','hi','टंकी की सफाई एक साल से नहीं हुई।','The water tank has not been cleaned for a year.','Water tank not cleaned in a year.','voice','submitted', now() - interval '5 days'),
('JS-8Z6M20','BR-W01',-23.5902,-46.4102,'water',5,'angry','pt','Estamos sem agua ha tres dias no conjunto habitacional.','No water for three days in the housing complex.','Three-day water outage in housing complex.','web','submitted', now() - interval '2 days'),
('JS-6A7N31','BR-W01',-23.5890,-46.4080,'sanitation',4,'frustrated','pt','Lixo acumulado na rua atrai ratos.','Garbage piled on the street attracts rats.','Garbage piles attracting rats.','whatsapp','submitted', now() - interval '1 day'),
('JS-4B8O42','BR-W05',-23.4602,-46.6902,'roads',4,'angry','pt','Buracos enormes na avenida principal.','Huge potholes on the main avenue.','Severe potholes on main avenue.','web','acknowledged', now() - interval '3 days'),
('JS-2C9P53','ZA-W01',-34.0402,18.6802,'sanitation',5,'angry','en','Communal taps and toilets are blocked and overflowing in our section.','Communal taps and toilets are blocked and overflowing in our section.','Blocked communal sanitation facilities.','web','submitted', now() - interval '1 day'),
('JS-9D1Q64','ZA-W01',-34.0380,18.6780,'electricity',5,'frustrated','en','Load shedding plus illegal connections caused a shack fire last week.','Load shedding plus illegal connections caused a shack fire last week.','Electrical fire risk from illegal connections.','whatsapp','in_progress', now() - interval '4 days'),
('JS-7E2R75','ZA-W05',-33.9802,18.5702,'water',4,'concerned','en','Burst pipe has been leaking on the corner for two weeks.','Burst pipe has been leaking on the corner for two weeks.','Two-week burst pipe leak.','web','submitted', now() - interval '2 days');