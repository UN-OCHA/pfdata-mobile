import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
	Text,
	SegmentedButtons,
	Switch,
	useTheme,
	Button,
	IconButton,
	Modal,
	Portal,
} from "react-native-paper";

function TopSelector({
	fundId,
	year,
	setYear,
	fundType,
	setFundType,
	list,
	setList,
	fundTypes,
	years,
	navigation,
}) {
	const { colors } = useTheme();
	const [visible, setVisible] = React.useState(false);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	function handleSwitch() {
		if (list.includes(fundId)) {
			setList(list.filter(item => item !== fundId));
		} else {
			setList([...list, fundId]);
		}
	}

	function handleSegmentedButtonsChange(value) {
		setFundType(value);
	}

	const reversedYears = years.slice().reverse();

	const segmentedButtonsColor =
		fundType === "total"
			? colors.unColorLighter
			: fundType === "cerf"
			? colors.cerfColorLighter
			: colors.cbpfColorLighter;

	return (
		<View style={styles.container}>
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={styles.modalStyle}
				>
					<ScrollView
						showsVerticalScrollIndicator={false}
						style={{ flexDirection: "column" }}
					>
						{reversedYears.map((d, i) => (
							<Button
								key={i}
								style={{
									margin: 5,
									backgroundColor:
										year === d
											? colors.unColor
											: colors.background,
								}}
								labelStyle={{
									color:
										year === d
											? colors.background
											: colors.text,
								}}
								mode="text"
								onPress={() => {
									setYear(d);
									hideModal();
								}}
							>
								{d}
							</Button>
						))}
					</ScrollView>
				</Modal>
			</Portal>
			<View style={styles.topRow}>
				<View>
					<IconButton
						icon="arrow-expand-right"
						size={24}
						onPress={() => {
							navigation.openDrawer();
						}}
					/>
				</View>
				<View style={styles.switchContainer}>
					<Text
						style={{
							fontWeight: list.includes(fundId)
								? "bold"
								: "normal",
							...styles.toggleListText,
						}}
					>
						My{"\n"}Countries
					</Text>
					<Switch
						value={list.includes(fundId)}
						onValueChange={handleSwitch}
						color={colors.unColor}
					/>
				</View>
			</View>
			<View style={styles.bottomRow}>
				<View style={styles.pickerContainer}>
					<Button
						style={styles.picker}
						labelStyle={styles.pickerText}
						contentStyle={{ height: 30 }}
						mode="outlined"
						compact={true}
						onPress={showModal}
					>
						{year}
					</Button>
				</View>
				<View style={styles.buttons}>
					<SegmentedButtons
						value={fundType}
						onValueChange={handleSegmentedButtonsChange}
						density="medium"
						theme={{
							colors: {
								secondaryContainer: segmentedButtonsColor,
							},
						}}
						buttons={[
							{
								value: "total",
								label: "Total",
								disabled: fundTypes === null,
							},
							{
								value: "cerf",
								label: "CERF",
								disabled:
									fundTypes === null ||
									!fundTypes.has("cerf"),
							},
							{
								value: "cbpf",
								label: "CBPF",
								disabled:
									fundTypes === null ||
									!fundTypes.has("cbpf"),
							},
						]}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 14,
		marginBottom: 6,
		backgroundColor: "#fff",
		borderBottomColor: "#ccc",
		borderBottomWidth: 1,
	},
	topRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		marginBottom: 10,
		marginRight: 10,
	},
	bottomRow: {
		flexDirection: "row",
		width: "100%",
	},
	switchContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	toggleListText: {
		marginRight: 6,
		fontSize: 12,
		textAlign: "center",
	},
	buttons: {
		width: "70%",
	},
	pickerContainer: {
		width: "30%",
	},
	picker: {
		width: 80,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 100,
		backgroundColor: "#eee",
	},
	pickerText: {
		fontSize: 14,
		marginVertical: 0,
		color: "#444",
	},
	modalStyle: {
		backgroundColor: "#fff",
		padding: 10,
		margin: 0,
		borderRadius: 10,
		maxHeight: "60%",
		width: 110,
		alignSelf: "center",
	},
});

export default TopSelector;
