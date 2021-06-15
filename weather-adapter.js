const Discord = require("discord.js");
const WeatherAPI = require("./weather-api");
const formatDate = require("./formatDate");

class WeatherAdapter {
	/**
	 * @param {string} q  maybe a city
	 */
	async get(q) {
		const resp = await new WeatherAPI().query(q);

		const { location } = resp;

		const embed = new Discord.MessageEmbed().setTitle(
			`${location.name} ${location.region}`
		);

		// get three time periods
		const periods = 3;
		const outputs = [];

		// getting localtime from api because of timezone madness
		let currentHour = Number(location.localtime.match(/\s(\d+):/)[1]);
		let currentDay = 0;
		const { forecastday } = resp.forecast;

		do {
			const {
				condition: { text },
				temp_c,
				chance_of_rain,
				time,
			} = forecastday[currentDay].hour[currentHour];

			outputs.push({
				chance_of_rain,
				temp_c,
				condition: text,
				time,
			});

			currentHour = (currentHour + 6) % 24;
			if (currentHour < 6) {
				currentDay += 1;
			}
		} while (outputs.length < periods);

		for (const { time, condition, temp_c, chance_of_rain } of outputs) {
			embed.addField(
				formatDate(time),
				`${condition}
	temp: ${Math.round(temp_c)}°C
	precipitation: ${chance_of_rain}%`
			);
		}

		embed.addField(
			"Powered by",
			"[WeatherAPI.com](https://www.weatherapi.com/)"
		);

		return embed;
	}
}

module.exports = WeatherAdapter;
