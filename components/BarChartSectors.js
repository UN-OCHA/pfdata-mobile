import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { format, max } from "d3";
import { useTheme } from "react-native-paper";
import formatSI from "../utils/formatSi";
import MaterialComminityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import sectorsIcons from "../assets/sectorsIcons";

function BarChartSectors({
	data,
	fundType,
	sectorsNames,
	setTooltipData,
	showModal,
}) {
	const moneyFormat = format(",.0f");
	function handleTooltip(datum) {
		setTooltipData([
			{ name: "Sector", value: sectorsNames[datum.sectorCode] },
			{ name: "Allocations", value: "$" + moneyFormat(datum.value) },
		]);
		showModal();
	}
	const maxValue = max(data, d => d.value);
	const { colors } = useTheme();

	const [order, setOrder] = useState("value");

	data.sort((a, b) =>
		order === "value"
			? b[order] - a[order]
			: sectorsNames[a.sectorCode].localeCompare(
					sectorsNames[b.sectorCode]
			  )
	);

	function handleOrder(value) {
		setOrder(value);
	}

	const thisFundColor =
		fundType === "total" ? colors.unColor : colors[`${fundType}Color`];

	return (
		<View style={styles.container}>
			<View style={styles.titleRow}>
				<TouchableOpacity
					style={styles.touchableName}
					onPress={() => handleOrder("name")}
				>
					<View
						style={styles.titleName}
						onClick={() => handleOrder("name")} //REMOVE
					>
						<Text style={styles.titleText}>Partner Name</Text>
						<MaterialComminityIcons
							name={"sort-alphabetical-ascending"}
							size={18}
							color={order === "name" ? "#222" : "#bbb"}
						/>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.touchableValue}
					onPress={() => handleOrder("value")}
				>
					<View
						style={styles.titleValue}
						onClick={() => handleOrder("value")} //REMOVE
					>
						<Text style={styles.titleText}>Allocations</Text>
						<MaterialComminityIcons
							name={"sort-variant"}
							size={18}
							color={order === "value" ? "#222" : "#bbb"}
						/>
					</View>
				</TouchableOpacity>
			</View>
			{data.map((d, i) => (
				<TouchableOpacity
					key={i}
					onPress={() => handleTooltip(d)}
				>
					<View
						style={styles.barChartRow}
						onPress={() => handleTooltip(d)}
						onClick={() => handleTooltip(d)} //REMOVE
					>
						<View style={styles.barChartName}>
							<Image
								source={{ uri: sectorsIcons[d.sectorCode] }}
								style={{
									...styles.icon,
									tintColor: thisFundColor,
								}}
							/>
							<Text style={styles.barChartNameText}>
								{sectorsNames[d.sectorCode]}
							</Text>
						</View>
						<View style={styles.barChartValue}>
							<View
								style={{
									...styles.bar,
									width: ~~((100 * d.value) / maxValue) + "%",
									backgroundColor: thisFundColor,
								}}
							/>
							<Text
								style={{
									...styles.barChartValueText,
									color:
										d.value / maxValue > 0.8
											? "white"
											: "black",
									left:
										d.value / maxValue > 0.8
											? null
											: ~~((100 * d.value) / maxValue) +
											  2 +
											  "%",
									right:
										d.value / maxValue > 0.8
											? 102 -
											  ~~((100 * d.value) / maxValue) +
											  "%"
											: null,
								}}
							>
								{formatSI(d.value).replace("G", "B")}
							</Text>
						</View>
					</View>
				</TouchableOpacity>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	barChartRow: {
		paddingTop: 6,
		flexDirection: "row",
		alignItems: "center",
		paddingBottom: 6,
		borderBottomColor: "#eee",
		borderBottomWidth: 1,
	},
	barChartName: {
		width: "42%",
		justifyContent: "flex-start",
		flexDirection: "row",
		alignItems: "center",
	},
	barChartNameText: {
		fontSize: 12,
		fontFamily: "sans-serif",
		paddingRight: 8,
		flex: 1,
		flexWrap: "wrap",
	},
	barChartValue: {
		width: "58%",
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	barChartValueText: {
		position: "absolute",
		fontSize: 14,
		fontWeight: "bold",
	},
	bar: {
		height: 18,
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 6,
		paddingBottom: 12,
	},
	touchableName: {
		width: "40%",
	},
	touchableValue: {
		width: "60%",
	},
	titleName: {
		justifyContent: "flex-start",
		flexDirection: "row",
	},
	titleValue: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	titleText: {
		fontSize: 15,
		fontFamily: "sans-serif",
		color: "#333",
		fontWeight: "bold",
		paddingRight: 6,
	},
	icon: {
		width: 20,
		height: 20,
		marginRight: 12,
	},
});

export default BarChartSectors;
