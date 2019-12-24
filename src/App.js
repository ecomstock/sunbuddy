import React, { Component } from 'react';
import './App.css';
import Icon from '@mdi/react'
import { 
	mdiWhiteBalanceSunny,
	mdiUmbrella,
	mdiRunFast,
	mdiWeatherSunnyAlert
} from '@mdi/js'
import Card from '@material-ui/core/Card';

class App extends Component {

	state = {};

	conditions = {
		uv     : "hour.uvIndex >= 1", 
		precip : "hour.precipIntensity >= 0.015 && hour.precipProbability < 1",
		temp   : "hour.apparentTemperature < 70 && hour.apparentTemperature > 32"
		//precip : "hour.precipIntensity >= 0.015 && hour.precipProbability >= 0.20"
	}

	componentDidMount () {
		this.getNav();
		console.log("ready");
	}

	getNav = () => navigator.geolocation.getCurrentPosition(this.getLatLon);

	getLatLon = position => {
		const coords = {};
		coords.latitude  = position.coords.latitude;
		coords.longitude = position.coords.longitude;
		this.getWeatherData(coords);
	}
	
	getWeatherData = coords => {
		// const lat = coords.latitude;
		// const lon = coords.longitude;
		const lat = 48;
		const lon = -122; 
		const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/c9390ab45282a0eb042232d180560a3d/${lat},${lon}`;
		fetch(url)
			.then(res => res.json())
			.then(
				(result) => {
					console.log(result);
					this.getHourlyData(coords, result);
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
		const SunCalc = require("suncalc");
		const lat = coords.latitude;
		const lon = coords.longitude;
		const today = new Date();
		const todayData = SunCalc.getTimes(today, lat, lon);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		const tomorrowData = SunCalc.getTimes(tomorrow, lat, lon);
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

	displaySunData = (sunData) => {
		this.setState({day:sunData.day});
		console.log(this.state);
	}

	getHourlyData = (coords, data) => {
		const sunData = this.getSunData(coords);
		const hourly = data.hourly.data;
		this.filterHoursByDay(hourly, sunData);
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
			// this.displayAllDay();
			this.getFilteredTimes(filtered, field); // don't forget to take this out
		} else {
			this.getFilteredTimes(filtered, field);
		}
	}

	getFilteredTimes = (data, field) => {
		const times = data
			.map(hour => hour.time);
		this.sortTimes(times, field);
	}

	sortTimes = (times, field) => {
		console.log(times);
		const now = new Date().getHours();
		let earliest = times[0];
		let latest = earliest; // assume singleton
		let length = times.length;
		let result = "";
		
		for (let i = 1; i < length; i++) { // start loop at 2nd time, end at penultimate
			
			if (times[i] === latest + 1) { // if next time is one greater than "latest",
				latest = times[i]; // increment latest
			} else {
				if (earliest === latest) { // must be a singleton
					let convertEarliest = this.convertTime(earliest);
					result += convertEarliest + ', '; // print and break for singleton  
				} else { // must be end of span
					let convertEarliest = this.convertTime(earliest);
					let convertLatest = this.convertTime(latest);
					result += convertEarliest + '-' + convertLatest + ', '; // print and break for span
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
			let convertEarliest = this.convertTime(earliest);
			let convertLatest = this.convertTime(latest);
			result += convertEarliest + '-' + convertLatest; // print final span
		}
		//const stateObj = ;

		console.log("works!")
		console.log(result);
		this.setState({[field]:result});
		console.log(this.state);
		// if (earliest === now) {
		// 	console.log(`Until ${times[times.length - 1] + 1}`);
		// }
	}

	convertTime = time => {
		const amPm = time >= 12 ? "pm" : "am";
		const converted = (time % 12) || 12;
		const timeString = `${converted}:00 ${amPm}`;
		return timeString;
	}

	exposureTime = "Blah";

	render() {
		return(
			<div className="container">
				<Card className="card">
					<div className="content">
						<img src="https://via.placeholder.com/75" />
						<p className="text-large">Portland</p>
						<p>{this.state.day}</p>
						<div className="sub-container">
							<p>32</p>
							<p className="text-large">40</p>
							<p>42</p>
						</div>
						<div className="sub-container">
							<Icon path={mdiWhiteBalanceSunny}
								title="white-balance-sunny"
								size={1}
								color="red"
							/>
							<p>{this.state.sunTime}</p>
						</div>
						<div className="sub-container">
							<Icon path={mdiWeatherSunnyAlert}
								title="User Profile"
								size={1}
								color="red"
							/>
							<p>{this.state.exposureTime}</p>
						</div>
						<div className="sub-container">
							<Icon path={mdiUmbrella}
								title="User Profile"
								size={1}
								color="red"
							/>
							<p>{this.state.precipTime}</p>
						</div>
						<div className="sub-container">
							<Icon path={mdiRunFast}
								title="User Profile"
								size={1}
								color="red"
							/>
							<p>{this.state.tempTime}</p>
						</div>
					</div>
				</Card>
			</div>
		);
	}
	
}

export default App;
