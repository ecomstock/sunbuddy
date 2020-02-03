import React from 'react';
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
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
}));

export default function SignInSide() {
    const classes = useStyles();

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    {/* <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar> */}
                    <Grid>
                        {/* logo */}
                        {/* place */}
                        {/* temperatures */}
                    </Grid>
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