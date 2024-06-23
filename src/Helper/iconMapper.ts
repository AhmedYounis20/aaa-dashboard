import * as icons from "react-icons";
import React from "react";

type IconSet = {
  [key: string]: React.ComponentType;
};

const iconSet: IconSet = {};

Object.keys(icons).forEach((key) => {
  if (typeof (icons as any)[key] === "function") {
    iconSet[key] = (icons as any)[key] as React.ComponentType;
  }
});

const getIconComponent = (iconName: string) => {
  return iconSet[iconName] || null;
};

export default getIconComponent;
