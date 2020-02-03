import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import WbCloudyIcon from '@material-ui/icons/WbCloudy';
import WarningIcon from '@material-ui/icons/Warning';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
            Sunbuddy
        </Link>{' '}
        {new Date().getFullYear()}
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
    },
    image: {
        //backgroundImage: 'url(https://source.unsplash.com/J0wKylnjtNo)',
        backgroundImage: 'url(https://source.unsplash.com/AtfA8NDgpKA)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
}));

export default function App() {
    const classes = useStyles();

    const conditions = {
		uv     : "hour.uvIndex >= 4", 
		temp   : "hour.apparentTemperature < 70 && hour.apparentTemperature > 32",
		precip : "hour.precipIntensity >= 0.015 && hour.precipProbability >= 0.20"
    }
    
    const [city, setCity] = useState();
    const [currentTemp, setCurrentTemp] = useState();

    useEffect(() => {
        getNav();
    });

    const getNav = () => navigator.geolocation.getCurrentPosition(getLatLon);

    const getLatLon = position => {
		const coords = {};
		coords.latitude  = position.coords.latitude;
		coords.longitude = position.coords.longitude;
		// coords.latitude  = 1;
        // coords.longitude = 104;
        getCity(coords);
		getWeatherData(coords);
    }
    
    const getCity = coords => {
		const lat = coords.latitude;
		const lon = coords.longitude; 
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
            const city = result[0].City;
            setCity(city);
		})
		// .catch(err => {
		// 	console.log(err);
		// });
	}
	
	const getWeatherData = coords => {
		const lat = coords.latitude;
		const lon = coords.longitude;
		const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/c9390ab45282a0eb042232d180560a3d/${lat},${lon}`;
		fetch(url)
			.then(res => res.json())
			.then(
				(result) => {
					console.log(result);
					exportData(coords, result);
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
				// (error) => {
				// this.setState({
				// 	isLoaded: true,
				// 	error
				// });
				// }
			)
    }
    
    const exportData = (coords, data) => {
		//const sunData = getSunData(coords);
		const currentTemp = Math.round(data.currently.temperature);
		const today = data.daily.data[0];
		const hourly = data.hourly.data;
		displayCurrent(currentTemp);
		//displayToday(today);
		//filterHoursByDay(hourly, sunData);
    }
    
    // const getSunData = coords => {
	// 	const sunCalc = require("suncalc");
	// 	const lat = coords.latitude;
	// 	const lon = coords.longitude;
	// 	console.log(`lat: ${lat}`);
	// 	const today = new Date();
	// 	const todayData = sunCalc.getTimes(today, lat, lon);
	// 	console.log(todayData);
	// 	const tomorrow = new Date(today);
	// 	tomorrow.setDate(tomorrow.getDate() + 1);
	// 	const tomorrowData = sunCalc.getTimes(tomorrow, lat, lon);
	// 	const dusk = todayData.dusk;
	// 	const sunData = {};
	// 	if (today < dusk) {
	// 		sunData.day = "today";
	// 		sunData.date = today;
	// 		sunData.dawn = todayData.dawn;
	// 		sunData.dusk = todayData.dusk;
	// 	} else {
	// 		sunData.day = "tomorrow";
	// 		sunData.date = tomorrow;
	// 		sunData.dawn = tomorrowData.dawn;
	// 		sunData.dusk = tomorrowData.dusk;
	// 	}
	// 	displaySunData(sunData);
	// 	return sunData;
    // }
    
    const displayCurrent = currentTemp => setCurrentTemp(currentTemp);

    // const displayToday = today => {
	// 	this.setState({
	// 		lowTemp:Math.round(today.temperatureMin),
	// 		highTemp:Math.round(today.temperatureMax)
	// 	});
    // }
    
    // const filterHoursByDay = (hourly, sunData) => {
	// 	const date = sunData.date.getDay();
	// 	const hours = hourly
	// 		.filter(hour => new Date(hour.time * 1000).getDay() === date);
	// 	this.getReadableTime(hours, sunData);
    // }
    
    // const displaySunData = sunData => {
	// 	console.log(sunData);
	// 	const dawn = new Date(sunData.dawn).toLocaleTimeString([], {timeStyle: "short"});
	// 	const dusk = new Date(sunData.dusk).toLocaleTimeString([], {timeStyle: "short"});
	// 	this.setState({
	// 		day:sunData.day,
	// 		sunTime:`${dawn}-${dusk}`
	// 	});
	// }

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Typography>SUNBUDDY</Typography>
                    <Typography>{city}</Typography>
                    <Box item>
                        <Grid container spacing={1}>
                            <Grid item>
                                <Typography color="primary">32</Typography>
                            </Grid>
                            <Grid item>
                                <Typography>{currentTemp}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography color="error">41</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <List>
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar>
                                <WbSunnyIcon />
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="10:00-6:00" secondary="Daylight hours" />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar>
                                <WbCloudyIcon />
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="10:00-6:00" secondary="Precipitation is expected" />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar>
                                <WarningIcon />
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="10:00-6:00" secondary="High UV &mdash; sunscreen is advisable" />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar>
                                <DirectionsRunIcon />
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="10:00-6:00" secondary="Ideal temperature for outdoor exercise" />
                        </ListItem>
                    </List>
                    <Box mt={8}>
                        <Copyright />
                    </Box>
                </div>
            </Grid>
        </Grid>
    );
}