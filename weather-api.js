const fetch = require("node-fetch");

const KEY = process.env.WEATHER_KEY;
const BASE_URL = `https://api.weatherapi.com/v1/forecast.json?key=${KEY}&aqi=no`;

class WeatherAPI {
	/**
	 * Get weather for city
	 * @param {string} q
	 * @returns {import("./types").WeatherAPIResponse} weather api response
	 */
	async query(q) {
		const url = `${BASE_URL}&q=${q}&days=3&alerts=no`;
		const resp = await fetch(url);
		/** @type {import("./types").WeatherAPIResponse} */
		const json = await resp.json();

		return json;
	}
}

module.exports = WeatherAPI;
