import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import logo from "../assets/icon.png";

//shows a message when an error happens
function Error() {
	return (
		<View style={styles.container}>
			<Image
				source={logo}
				style={styles.logo}
			/>
			<Text style={styles.text}>
				{"Sorry, an error happened\n while loading the data."}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-evenly",
	},
	text: {
		textAlign: "center",
		lineHeight: 18,
	},
	logo: {
		width: 128,
		height: 128,
		alignSelf: "center",
		marginBottom: 24,
	},
});

export default Error;
