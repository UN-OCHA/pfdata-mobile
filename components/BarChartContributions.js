import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { format, max } from "d3";
import { useTheme } from "react-native-paper";
import formatSI from "../utils/formatSi";
import MaterialComminityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import donorFlags from "../assets/donorFlags";

function BarChartContributions({
	data,
	payment,
	fundType,
	donorsNames,
	donorIsoCodes,
	setTooltipData,
	showModal,
}) {
	const moneyFormat = format(",.0f");
	function handleTooltip(datum) {
		setTooltipData([
			{ name: "Donor", value: donorsNames[datum.donor] },
			{ name: "Contributions", value: "$" + moneyFormat(datum[payment]) },
		]);
		showModal();
	}
	const maxValue = max(data, d => d[payment]);
	const { colors } = useTheme();

	const [order, setOrder] = useState("value");

	data.sort((a, b) =>
		order === "value"
			? b[payment] - a[payment]
			: donorsNames[a.donor].localeCompare(donorsNames[b.donor])
	);

	function handleOrder(value) {
		setOrder(value);
	}

	const thisFundColor = colors.cbpfColor;

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
						<Text style={styles.titleText}>Donor</Text>
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
						<Text style={styles.titleText}>
							{"Donations" +
								(payment !== "total" ? ` (${payment})` : "")}
						</Text>
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
								source={{
									uri: donorFlags[
										donorIsoCodes[d.donor].toLowerCase()
									],
								}}
								style={styles.icon}
							/>
							<Text style={styles.barChartNameText}>
								{donorsNames[d.donor]}
							</Text>
						</View>
						<View style={styles.barChartValue}>
							<View
								style={{
									...styles.bar,
									width:
										~~((100 * d[payment]) / maxValue) + "%",
									backgroundColor: thisFundColor,
								}}
							/>
							<Text
								style={{
									...styles.barChartValueText,
									color:
										d[payment] / maxValue > 0.8
											? "white"
											: "black",
									left:
										d[payment] / maxValue > 0.8
											? null
											: ~~(
													(100 * d[payment]) /
													maxValue
											  ) +
											  2 +
											  "%",
									right:
										d[payment] / maxValue > 0.8
											? 102 -
											  ~~(
													(100 * d[payment]) /
													maxValue
											  ) +
											  "%"
											: null,
								}}
							>
								{formatSI(d[payment]).replace("G", "B")}
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
		width: "40%",
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
		width: "60%",
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
		width: "40%",
		justifyContent: "flex-start",
		flexDirection: "row",
	},
	titleValue: {
		width: "60%",
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
		marginRight: 6,
	},
});

export default BarChartContributions;
