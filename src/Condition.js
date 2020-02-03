import React from "react";
import Icon from "@mdi/react";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const Condition = props => {
    if (props.conditionTime) {
        return (
            <Box className="condition" >
                <Icon className="icon"
                    path={props.iconName}
                    title={props.iconTitle}
                    size={props.iconSize}
                    color={props.iconColor}
                />
                <Typography variant="body1">{props.conditionTime}</Typography>
            </Box>
        )
    }
    return null;
}

export default Condition;