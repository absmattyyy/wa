const axios = require('axios');

class LocalInfoService {
    async getInfo(location) {
        try {
            const weatherResponse = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}`);
            const newsResponse = await axios.get(`https://newsapi.org/v2/top-headlines?country=de&apiKey=${process.env.NEWS_API_KEY}`);
            const eventsResponse = await axios.get(`https://api.predicthq.com/v1/events/?location=${location}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.PREDICTHQ_API_KEY}`
                }
            });

            return {
                weather: weatherResponse.data,
                news: newsResponse.data.articles,
                events: eventsResponse.data.results
            };
        } catch (error) {
            console.error('Error fetching local info:', error);
            return {
                weather: "N/A",
                news: [],
                events: []
            };
        }
    }
}

module.exports = new LocalInfoService();