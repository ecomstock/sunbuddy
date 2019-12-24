import React, { Component } from 'react';
import Condition from './Condition';
import './App.css';
import { 
	mdiWhiteBalanceSunny,
	mdiUmbrella,
	mdiRunFast,
	mdiSunglasses
} from '@mdi/js'
import Card from '@material-ui/core/Card';

class App extends Component {

	state = {};

	conditions = {
		uv     : "hour.uvIndex >= 1", 
		temp   : "hour.apparentTemperature < 70 && hour.apparentTemperature > 32",
		precip : "hour.precipIntensity >= 0.015 && hour.precipProbability >= 0.20"
	}

	componentDidMount () {
		this.getNav();
	}

	getNav = () => navigator.geolocation.getCurrentPosition(this.getLatLon);

	getLatLon = position => {
		const coords = {};
		coords.latitude  = position.coords.latitude;
		coords.longitude = position.coords.longitude;
		this.getWeatherData(coords);
		this.getCity(coords);
	}

	getCity = coords => {
		const lat = coords.latitude;
		const lon = coords.longitude; 
		// const lat = 1.35;
		// const lon = 103.82;
		const url = `https://geocodeapi.p.rapidapi.com/GetLargestCities?latitude=${lat}&longitude=${lon}&range=50000`
		fetch(url, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "geocodeapi.p.rapidapi.com",
				"x-rapidapi-key": "G0GBgJ6WYSmshKfgZydJ6iBoKrThp11fTNTjsnljvjz33JtipZ"
			}
		})
		.then(response => response.json())
		.then(result => {
			console.log(result);
			const city = result[0].City;
			this.setState({city:city});
		})
		// .catch(err => {
		// 	console.log(err);
		// });
	}
	
	getWeatherData = coords => {
		const lat = coords.latitude;
		const lon = coords.longitude;
		// const lat = 1.35;
		// const lon = 103.82;
		const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/c9390ab45282a0eb042232d180560a3d/${lat},${lon}`;
		fetch(url)
			.then(res => res.json())
			.then(
				(result) => {
					console.log(result);
					this.exportData(coords, result);
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
				(error) => {
				this.setState({
					isLoaded: true,
					error
				});
				}
			)
	}

	getSunData = (coords) => {
		const sunCalc = require("suncalc");
		const lat = coords.latitude;
		const lon = coords.longitude;
		const today = new Date();
		const todayData = sunCalc.getTimes(today, lat, lon);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		const tomorrowData = sunCalc.getTimes(tomorrow, lat, lon);
		const dusk = todayData.dusk;
		const sunData = {};
		if (today < dusk) {
			sunData.day = "today";
			sunData.date = today;
			sunData.dawn = todayData.dawn;
			sunData.dusk = todayData.dusk;
		} else {
			sunData.day = "tomorrow";
			sunData.date = tomorrow;
			sunData.dawn = tomorrowData.dawn;
			sunData.dusk = tomorrowData.dusk;
		}
		this.displaySunData(sunData, null);
		return sunData;
	}

	displaySunData = sunData => {
		const dawn = new Date(sunData.dawn).toLocaleTimeString([], {timeStyle: "short"});
		const dusk = new Date(sunData.dusk).toLocaleTimeString([], {timeStyle: "short"});
		this.setState({
			day:sunData.day,
			sunTime:`${dawn}-${dusk}`
		});
	}

	exportData = (coords, data) => {
		const sunData = this.getSunData(coords);
		const current = data.currently;
		const today = data.daily.data[0];
		const hourly = data.hourly.data;
		this.displayCurrent(current);
		this.displayToday(today);
		this.filterHoursByDay(hourly, sunData);
	}

	displayCurrent = current => this.setState({currentTemp:Math.round(current.temperature)});

	displayToday = today => {
		this.setState({
			lowTemp:Math.round(today.temperatureLow),
			highTemp:Math.round(today.temperatureHigh)
		});
	}

	filterHoursByDay = (hourly, sunData) => {
		const date = sunData.date.getDay();
		const hours = hourly
			.filter(hour => new Date(hour.time * 1000).getDay() === date);
		this.getReadableTime(hours, sunData);
	}

	getReadableTime = hourly => {
		const readable = hourly
			.map(hour => ({...hour, time: new Date(hour.time * 1000).getHours()}));
		console.log(readable);
		this.filterForCondition(readable, this.conditions.uv, "exposureTime");
		this.filterForCondition(readable, this.conditions.precip, "precipTime");
		this.filterForCondition(readable, this.conditions.temp, "tempTime");
	}

	filterForCondition = (data, condition, field) => {
		const filtered = data
			.filter(hour => (eval(condition)));
		// console.log(filtered);
		this.checkAllDay(data, filtered, field);
	}

	checkAllDay = (unfiltered, filtered, field) => {
		if (filtered.length === unfiltered.length) {
			console.log("all day");
			this.displayAllDay(field);
			//this.getFilteredTimes(filtered, field); // don't forget to take this out
		} else {
			this.getFilteredTimes(filtered, field);
		}
	}

	displayAllDay = field => {
		this.setState({[field]:"All day"});
	}

	getFilteredTimes = (data, field) => {
		const times = data
			.map(hour => hour.time);
		this.sortTimes(times, field);
	}

	sortTimes = (times, field) => {
		if (times.length === 0) return;
		const now = new Date().getHours();
		const endOfCurrentHour = now + 1;
		let earliest = times[0];
		let latest = earliest; // assume singleton
		let length = times.length;
		let result = "";
		let convertEarliest = "";
		
		for (let i = 1; i < length; i++) { // start loop at 2nd time, end at penultimate
			
			if (times[i] === latest + 1) { // if next time is one greater than "latest",
				latest = times[i]; // increment latest
			} else {
				
				if (earliest === latest) { // must be a singleton
					if (earliest === now) {
						let convertEndOfCurrentHour = this.convertTime(endOfCurrentHour);
						convertEarliest = `Until ${convertEndOfCurrentHour}`;
					} else {
						convertEarliest = this.convertTime(earliest);
					}
					result += convertEarliest + ', '; // print and break for singleton  
				} else { // must be end of span
					if (earliest === now) {
						convertEarliest = `Until `;
					} else {
						convertEarliest = `${this.convertTime(earliest)}-`
					}
					console.log(`earliest: ${convertEarliest}`);
					//let convertEarliest = ;
					let convertLatest = this.convertTime(latest);
					result += convertEarliest + convertLatest + ', '; // print and break for span
				}
				// begin new group
				earliest = times[i];
				latest = earliest;
			}
		}

		if (earliest === latest) {
			let convertEarliest = this.convertTime(earliest);
			result += convertEarliest; // print final singleton            
		} else {
			if (earliest === now) {
				convertEarliest = `Until `;
			} else {
				convertEarliest = `${this.convertTime(earliest)}-`
			}
			console.log(`earliest: ${convertEarliest}`);
			//let convertEarliest = ;
			let convertLatest = this.convertTime(latest);
			result += convertEarliest + convertLatest; // print final span
		}
		this.setState({[field]:result});
		// if (earliest === now) {
		// 	console.log(`Until ${times[times.length - 1] + 1}`);
		// }
	}

	convertTime = time => {
		const amPm = time >= 12 ? "PM" : "AM";
		const converted = (time % 12) || 12;
		const timeString = `${converted}:00 ${amPm}`;
		return timeString;
	}

	render() {
		return(
			<div className="container">
				<Card className="card">
					<div className="content">
						<img src="https://via.placeholder.com/75" />
						<p className="text-large">{this.state.city}</p>
						<p>{this.state.day}</p>
						<div id="temperature">
							<p id="low-temp">{this.state.lowTemp}</p>
							<p id="current-temp" className="text-large">{this.state.currentTemp}</p>
							<p id="high-temp">{this.state.highTemp}</p>
						</div>
						<Condition 
							iconName={mdiWhiteBalanceSunny}
							iconTitle={"sunlight"}
							iconSize={1}
							iconColor={"black"}
							conditionTime={this.state.sunTime}
						/>
						<Condition 
							iconName={mdiSunglasses}
							iconTitle={"high-uv"}
							iconSize={1}
							iconColor={"black"}
							conditionTime={this.state.exposureTime}
						/>
						<Condition 
							iconName={mdiUmbrella}
							iconTitle={"precipitation"}
							iconSize={1}
							iconColor={"black"}
							conditionTime={this.state.precipTime}
						/>
						<Condition 
							iconName={mdiRunFast}
							iconTitle={"workout"}
							iconSize={1}
							iconColor={"black"}
							conditionTime={this.state.tempTime}
						/>
					</div>
				</Card>
			</div>
		);
	}
	
}

export default App;
