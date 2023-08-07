import React, { useContext } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, IconButton } from "react-native-paper";
import logo from "../assets/icon.png";
import DataContext from "../context/DataContext";
import { timeFormat } from "d3-time-format";

//this shows a spinner while the data is loading
function About({ navigation }) {
	const data = useContext(DataContext);
	const formatDate = timeFormat("%d %B, %Y (%H:%M:%S)");
	const date = formatDate(new Date(data.lastModified));
	const thisYear = new Date().getFullYear();
	return (
		<View style={{ flex: 1, backgroundColor: "#fff" }}>
			<View style={styles.button}>
				<IconButton
					icon="arrow-expand-right"
					size={24}
					onPress={() => {
						navigation.openDrawer();
					}}
					style={{ alignSelf: "flex-start" }}
				/>
			</View>
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
						Data updated on:{"\n"}
						{date}
					</Text>
					<Text
						variant="labelMedium"
						style={styles.text}
					>
						Created by the IMSDAU (Information Management Systems
						and Data Analytics Unit) branch of OCHA.
					</Text>
					<Text
						variant="labelMedium"
						style={styles.text}
					>
						Copyright © {thisYear} OCHA
					</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-evenly",
		backgroundColor: "#fff",
		padding: 26,
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
	button: {
		marginTop: 10,
	},
});

export default About;
