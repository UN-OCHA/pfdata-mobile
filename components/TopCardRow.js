import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "react-native-paper";

function TopCardRow({ title, value, icon, formatter, fontSize, fundType }) {
	const { colors } = useTheme();
	const thisFundColor =
		fundType === "total"
			? colors.unColorDarker
			: colors[`${fundType}Analogous`][1];
	const thisFundIconColor =
		fundType === "total"
			? colors.unColor
			: colors[`${fundType}Analogous`][1];
	if (title === "Allocated" || title === "Donated") {
		return (
			<View
				style={{
					...styles.cardRow,
					alignItems: "baseline",
					marginBottom: 10,
				}}
			>
				<Text
					style={{
						...styles.cardRowValue,
						fontSize: fontSize * 1.8,
						color: thisFundColor,
						marginLeft: 0,
					}}
				>
					{title === "Allocated" && value === 0
						? "(no data)"
						: formatter(value)}
				</Text>
				<Text
					style={{
						...styles.cardRowText,
						fontSize: fontSize,
						marginLeft: 8,
					}}
				>
					{title}
				</Text>
			</View>
		);
	}
	return (
		<View style={styles.cardRow}>
			<Ionicons
				name={icon}
				size={20}
				color={thisFundIconColor}
			/>
			<View style={styles.textContainer}>
				<Text
					style={{
						...styles.cardRowText,
						fontSize: fontSize,
					}}
				>
					{title}:
				</Text>
				<Text
					style={{
						...styles.cardRowValue,
						fontSize: fontSize * 1.5,
						color: thisFundColor,
					}}
				>
					{formatter(value)}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	cardRow: {
		marginHorizontal: 10,
		marginVertical: 5,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "flex-end",
	},
	cardRowText: {
		marginLeft: 14,
	},
	cardRowValue: {
		marginLeft: 6,
		fontWeight: "bold",
	},
	textContainer: {
		flexDirection: "row",
		alignItems: "baseline",
	},
});

export default TopCardRow;
