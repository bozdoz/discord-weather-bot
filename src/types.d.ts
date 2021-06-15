// some types for a javascript library :D

/**
 * Weather API (weatherapi.com) Response
 * https://www.weatherapi.com/api-explorer.aspx
 */

interface ForecastHour {
	last_updated_epoch?: number;
	last_updated?: string;
	time_epoch?: number;
	time?: string;
	temp_c: number;
	temp_f: number;
	is_day: 0 | 1;
	condition: {
		text: string;
		icon: string;
		code: number;
	};
	wind_mph: number;
	wind_kph: number;
	wind_degree: number;
	humidity: number;
	cloud: number;
	feelslike_c: number;
	feelslike_f: number;
	will_it_rain: 0 | 1;
	chance_of_rain: string;
	will_it_snow: 0 | 1;
	chance_of_snow: string;
	uv: number;
}

interface ForecastDay {
	date: string;
	date_epoch: number;
	day: {};
	astro: {};
	hour: ForecastHour[];
}

/**
 * Weather API (weatherapi.com) Response
 * https://www.weatherapi.com/api-explorer.aspx
 */
export interface WeatherAPIResponse {
	location: {
		name: string;
		region: string;
		country: string;
		lat: number;
		lon: number;
		tz_id: string;
		localtime_epoch: number;
		localtime: number;
	};
	current: ForecastHour;
	forecast: {
		forecastday: ForecastDay[];
	};
}
