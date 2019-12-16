import React, { Component } from 'react';
import './App.css';
import Card from '@material-ui/core/Card';

class App extends Component {

	componentDidMount () {
		this.getNav();
	}

	getNav = () => navigator.geolocation.getCurrentPosition(this.getLatLon);

	getLatLon = position => {
		const latitude  = position.coords.latitude;
		const longitude = position.coords.longitude;
		// const latlon = [latitude, longitude];
		const latlon = [23, -110];
		this.getWeatherData(latlon);
		// this.getSunData(latlon);
	}
	
	getWeatherData = latlon => {
		console.log(latlon);
		const lat = latlon[0];
		const lon = latlon[1];
		const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/c9390ab45282a0eb042232d180560a3d/${lat},${lon}`;
		fetch(url)
			.then(res => res.json())
			.then(
				(result) => {
					this.distributeWeatherData(result);
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

	// getSunData = latlon => {
	// 	console.log(latlon);
	// 	const lat = latlon[0];
	// 	const lon = latlon[1];
	// 	const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/c9390ab45282a0eb042232d180560a3d/${lat},${lon}`;
	// 	fetch(url)
	// 	// const id = "75eeb11ea6d63fece113632a7e10d285";
	// 	// const url = `http://api.openweathermap.org/data/2.5/uvi/forecast?appid=${id}&lat=${lat}&lon=${lon}&cnt=1`
	// 	// fetch(url)
	// 		.then(res => res.json())
	// 		.then(
	// 			(result) => {
	// 				this.distributeSunData(result);
	// 			// this.setState({
	// 			// 	isLoaded: true,
	// 			// 	items: result.items
	// 			// });
	// 			},
	// 			// Note: it's important to handle errors here
	// 			// instead of a catch() block so that we don't swallow
	// 			// exceptions from actual bugs in components.
	// 			(error) => {
	// 			this.setState({
	// 				isLoaded: true,
	// 				error
	// 			});
	// 			}
	// 		)
	// }

	sortByDay = data => {
		const today = new Date().getDay();
		const tomorrow = (new Date().getDay() + 1);
		const todayData = data
			.filter(dataPoint => new Date(dataPoint.time * 1000).getDay() === tomorrow);
		const tomorrowData = data
			.filter(dataPoint => new Date(dataPoint.time * 1000).getDay() === tomorrow);
	}

	distributeWeatherData = data => {
		this.getExposureHours(data);
	}

	getExposureHours = data => {
		const hourly = data.hourly.data;
		const exposureHours = hourly
			.filter(dataPoint => dataPoint.uvIndex >= 2);
			
			// .map(dataPoint => {
			// 	const returnObj = {};
			// 	returnObj.time = new Date(dataPoint.time * 1000).toLocaleTimeString();
			// 	return returnObj;
			// });
		console.log(exposureHours);
		//return `${criticalUV[0].time} - ${criticalUV[criticalUV.length-1].time}`;
	}

	

	// getPrecipHours = data => {

	// }

	exposureTime = "Blah";

	element = (
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
	);

  	render = () => this.element;

}

export default App;
