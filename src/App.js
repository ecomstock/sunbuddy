import React, { Component } from 'react';
import './App.css';
import Card from '@material-ui/core/Card';

class App extends Component {

	conditions = {
		uv     : "hour.uvIndex >= 0", 
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
		// console.log(coords);
		const lat = coords.latitude;
		const lon = coords.longitude;
		const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/c9390ab45282a0eb042232d180560a3d/${lat},${lon}`;
		fetch(url)
			.then(res => res.json())
			.then(
				(result) => {
					//console.log(result);
					this.getHourlyData(coords, result);
				// this.setState({
				// 	isLoaded: true,
				// 	items: result.items
				// });
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

	displaySunData = (sunData, element) => {
		// console.log(sunData);
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
		this.filterForCondition(readable, this.conditions.temp);
	}

	filterForCondition = (data, condition) => {
		const filtered = data
			.filter(hour => (eval(condition)));
		// console.log(filtered);
		this.checkAllDay(data, filtered);
	}

	checkAllDay = (unfiltered, filtered) => {
		if (filtered.length === unfiltered.length) {
			console.log("all day");
			// this.displayAllDay();
			this.getFilteredTimes(filtered); // don't forget to take this out
		} else {
			this.getFilteredTimes(filtered);
		}
	}

	getFilteredTimes = data => {
		const times = data
			.map(hour => hour.time);
		this.sortTimes(times);
	}

	// checkUntil = (unfiltered, filtered) => {
	// 	const endOfDay = unfiltered[unfiltered.length-1].time;
	// 	console.log(endOfDay);
	// 	const startOfCondition = filtered[0].time;
	// 	console.log(startOfCondition);
	// 	const endOfCondition = filtered[filtered.length-1].time;
	// 	console.log(endOfCondition);
	// 	const current = unfiltered[0].time;
	// 	console.log(current);
	// 	if (current === startOfCondition) {
	// 		// display "until"
	// 		// this.findUntilTime();
	// 	} else {

	// 	}
	// }

	sortTimes = (times) => {
		console.log(times);
		const now = new Date().getHours();
		let earliest = times[0];
		let latest = earliest; // assume singleton
		let length = times.length;
		let result = "";
		
		for (let i = 1; i < length; i++) { // start loop at 2nd time, end at penultimate
			
			if (times[i] === latest + 1) { // if next time is one more than "latest",
				latest = times[i]; // increment latest
			} else {
				if (earliest === latest) { // must be a singleton
				result += earliest + ', '; // print and break for singleton  
				} else { // must be end of span
					result += earliest + '-' + latest + ', '; // print and break for span
				}
				// begin new group
				earliest = times[i];
				latest = earliest;
			}
		}

		if (earliest === latest) {
			result += earliest; // print final singleton            
		} else {
			result += earliest + '-' + latest; // print final span
		}

		console.log("works!")
		console.log(result);
		// if (earliest === now) {
		// 	console.log(`Until ${times[times.length - 1] + 1}`);
		// }
	}

	exposureTime = "Blah";

	element = (
		<div className="container">
			<Card className="card">
				<div className="content">
					<img src="https://via.placeholder.com/75" />
					<p className="text-large">Portland</p>
					<p>today</p>
					<div className="sub-container">
						<p>32</p>
						<p className="text-large">40</p>
						<p>42</p>
					</div>
					<div className="sub-container">
						<img src="https://via.placeholder.com/25" />
						<p>{this.exposureTime}</p>
					</div>
					<div className="sub-container">
						<img src="https://via.placeholder.com/25" />
						<p>7:10 am - 5:03 pm</p>
					</div>
					<div className="sub-container">
						<img src="https://via.placeholder.com/25" />
						<p>7:10 am - 5:03 pm</p>
					</div>
					<div className="sub-container">
						<img src="https://via.placeholder.com/25" />
						<p>7:10 am - 5:03 pm</p>
					</div>
				</div>
			</Card>
		</div>
	);

  	render = () => this.element;

}

export default App;
