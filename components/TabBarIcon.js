/* eslint-disable react/prop-types */
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

export default function TabBarIcon(props) {
	return (
		<MaterialCommunityIcons
			name={props.name}
			size={props.size || 26}
			color={props.color}
			style={{ marginTop: -4 }}
		/>
	);
}
