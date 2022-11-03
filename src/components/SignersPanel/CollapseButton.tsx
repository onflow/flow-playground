import CollapseClosedIcon from "components/Icons/CollapseClosedIcon";
import CollapseOpenIcon from "components/Icons/CollapseOpenIcon";
import React from "react";

export const CollapseButton = ({ isOpen = true }: { isOpen: boolean }) => {

    return (
        <span>{isOpen ? CollapseOpenIcon() : CollapseClosedIcon()}</span>
    )
}