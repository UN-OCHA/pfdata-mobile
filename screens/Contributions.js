import React, { useContext, useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Snackbar, Card, SegmentedButtons, Text } from "react-native-paper";
import DataContext from "../context/DataContext";
import SelectionContext from "../context/SelectionContext";
import { ListContext } from "../context/ListProvider";
import TopSelector from "../components/TopSelector";
import TopCardRow from "../components/TopCardRow";
import Title from "../components/Title";
import BarChartContributions from "../components/BarChartContributions";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Contributions({ navigation, route }) {
	const data = useContext(DataContext);
	const countryData = data.countriesData.find(
		d => d.fundId === route.params.fundId
	);

	const payments = ["total", "paid", "pledged"];

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
	const [payment, setPayment] = useState(payments[0]);

	function onDismissSnackBar() {
		setSnackbarVisible(false);
	}

	const contributions = countryData.contributions.find(
		d => d.year === year
	).contributions;

	const contributionsValue = contributions[payment];
	const barChartData = contributions.contributionsData.filter(
		d => d[payment] > 0
	);
	const donorsValue = barChartData.length;

	function handleSegmentedButtonsChange(value) {
		setPayment(value);
	}

	useEffect(() => {
		AsyncStorage.getItem("snackbarContributions").then(value => {
			if (value !== "true") {
				setSnackbarVisible(true);
				AsyncStorage.setItem("snackbarContributions", "true");
			}
		});
	}, []);

	return (
		<View style={{ flex: 1 }}>
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
					fundTypes={null}
					years={years}
					navigation={navigation}
				/>
				<View>
					<Card style={styles.card}>
						<Card.Content style={{ paddingVertical: 6 }}>
							<TopCardRow
								title="Donated"
								value={contributionsValue}
								formatter={e => "$" + (~~e).toLocaleString()}
								icon="logo-usd"
								fontSize={16}
								fundType={"total"}
							/>
							<TopCardRow
								title="Donors"
								value={donorsValue}
								formatter={e => ~~e}
								icon="wallet"
								fontSize={14}
								fundType={"total"}
							/>
						</Card.Content>
					</Card>
				</View>
				<View style={{ marginHorizontal: 16 }}>
					<Text style={{ fontSize: 12 }}>
						Note: contribution values are earnmarked only for CBPF
						funds.
					</Text>
				</View>
				<View
					style={{
						marginBottom: 10,
						marginTop: 18,
						marginHorizontal: 50,
					}}
				>
					<SegmentedButtons
						value={payment}
						onValueChange={handleSegmentedButtonsChange}
						density="medium"
						buttons={payments.map(p => ({
							label: p[0].toUpperCase() + p.substring(1),
							value: p,
						}))}
					/>
				</View>
				<View style={{ margin: 10 }}>
					<Title title={"Donors List"} />
				</View>
				<View style={styles.barChartContainer}>
					<BarChartContributions
						data={barChartData}
						payment={payment}
						fundType={fundType}
						donorsNames={data.lists.donorNamesList}
						donorIsoCodes={data.lists.donorIsoCodesList}
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
							'Touch the rows to see detailed values. Touch "Donor" for sorting alphabetically, and "Allocations" for sorting by value.'
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

export default Contributions;
