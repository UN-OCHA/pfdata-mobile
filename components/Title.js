import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Divider } from "react-native-paper";
import { useTheme } from "react-native-paper";

function Title({ title }) {
	const { colors } = useTheme();
	return (
		<View style={styles.titleContainer}>
			<View
				style={{ ...styles.titleView, backgroundColor: colors.unColor }}
			>
				<Text style={styles.title}>{title}</Text>
			</View>
			<Divider />
		</View>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		marginTop: 10,
		marginBottom: 10,
		width: "100%",
	},
	titleView: {
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
		alignSelf: "flex-start",
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		color: "white",
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
});

export default Title;
