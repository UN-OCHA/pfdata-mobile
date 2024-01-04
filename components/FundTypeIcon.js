import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

function FundTypeIcon(props) {
	const { colors } = useTheme();
	return (
		<View
			style={{
				...styles.container,
				backgroundColor:
					colors[
						props.fund === "cerf" ? "cerfColorDarker2" : "cbpfColor"
					],
			}}
		>
			<Text
				style={{
					...styles.text,
					paddingTop: props.group ? 1 : 2,
					paddingBottom: props.group ? 1 : 2,
				}}
			>
				{props.fund.toUpperCase()}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 5,
		paddingLeft: 3,
		paddingRight: 3,
		marginBottom: 1,
		marginTop: 1,
	},
	text: {
		fontSize: 10,
		fontWeight: 900,
		color: "#fff",
	},
});

export default FundTypeIcon;
