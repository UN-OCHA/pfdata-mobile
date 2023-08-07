import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

//creates the section header for the country screen
function SectionHeader({ title }) {
	return (
		<View style={styles.container}>
			<Text
				variant="titleMedium"
				style={styles.text}
			>
				{title}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { marginLeft: 10, marginTop: 14, marginBottom: 10 },
	text: { textTransform: "uppercase" },
});

export default SectionHeader;
