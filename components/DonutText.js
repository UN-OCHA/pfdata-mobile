import React from "react";
import { useTheme } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import formatSI from "../utils/formatSi";

function DonutText({ data, fundType, colorType }) {
	const { colors } = useTheme();

	return (
		<View>
			<Text style={styles.donutTitle}>
				{fundType === "total"
					? data.name.toUpperCase()
					: data.name.split(" ").join("\n")}
			</Text>
			{data.value === 0 ? (
				<Text
					style={{
						...styles.donutValueZero,
						color:
							fundType === "total"
								? colors[`${colorType}Analogous`][1]
								: colors[`${fundType}Analogous`][1],
					}}
				>
					No allocations
				</Text>
			) : (
				<Text
					style={{
						...styles.donutValue,
						color:
							fundType === "total"
								? colors[`${colorType}Analogous`][1]
								: colors[`${fundType}Analogous`][1],
					}}
				>
					{"$" + formatSI(data.value)}
				</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	donutTitle: {
		fontSize: 16,
		fontWeight: "normal",
		textAlign: "center",
		marginBottom: 6,
	},
	donutValue: {
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "center",
	},
	donutValueZero: {
		fontSize: 14,
		fontWeight: "normal",
		textAlign: "center",
	},
});

export default DonutText;
