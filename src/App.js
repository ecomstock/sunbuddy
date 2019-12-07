import React, { Component } from 'react';
import './App.css';
import Card from '@material-ui/core/Card';

class App extends Component {

  	render() {
		return (
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
  	}
}

export default App;
