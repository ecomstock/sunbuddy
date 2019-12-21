import React, { Component } from 'react';
import './App.css';
import Card from '@material-ui/core/Card';

class App extends Component {

	conditions = {
		uv : "hour.uvIndex >= 1"
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
					// console.log(result);
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
		console.log(sunData);
		return sunData;
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
		this.simplifyHourlyData(hours, sunData);
	}

	simplifyHourlyData = (hourly, sunData) => {
		const simplified = hourly
			.map(hour => ({...hour, time: new Date(hour.time * 1000).toLocaleTimeString([], {timeStyle: "short"})}));
		console.log(simplified);
		this.displaySunData(sunData, null);
		this.filterForCondition(simplified, this.conditions.uv);
		//this.displayConditions(simplified, sunData, element, [uvData]);
	}

	displaySunData = (sunData, element) => {
		console.log(sunData.day);
	}

	filterForCondition = (data, condition) => { // ...conditions = uv >= 1
		const filtered = data
			.filter(hour => (eval(condition)));
		console.log(filtered);
		this.checkAllDay(data, filtered, "uv");
	}

	checkAllDay = (unfiltered, filtered, condition) => {
		console.log(unfiltered);
		if (filtered.length === unfiltered.length) {
			console.log("all day");
			// this.displayAllDay();
		} else {
			this.sortTimes(filtered);
		}
	}

	checkUntil = (unfiltered, filtered) => {
		const endOfDay = unfiltered[unfiltered.length-1].time;
		console.log(endOfDay);
		const startOfCondition = filtered[0].time;
		console.log(startOfCondition);
		const endOfCondition = filtered[filtered.length-1].time;
		console.log(endOfCondition);
		const current = unfiltered[0].time;
		console.log(current);
		if (current === startOfCondition) {
			// display "until"
			// this.findUntilTime();
		} else {

		}
	}

	sortTimes = (filtered) => {
		console.log(filtered);
		var start = filtered[0];
		var stop = start;
		var arrLength = filtered.length;
		var result = '';
		
		for (var i = 1; i < arrLength; i++) {   	
			
			if (filtered[i] === stop + 1) {
				stop = filtered[i];
			} else {
				if (start === stop) {
				result += start + ', ';            
				} else {
					result += start + '-' + stop + ', ';
				}
				// reset the start and stop pointers
				start = filtered[i];
				stop = start;
			}
		}

		if (start === stop) {
			result += start;            
		} else {
			result += start + '-' + stop;
		}
		console.log("works!")
		console.log(result);
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
