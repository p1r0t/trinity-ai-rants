-- First, add the new source types to the check constraint
ALTER TABLE public.news_sources 
DROP CONSTRAINT IF EXISTS news_sources_source_type_check;

ALTER TABLE public.news_sources 
ADD CONSTRAINT news_sources_source_type_check 
CHECK (source_type IN ('rss', 'api', 'scraping', 'tech', 'world', 'business', 'russia', 'europe', 'asia', 'science'));

-- Now add the diverse news sources
INSERT INTO public.news_sources (name, source_type, url, is_active) VALUES
-- Technology & AI (Global)
('TechCrunch', 'tech', 'https://techcrunch.com', true),
('Wired', 'tech', 'https://www.wired.com', true),
('Ars Technica', 'tech', 'https://arstechnica.com', true),
('The Verge', 'tech', 'https://www.theverge.com', true),
('VentureBeat', 'tech', 'https://venturebeat.com', true),
('MIT Technology Review', 'tech', 'https://www.technologyreview.com', true),
('IEEE Spectrum', 'tech', 'https://spectrum.ieee.org', true),
('ZDNet', 'tech', 'https://www.zdnet.com', true),
('Engadget', 'tech', 'https://www.engadget.com', true),
('Gizmodo', 'tech', 'https://gizmodo.com', true),

-- Global News (English)
('BBC News', 'world', 'https://www.bbc.com/news', true),
('CNN', 'world', 'https://www.cnn.com', true),
('Reuters', 'world', 'https://www.reuters.com', true),
('Associated Press', 'world', 'https://apnews.com', true),
('The Guardian', 'world', 'https://www.theguardian.com', true),
('Financial Times', 'business', 'https://www.ft.com', true),
('Wall Street Journal', 'business', 'https://www.wsj.com', true),
('Bloomberg', 'business', 'https://www.bloomberg.com', true),
('New York Times', 'world', 'https://www.nytimes.com', true),
('Washington Post', 'world', 'https://www.washingtonpost.com', true),

-- Russian News
('РИА Новости', 'russia', 'https://ria.ru', true),
('ТАСС', 'russia', 'https://tass.ru', true),
('RT на русском', 'russia', 'https://russian.rt.com', true),
('Интерфакс', 'russia', 'https://www.interfax.ru', true),
('Коммерсант', 'russia', 'https://www.kommersant.ru', true),
('Ведомости', 'russia', 'https://www.vedomosti.ru', true),
('Газета.Ru', 'russia', 'https://www.gazeta.ru', true),
('РБК', 'russia', 'https://www.rbc.ru', true),
('Лента.Ру', 'russia', 'https://lenta.ru', true),

-- European News
('Der Spiegel', 'europe', 'https://www.spiegel.de', true),
('Le Monde', 'europe', 'https://www.lemonde.fr', true),
('El País', 'europe', 'https://elpais.com', true),
('La Repubblica', 'europe', 'https://www.repubblica.it', true),
('The Times', 'europe', 'https://www.thetimes.co.uk', true),
('Frankfurter Allgemeine', 'europe', 'https://www.faz.net', true),
('Le Figaro', 'europe', 'https://www.lefigaro.fr', true),

-- Asian News
('NHK World', 'asia', 'https://www3.nhk.or.jp/nhkworld', true),
('South China Morning Post', 'asia', 'https://www.scmp.com', true),
('The Japan Times', 'asia', 'https://www.japantimes.co.jp', true),
('Times of India', 'asia', 'https://timesofindia.indiatimes.com', true),
('China Daily', 'asia', 'https://www.chinadaily.com.cn', true),
('Korea Herald', 'asia', 'https://www.koreaherald.com', true),

-- Scientific & Research
('Nature', 'science', 'https://www.nature.com', true),
('Science Magazine', 'science', 'https://www.science.org', true),
('Scientific American', 'science', 'https://www.scientificamerican.com', true),
('New Scientist', 'science', 'https://www.newscientist.com', true),
('Phys.org', 'science', 'https://phys.org', true),

-- Business & Finance
('CNBC', 'business', 'https://www.cnbc.com', true),
('MarketWatch', 'business', 'https://www.marketwatch.com', true),
('Forbes', 'business', 'https://www.forbes.com', true),
('Fortune', 'business', 'https://fortune.com', true),
('Harvard Business Review', 'business', 'https://hbr.org', true),

-- Additional Specialized Tech
('AnandTech', 'tech', 'https://www.anandtech.com', true),
('TechRadar', 'tech', 'https://www.techradar.com', true),
('Digital Trends', 'tech', 'https://www.digitaltrends.com', true),
('PCMag', 'tech', 'https://www.pcmag.com', true),
('Tom''s Hardware', 'tech', 'https://www.tomshardware.com', true),
('Hacker News', 'tech', 'https://news.ycombinator.com', true),
('Slashdot', 'tech', 'https://slashdot.org', true),

-- Additional International
('Al Jazeera', 'world', 'https://www.aljazeera.com', true),
('Deutsche Welle', 'world', 'https://www.dw.com', true),
('France 24', 'world', 'https://www.france24.com', true),
('Euronews', 'world', 'https://www.euronews.com', true);