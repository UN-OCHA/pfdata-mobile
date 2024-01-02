import React, { useEffect, useContext, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import globalObj from "../utils/firsttime";
import DataContext from "../context/DataContext";
import SelectionContext from "../context/SelectionContext";
import { ListContext } from "../context/ListProvider";
import TopSelector from "../components/TopSelector";
import TopCardRow from "../components/TopCardRow";
import PieChart from "../components/PieChart";
import { Card, Snackbar } from "react-native-paper";
import DonutText from "../components/DonutText";
import Title from "../components/Title";
import OverviewBarChart from "../components/OverviewBarChart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useSwipe from "../utils/useswipe";

function Overview({ navigation, route }) {
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
	const [viewWidth, setViewWidth] = useState(0);
	const [viewWidthBarChart, setViewWidthBarChart] = useState(0);
	const [snackbarVisible, setSnackbarVisible] = useState(false);

	const overviewData = countryData.allocations.find(
		d => d.year === year
	).overview;
	const allocations = overviewData[fundType],
		projects = overviewData[`projects${fundType}`].size,
		partners = overviewData[`partners${fundType}`].size,
		sectors = overviewData[`sectors${fundType}`].size;

	if (fundType !== "total" && !overviewData.fundTypes.has(fundType)) {
		setFundType("total");
	}

	const allocationTypesPerFund = {
		cerf: [3, 4],
		cbpf: [1, 2],
	};

	const donutData =
		fundType === "total"
			? [
					{ name: "cerf", value: overviewData.cerf },
					{ name: "cbpf", value: overviewData.cbpf },
			  ]
			: allocationTypesPerFund[fundType].map(type => ({
					name: data.lists.allocationTypesList[type],
					value: overviewData.allocationSources[type] || 0,
			  }));

	const barChartData = countryData.allocations.reduce((acc, d) => {
		if (d.overview[fundType]) {
			const obj = {
				year: d.year,
				cerf: d.overview.cerf,
				cbpf: d.overview.cbpf,
				total: d.overview.total,
			};
			acc.push(obj);
		}
		return acc;
	}, []);

	const { onTouchStart, onTouchEnd } = useSwipe(() =>
		navigation.openDrawer()
	);

	function onLayout(e) {
		setViewWidth(e.nativeEvent.layout.width);
	}

	function onLayoutBarChart(e) {
		setViewWidthBarChart(e.nativeEvent.layout.width);
	}

	function onDismissSnackBar() {
		setSnackbarVisible(false);
	}

	useEffect(() => {
		if (globalObj.firstTime) navigation.openDrawer();
		globalObj.firstTime = false;
		AsyncStorage.getItem("snackbarOverview").then(value => {
			if (value !== "true") {
				setSnackbarVisible(true);
				AsyncStorage.setItem("snackbarOverview", "true");
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
					fundTypes={overviewData.fundTypes}
					years={years}
					navigation={navigation}
				/>
				<Card style={styles.card}>
					<Card.Content>
						<TopCardRow
							title="Allocated"
							value={allocations}
							formatter={e => "$" + (~~e).toLocaleString()}
							icon="logo-usd"
							fontSize={16}
							fundType={fundType}
						/>
						<TopCardRow
							title="Projects"
							value={projects}
							formatter={e => ~~e}
							icon="md-newspaper-sharp"
							fontSize={14}
							fundType={fundType}
						/>
						<TopCardRow
							title="Partners"
							value={partners}
							formatter={e => ~~e}
							icon="md-people-sharp"
							fontSize={14}
							fundType={fundType}
						/>
						<TopCardRow
							title="Sectors"
							value={sectors}
							formatter={e => ~~e}
							icon="color-filter"
							fontSize={14}
							fundType={fundType}
						/>
					</Card.Content>
				</Card>
				<View style={{ margin: 10 }}>
					<Title
						title={`Allocations by ${
							fundType === "total" ? "fund" : "type"
						}`}
					/>
				</View>
				<View style={styles.donutContainer}>
					<View style={styles.sideDonut}>
						<DonutText
							data={donutData[0]}
							fundType={fundType}
							colorType="cerf"
						/>
					</View>
					<View
						style={styles.donutSvgContainer}
						onLayout={onLayout}
					>
						<PieChart
							viewWidth={viewWidth}
							data={donutData}
							fundType={fundType}
							setTooltipData={setTooltipData}
							showModal={showModal}
						/>
					</View>
					<View style={styles.sideDonut}>
						<DonutText
							data={donutData[1]}
							fundType={fundType}
							colorType="cbpf"
						/>
					</View>
				</View>
				<View style={{ margin: 10 }}>
					<Title
						title={`All allocations (${years[0]} - ${
							years[years.length - 1]
						})`}
					/>
				</View>
				<View
					style={styles.barChartContainer}
					onLayout={onLayoutBarChart}
				>
					<OverviewBarChart
						data={barChartData}
						fundType={fundType}
						year={year}
						viewWidth={viewWidthBarChart}
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
						Touch the slices in the donut chart or the bars in the
						bar chart to see detailed values.
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
	donutContainer: {
		marginTop: "10%",
		margin: 10,
		flexDirection: "row",
		flex: 1,
	},
	sideDonut: {
		width: "30%",
		alignItems: "center",
		justifyContent: "center",
	},
	donutSvgContainer: {
		width: "40%",
		alignItems: "center",
		justifyContent: "center",
	},
	barChartContainer: {
		margin: 10,
		flexDirection: "row",
		justifyContent: "center",
	},
});

export default Overview;
