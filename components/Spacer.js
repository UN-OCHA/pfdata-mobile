import React from "react";
import { View } from "react-native";

function Spacer() {
	return (
		<View
			style={{
				height: 1,
				backgroundColor: "#ccc",
				width: "75%",
				marginBottom: 8,
				marginTop: 0,
				alignSelf: "center",
			}}
		/>
	);
}

export default Spacer;
