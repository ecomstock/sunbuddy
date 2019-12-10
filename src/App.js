import React, { Component } from 'react';
import './App.css';
import Card from '@material-ui/core/Card';

class App extends Component {

	componentDidMount () {
		console.log("loaded");
		this.getNav();
	}

	getLatLon = position => {
		console.log("nav success");
		const latitude  = position.coords.latitude;
		const longitude = position.coords.longitude;
		const latlon = [latitude, longitude];
	}

	getNav = () => navigator.geolocation.getCurrentPosition(this.getLatLon);
	

	runFetch (latlon) {
		const latitude = latlon[0];
		const longitude = latlon[1];
		fetch("https://api.example.com/items")
			.then(res => res.json())
			.then(
				(result) => {
				this.setState({
					isLoaded: true,
					items: result.items
				});
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
