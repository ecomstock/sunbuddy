import React, { Component } from 'react';
import './App.css';
import Card from '@material-ui/core/Card';

class App extends Component {

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
			sunData.day = today;
			sunData.dawn = todayData.dawn;
			sunData.dusk = todayData.dusk;
		} else {
			sunData.day = tomorrow;
			sunData.dawn = tomorrowData.dawn;
			sunData.dusk = tomorrowData.dusk;
		}
		return sunData;
	}

	getHourlyData = (coords, data) => {
		console.log(data);
		const sunData = this.getSunData(coords);
		const hourly = data.hourly.data;
		this.filterHourlyData(hourly, sunData);
	}

	sortByDay = data => {
		const today = new Date().getDay();
		const tomorrow = (new Date().getDay() + 1);
		const todayData = data
			.filter(dataPoint => new Date(dataPoint.time * 1000).getDay() === tomorrow);
		const tomorrowData = data
			.filter(dataPoint => new Date(dataPoint.time * 1000).getDay() === tomorrow);
	}

	filterHourlyData = (hourly, sunData) => {
		const day = sunData.day.getDay();
		console.log(day);
		const hour = hourly[0].time * 1000;
		const hours = hourly
			.filter(hour => new Date(hour.time * 1000).getDay() === day);
		console.log(hours);
	}

	getExposureHours = data => {
		const hourly = data.hourly.data;
		const exposureHours = hourly
			.filter(dataPoint => dataPoint.uvIndex >= 1);
			
			// .map(dataPoint => {
			// 	const returnObj = {};
			// 	returnObj.time = new Date(dataPoint.time * 1000).toLocaleTimeString();
			// 	return returnObj;
			// });
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
