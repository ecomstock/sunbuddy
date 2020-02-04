import React, { useState, useEffect } from 'react';
import Fade from '@material-ui/core/Fade';
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
        <Link color="inherit" href="">
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
        margin: theme.spacing(6, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    black: {
        fontWeight: 900,
    },
    light: {
        fontWeight: 300,
    },
    thin: {
        fontWeight: 100,
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
    const [minTemp, setMinTemp] = useState();
    const [maxTemp, setMaxTemp] = useState();
    const [day, getDay] = useState();
    const [daylightHours, setDaylightHours] = useState();
    const [exposureTime, setExposureTime] = useState();
    const [precipTime, setPrecipTime] = useState();
    const [tempTime, setTempTime] = useState();

    useEffect(() => {
        getNav();
    });

    const getNav = () => navigator.geolocation.getCurrentPosition(getLatLon);

    const getLatLon = position => {
		const coords = {};
		coords.latitude  = position.coords.latitude;
		coords.longitude = position.coords.longitude;
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
                    exportData(coords, result);
                    console.log(result);
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
		const sunData = getSunData(coords);
		const currentTemp = Math.round(data.currently.temperature);
		const today = data.daily.data[0];
		const hourly = data.hourly.data;
		displayCurrent(currentTemp);
		displayHiLo(today);
		filterHoursByDay(hourly, sunData);
    }
    
    const getSunData = coords => {
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
		displaySunData(sunData);
		return sunData;
    }
    
    const displayCurrent = currentTemp => setCurrentTemp(currentTemp);

    const displayHiLo = today => {
        const minTemp = Math.round(today.temperatureMin)
        const maxTemp = Math.round(today.temperatureMax)
        setMinTemp(minTemp);
        setMaxTemp(maxTemp);
    }
    
    const filterHoursByDay = (hourly, sunData) => {
		const date = sunData.date.getDay();
		const hours = hourly
			.filter(hour => new Date(hour.time * 1000).getDay() === date);
		getReadableTime(hours, sunData);
    }
    
    const displaySunData = sunData => {
        const day = sunData.day;
		const dawn = new Date(sunData.dawn).toLocaleTimeString([], {timeStyle: "short"});
        const dusk = new Date(sunData.dusk).toLocaleTimeString([], {timeStyle: "short"});
        getDay(day);
        setDaylightHours(`${dawn} - ${dusk}`);
    }
    
    const getReadableTime = hourly => {
		const readable = hourly
			.map(hour => ({...hour, time: new Date(hour.time * 1000).getHours()}));
		filterForCondition(readable, conditions.uv, "exposureTime");
		filterForCondition(readable, conditions.precip, "precipTime");
		filterForCondition(readable, conditions.temp, "tempTime");
    }
    
    const filterForCondition = (data, condition, field) => {
		const filtered = data
			.filter(hour => (eval(condition)));
		checkAllDay(data, filtered, field);
    }
    
    const checkAllDay = (unfiltered, filtered, field) => {
		if (filtered.length === unfiltered.length) {
			displayAllDay(field);
		} else {
			getFilteredTimes(filtered, field);
		}
    }
    
    const displayAllDay = field => {
		switch (field) {
            case "exposureTime":
                setExposureTime("All day");
                break;
            case "precipTime":
                setPrecipTime("All day");
                break;
            case "tempTime":
                setTempTime("All day");
                break;
            default:
                break;
        }
    }
    
    const getFilteredTimes = (data, field) => {
		const times = data
			.map(hour => hour.time);
		sortTimes(times, field);
    }
    
    const sortTimes = (times, field) => {
		if (times.length === 0) return;
		const now = new Date().getHours();
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
						convertEarliest = `Until ${convertTime(now + 1)}`;
					} else {
						convertEarliest = `${convertTime(earliest)} - ${convertTime(earliest + 1)}`;
					}
					result += convertEarliest + ', '; // print and break for singleton  
				} else { // must be end of span
					if (earliest === now) {
						convertEarliest = `Until `;
					} else {
						convertEarliest = `${convertTime(earliest)} - `
					}
					let convertLatest = convertTime(latest);
					result += convertEarliest + convertLatest + ', '; // print and break for span
				}
				// begin new group
				earliest = times[i];
				latest = earliest;
			}
		}

		if (earliest === latest) {
			let convertEarliest = convertTime(earliest);
			let convertEarliestPlusOne = convertTime(earliest + 1);
			result += `${convertEarliest} - ${convertEarliestPlusOne}`; // print final singleton            
		} else {
			convertEarliest = `${convertTime(earliest)} - `
			let convertLatest = convertTime(latest + 1);
			result += convertEarliest + convertLatest; // print final span
		}
        switch (field) {
            case "exposureTime":
                setExposureTime(result);
                break;
            case "precipTime":
                setPrecipTime(result);
                break;
            case "tempTime":
                setTempTime(result);
                break;
            default:
                break;
        }
    }
    
    const convertTime = time => {
		const amPm = time >= 12 && time < 24 ? "PM" : "AM";
		const converted = (time % 12) || 12;
		const timeString = `${converted}:00 ${amPm}`;
		return timeString;
	}

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Typography component="h1" variant="overline">sunbuddy</Typography>
                    <Box mt={2}>
                        <Typography className={classes.thin} component="h2" variant="h4">{city}</Typography>
                    </Box>
                    <Typography  component="h3" variant="body2">{day}</Typography>
                    <Box mt={2} item>
                        <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                                <Typography className={classes.black} component="p" variant="body1" color="primary">{minTemp}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography component="p" variant="h4">{day === "today" ? currentTemp : "/"}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography className={classes.black} component="p" variant="body1" color="error">{maxTemp}</Typography>
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
                            <ListItemText
                                primary={daylightHours} 
                                secondary="Daylight hours" 
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar>
                                <WbCloudyIcon />
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={precipTime} 
                                secondary={`Significant precipitation is ${precipTime ? `` : `not`} expected`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar>
                                <WarningIcon />
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={exposureTime} secondary={`Sunscreen is ${exposureTime ? `advisable` : `not necessary`}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar>
                                <DirectionsRunIcon />
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={tempTime}
                                secondary={`${tempTime ? `Favorable temperatures for outdoor exercise` : `Extreme temperatures`}`} 
                            />
                        </ListItem>
                    </List>
                    <Box mt={2}>
                        <Copyright />
                    </Box>
                </div>
            </Grid>
        </Grid>
    );
}