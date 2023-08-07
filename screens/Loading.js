import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import logo from "../assets/icon.png";

//this shows a spinner while the data is loading
function Loading() {
	return (
		<View style={styles.container}>
			<Image
				source={logo}
				style={styles.logo}
			/>
			<View>
				<Text
					variant="titleMedium"
					style={styles.text}
				>
					Loading data,{"\n"} please wait...
				</Text>
				<ActivityIndicator
					animating={true}
					size="large"
					color="#3289C9"
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-evenly",
		backgroundColor: "#fff",
	},
	text: {
		textAlign: "center",
		marginVertical: 12,
		marginBottom: 24,
		color: "#555",
	},
	logo: {
		width: 128,
		height: 128,
		alignSelf: "center",
		marginBottom: 24,
	},
});

export default Loading;
