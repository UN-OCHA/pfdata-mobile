import React, { useContext, useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Snackbar, useTheme, Card } from "react-native-paper";
import DataContext from "../context/DataContext";
import SelectionContext from "../context/SelectionContext";
import { ListContext } from "../context/ListProvider";
import TopSelector from "../components/TopSelector";
import TopCardRow from "../components/TopCardRow";
import Title from "../components/Title";
import BarChart from "../components/BarChart";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ByPartners({ navigation, route }) {
	const { colors } = useTheme();

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

	function onDismissSnackBar() {
		setSnackbarVisible(false);
	}

	const byPartnersData = countryData.allocations.find(
		d => d.year === year
	).byPartners;

	const allocationsValue = byPartnersData[fundType];
	const partnersValue = byPartnersData[`partners${fundType}`].size;

	const thisFundIconColor =
		fundType === "total"
			? colors.unColor
			: colors[`${fundType}Analogous`][1];

	const barChartData =
		fundType === "total"
			? byPartnersData.partnersDatacbpf.concat(
					byPartnersData.partnersDatacerf
			  )
			: byPartnersData[`partnersData${fundType}`];

	useEffect(() => {
		AsyncStorage.getItem("snackbarByPartners").then(value => {
			if (value !== "true") {
				setSnackbarVisible(true);
				AsyncStorage.setItem("snackbarByPartners", "true");
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
					fundTypes={byPartnersData.fundTypes}
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
								title="Partners"
								value={partnersValue}
								formatter={e => ~~e}
								icon="md-people-sharp"
								fontSize={14}
								fundType={fundType}
							/>
						</Card.Content>
					</Card>
				</View>
				<View style={{ margin: 10 }}>
					<Title title={"Partners Summary"} />
				</View>
				<View style={styles.summary}>
					{byPartnersData[`partnersSummary${fundType}`]
						.sort((a, b) => b.value - a.value)
						.map((d, i) => (
							<View
								key={i}
								style={styles.summaryRow}
							>
								<Text
									style={{
										...styles.bullet,
										color: thisFundIconColor,
									}}
								>
									{"\u2b24"}
								</Text>
								<Text style={styles.summaryName}>
									{data.lists.partnersList[d.partnerCode] +
										":"}
								</Text>
								<Text style={styles.summaryValue}>
									{"$" + (~~d.value).toLocaleString()}
								</Text>
							</View>
						))}
				</View>
				<View style={{ margin: 10 }}>
					<Title title={"Partners List"} />
				</View>
				<View style={styles.barChartContainer}>
					<BarChart
						data={barChartData}
						fundType={fundType}
						partnersNames={data.lists.partnersNamesList}
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
							'Touch the rows to see detailed values. Touch "Partner Name" for sorting alphabetically, and "Allocations" for sorting by value.'
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

export default ByPartners;
