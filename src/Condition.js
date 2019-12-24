import React from "react";
import Icon from "@mdi/react";

const Condition = props => {
    if (props.conditionTime) {
        return (
            <div className="condition" >
                <Icon path={props.iconName}
                    title={props.iconTitle}
                    size={props.iconSize}
                    color={props.iconColor}
                />
                <p>{props.conditionTime}</p>
            </div>
        )
    }
    return null;
}

export default Condition;