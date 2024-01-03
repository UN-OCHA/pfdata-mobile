import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Card, Snackbar } from "react-native-paper";
import { Svg, Circle, Path } from "react-native-svg";
import { geoEquirectangular, scaleSqrt, max } from "d3";
import { feature } from "topojson-client";
import DataContext from "../context/DataContext";
import SelectionContext from "../context/SelectionContext";
import { ListContext } from "../context/ListProvider";
import TopSelector from "../components/TopSelector";
import TopCardRow from "../components/TopCardRow";
import MapLayer from "../components/MapLayer";
import CerfLayer from "../components/CerfLayer";
import CbpfLayer from "../components/CbpfLayer";
import formatSI from "../utils/formatSi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useSwipe from "../utils/useswipe";

function Map({ navigation, route }) {
	const maxRadius = 20;
	const markerAttribute =
		"M0,0l-8.8-17.7C-12.1-24.3-7.4-32,0-32h0c7.4,0,12.1,7.7,8.8,14.3L0,0z";

	const data = useContext(DataContext);
	const countryData = data.countriesData.find(
		d => d.fundId === route.params.fundId
	);
	const mapPadding = 20;

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

	const mapData = countryData.allocations.find(d => d.year === year).map;

	const allocationsValue = max(mapData[`${fundType}MapData`], d => d.value);

	const maxValue = max(mapData.cbpfMapData, d => d.value);

	const radiusScale = scaleSqrt().domain([0, maxValue]).range([1, maxRadius]);

	const [viewWidth, setViewWidth] = useState(0);
	const [viewHeight, setViewHeight] = useState(0);
	const [snackbarVisible, setSnackbarVisible] = useState(false);

	const { onTouchStart, onTouchEnd } = useSwipe(() =>
		navigation.openDrawer()
	);

	function onDismissSnackBar() {
		setSnackbarVisible(false);
	}

	const projection = geoEquirectangular();

	const countryFeatures = feature(
		data.unworldmap,
		data.unworldmap.objects.wrl_polbnda_int_simple_uncs
	);

	countryFeatures.features = countryFeatures.features.filter(
		d =>
			d.properties.ISO_2 ===
			data.lists.fundIsoCodesList[route.params.fundId]
	);

	projection.fitExtent(
		[
			[mapPadding, mapPadding],
			[viewWidth - mapPadding, viewHeight - mapPadding],
		],
		countryFeatures
	);

	function onLayout(e) {
		setViewWidth(e.nativeEvent.layout.width);
		setViewHeight(e.nativeEvent.layout.height);
	}

	useEffect(() => {
		AsyncStorage.getItem("snackbarMap").then(value => {
			if (value !== "true") {
				setSnackbarVisible(true);
				AsyncStorage.setItem("snackbarMap", "true");
			}
		});
	}, []);

	return (
		<View
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
			style={styles.container}
		>
			<TopSelector
				fundId={route.params.fundId}
				year={year}
				setYear={setYear}
				fundType={fundType}
				setFundType={setFundType}
				list={list}
				setList={setList}
				fundTypes={mapData.fundTypes}
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
					</Card.Content>
				</Card>
			</View>
			<View
				style={styles.mapContainer}
				onLayout={onLayout}
			>
				{!viewWidth ? null : (
					<Svg
						width={viewWidth}
						height={viewHeight}
					>
						<MapLayer
							projection={projection}
							features={countryFeatures.features}
						/>
						{(fundType === "total" || fundType === "cbpf") && (
							<CbpfLayer
								data={mapData.cbpfMapData}
								projection={projection}
								scale={radiusScale}
								setTooltipData={setTooltipData}
								showModal={showModal}
							/>
						)}
						{(fundType === "total" || fundType === "cerf") && (
							<CerfLayer
								data={mapData.cerfMapData}
								projection={projection}
								markerAttribute={markerAttribute}
								setTooltipData={setTooltipData}
								showModal={showModal}
							/>
						)}
					</Svg>
				)}
			</View>
			<View style={{ ...styles.cbpfLegend, height: maxRadius * 2 + 10 }}>
				{mapData.cbpfMapData.length > 0 ? (
					<View style={styles.cbpfLegendWrap}>
						<Svg
							width={2 + maxRadius * 2}
							height={2 + maxRadius * 2}
						>
							<Circle
								cx={maxRadius + 1}
								cy={maxRadius + 1}
								r={maxRadius}
								style={styles.cbpfCircle}
							/>
						</Svg>
						<View style={styles.cbpfText}>
							<Text>Maximum CBPF allocation: </Text>
							<Text style={{ fontWeight: "bold" }}>
								{`$${formatSI(maxValue)
									.replace("k", " Thousand")
									.replace("M", " Million")
									.replace("G", " Billion")}`}
							</Text>
						</View>
					</View>
				) : (
					<View>
						<Text style={{ marginLeft: 46 }}>
							No CBPF allocations
						</Text>
					</View>
				)}
			</View>
			<View style={styles.cerfLegend}>
				{mapData.cerfMapData.length > 0 ? (
					<View style={styles.cerfLegendWrap}>
						<Svg
							width={36}
							height={36}
						>
							<Path
								d={markerAttribute}
								style={styles.cerfMarker}
								transform={`translate(18, 35)`}
							/>
						</Svg>
						<View style={styles.cerfText}>
							<Text style={{ width: "90%" }}>
								CERF allocations have coordinates only, no value
								displayed.
							</Text>
						</View>
					</View>
				) : (
					<View>
						<Text style={{ marginLeft: 46 }}>
							No CERF allocations
						</Text>
					</View>
				)}
			</View>
			<Snackbar
				duration={Number.POSITIVE_INFINITY}
				visible={snackbarVisible}
				onDismiss={onDismissSnackBar}
				action={{
					label: "Clear",
					onPress: onDismissSnackBar,
				}}
			>
				Touch the CBPF circles to see the allocation values and the
				location name, and the CERF markers to see the location name (no
				value available).
			</Snackbar>
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
	mapContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		margin: 0,
	},
	cbpfLegend: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		marginHorizontal: 10,
		marginBottom: 5,
		marginTop: 10,
		paddingTop: 10,
		borderTopColor: "#ccc",
		borderTopWidth: 1,
	},
	cerfLegend: {
		height: 36,
		width: "100%",
		marginHorizontal: 10,
		marginTop: 5,
		marginBottom: 15,
	},
	cerfLegendWrap: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	cbpfLegendWrap: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	cerfText: {
		marginLeft: 10,
		flex: 1,
		flexWrap: "wrap",
	},
	cbpfText: {
		marginLeft: 10,
		flexDirection: "row",
		flex: 1,
		flexWrap: "wrap",
	},
	cbpfCircle: {
		fill: "rgba(243, 114, 97, 0.5)",
		stroke: "rgba(102, 102, 102, 0.8)",
		strokeWidth: 1,
	},
	cerfMarker: {
		fill: "rgba(251, 212, 92, 0.5)",
		stroke: "rgba(102, 102, 102, 0.8)",
		strokeWidth: 1,
	},
});

export default Map;
