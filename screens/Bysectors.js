import React, { useContext, useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Snackbar, Card } from "react-native-paper";
import DataContext from "../context/DataContext";
import SelectionContext from "../context/SelectionContext";
import { ListContext } from "../context/ListProvider";
import TopSelector from "../components/TopSelector";
import TopCardRow from "../components/TopCardRow";
import Title from "../components/Title";
import BarChartSectors from "../components/BarChartSectors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useSwipe from "../utils/useswipe";

function BySectors({ navigation, route }) {
	const data = useContext(DataContext);
	const countryData = data.countriesData.find(
		d => d.fundId === route.params.fundId
	);

	const {
		year,
		setYear,
		fundType,
		setFundType,
		years,
		setTooltipData,
		showModal,
	} = useContext(SelectionContext);
	const { list, setList } = useContext(ListContext);
	const [snackbarVisible, setSnackbarVisible] = useState(false);

	const { onTouchStart, onTouchEnd } = useSwipe(() =>
		navigation.openDrawer()
	);

	function onDismissSnackBar() {
		setSnackbarVisible(false);
	}

	const bySectorsData = countryData.allocations.find(
		d => d.year === year
	).bySectors;

	const allocationsValue = bySectorsData[fundType];
	const sectorsValue = bySectorsData[`sectors${fundType}`].size;

	const barChartData = bySectorsData[`sectorsData${fundType}`];

	useEffect(() => {
		AsyncStorage.getItem("snackbarBySectors").then(value => {
			if (value !== "true") {
				setSnackbarVisible(true);
				AsyncStorage.setItem("snackbarBySectors", "true");
			}
		});
	}, []);

	return (
		<View
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
			style={{ flex: 1 }}
		>
			<ScrollView
				style={styles.container}
				stickyHeaderIndices={[0]}
				showsVerticalScrollIndicator={false}
			>
				<TopSelector
					fundId={route.params.fundId}
					year={year}
					setYear={setYear}
					fundType={fundType}
					setFundType={setFundType}
					list={list}
					setList={setList}
					fundTypes={bySectorsData.fundTypes}
					years={years}
					navigation={navigation}
				/>
				<View>
					<Card style={styles.card}>
						<Card.Content style={{ paddingVertical: 6 }}>
							<TopCardRow
								title="Allocated"
								value={allocationsValue}
								formatter={e => "$" + (~~e).toLocaleString()}
								icon="logo-usd"
								fontSize={16}
								fundType={fundType}
							/>
							<TopCardRow
								title="Sectors"
								value={sectorsValue}
								formatter={e => ~~e}
								icon="color-filter"
								fontSize={14}
								fundType={fundType}
							/>
						</Card.Content>
					</Card>
				</View>
				<View style={{ margin: 10 }}>
					<Title title={"Sectors List"} />
				</View>
				<View style={styles.barChartContainer}>
					<BarChartSectors
						data={barChartData}
						fundType={fundType}
						sectorsNames={data.lists.clustersList}
						setTooltipData={setTooltipData}
						showModal={showModal}
					/>
				</View>
			</ScrollView>
			{snackbarVisible && (
				<View
					style={{
						position: "absolute",
						bottom: 0,
						width: "100%",
					}}
				>
					<Snackbar
						duration={Number.POSITIVE_INFINITY}
						visible={snackbarVisible}
						onDismiss={onDismissSnackBar}
						action={{
							label: "Clear",
							onPress: onDismissSnackBar,
						}}
					>
						{
							'Touch the rows to see detailed values. Touch "Sector Name" for sorting alphabetically, and "Allocations" for sorting by value.'
						}
					</Snackbar>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	card: {
		margin: 10,
		flexDirection: "column",
		backgroundColor: "#eee",
	},
	summary: {
		margin: 10,
		flexDirection: "column",
	},
	summaryRow: {
		flexDirection: "row",
		alignItems: "baseline",
		marginVertical: 6,
	},
	summaryName: {
		fontSize: 14,
	},
	summaryValue: {
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 10,
	},
	bullet: {
		fontSize: 10,
		marginRight: 10,
		alignSelf: "center",
	},
	barChartContainer: {
		margin: 10,
	},
});

export default BySectors;
