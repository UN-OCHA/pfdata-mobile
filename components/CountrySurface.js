import React, { memo, useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Surface, Text, IconButton, Menu } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { ListContext } from "../context/ListProvider";
import { useTheme } from "react-native-paper";
import FundTypeIcon from "./FundTypeIcon";

const CountrySurface = memo(function CountrySurface(props) {
	const { colors } = useTheme();
	const { list, setList } = useContext(ListContext);
	const [visible, setVisible] = useState(false);
	const openMenu = () => setVisible(true);
	const closeMenu = () => setVisible(false);

	function checkList() {
		if (!visible) return "";
		if (list.includes(props.fundId)) {
			return "Remove from list";
		}
		return "Add to My Countries";
	}

	//adds or removes the country from the list
	function handleList() {
		closeMenu();
		if (list.includes(props.fundId)) {
			setList(list.filter(item => item !== props.fundId));
		} else {
			setList([...list, props.fundId]);
		}
	}

	return (
		<Surface style={styles.surface}>
			<View style={styles.container}>
				<View style={styles.iconContainer}>
					<View style={styles.icons}>
						<AntDesign
							name={
								list.includes(props.fundId)
									? "pushpin"
									: "earth"
							}
							size={20}
							color="#666"
						/>
					</View>
					<View style={styles.fundTypesContainer}>
						{props.fundTypes.map(type => (
							<FundTypeIcon
								key={type}
								fund={type}
								group={props.fundTypes.length > 1}
							/>
						))}
					</View>
				</View>
				<TouchableOpacity
					style={styles.textContainer}
					onPress={() => {
						props.navigation.navigate("Country", {
							fundId: props.fundId,
							fundName: props.fundName,
						});
					}}
				>
					<Text style={styles.text}>{props.fundAbbreviatedName}</Text>
				</TouchableOpacity>
				<View>
					<Menu
						theme={{
							colors: { elevation: { level2: colors.unColor } },
						}}
						visible={visible}
						onDismiss={closeMenu}
						anchor={
							<IconButton
								onPress={openMenu}
								style={styles.iconButton}
								icon="menu"
								color="#666"
								size={20}
							/>
						}
					>
						<Menu.Item
							theme={{
								colors: { onSurface: "#fff" },
							}}
							style={styles.menuItem}
							onPress={handleList}
							title={checkList()}
						/>
					</Menu>
				</View>
			</View>
		</Surface>
	);
});

const styles = StyleSheet.create({
	surface: {
		elevation: 4,
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 12,
		minHeight: 30,
		alignItems: "center",
		justifyContent: "center",
	},
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
	},
	iconContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	fundTypesContainer: {
		flexDirection: "column",
		justifyContent: "center",
		marginTop: 2,
		marginBottom: 2,
		marginLeft: 4,
		marginRight: 4,
	},
	text: {
		marginLeft: 6,
		marginRight: 6,
		textAlign: "center",
	},
	icons: {
		marginLeft: 4,
	},
	iconButton: {
		margin: 0,
	},
	menuItem: {
		height: 26,
	},
	textContainer: {
		flex: 1,
	},
});

export default CountrySurface;
