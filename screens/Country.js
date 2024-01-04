import React, { useEffect, useContext, useState } from "react";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { Drawer as DrawerPaper } from "react-native-paper";
import { setStatusBarStyle } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import DataContext from "../context/DataContext";
import SelectionContext from "../context/SelectionContext";
import Overview from "./Overview";
import Map from "./Map";
import ByPartners from "./Bypartners";
import BySectors from "./Bysectors";
import Contributions from "./Contributions";
import About from "./About";
import Spacer from "../components/Spacer";
import Tooltip from "../components/Tooltip";

const Drawer = createDrawerNavigator();

//creates the country screen
function Country({ navigation, route }) {
	const data = useContext(DataContext);
	const countryData = data.countriesData.find(
		d => d.fundId === route.params.fundId
	);
	const years = countryData.allocations.map(d => d.year);
	const hasContributions = countryData.contributions.length > 0;

	const [year, setYear] = useState(years[years.length - 1]);
	const [fundType, setFundType] = useState("total");

	const [visible, setVisible] = useState(false);
	const [tooltipData, setTooltipData] = useState(null);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	const { colors } = useTheme();
	let name = route.params.fundName;

	setStatusBarStyle("light");

	useEffect(() => {
		navigation.setOptions({ headerTitle: name });
	}, []);

	function CustomDrawerContent({ navigation, state }) {
		const focusedRoute = state.routeNames[state.index];
		return (
			<DrawerContentScrollView>
				<DrawerPaper.CollapsedItem
					label="Overview"
					focusedIcon={() => (
						<Ionicons
							name="md-pie-chart"
							size={26}
							style={{ marginTop: -3 }}
							color={colors.unColorDarker}
						/>
					)}
					unfocusedIcon={() => (
						<Ionicons
							name="md-pie-chart-outline"
							size={26}
							style={{ marginTop: -3 }}
						/>
					)}
					active={focusedRoute === "Overview"}
					onPress={() => navigation.navigate("Overview")}
				/>
				<Spacer />
				<DrawerPaper.CollapsedItem
					label="Map"
					theme={{
						colors: { onSecondaryContainer: colors.unColorDarker },
					}}
					focusedIcon="map-marker"
					unfocusedIcon="map-marker-outline"
					active={focusedRoute === "Map"}
					onPress={() => navigation.navigate("Map")}
				/>
				<Spacer />
				<DrawerPaper.CollapsedItem
					label="By Partners"
					theme={{
						colors: { onSecondaryContainer: colors.unColorDarker },
					}}
					focusedIcon="handshake"
					unfocusedIcon="handshake-outline"
					active={focusedRoute === "ByPartners"}
					onPress={() => navigation.navigate("ByPartners")}
				/>
				<Spacer />
				<DrawerPaper.CollapsedItem
					label="By Sectors"
					theme={{
						colors: { onSecondaryContainer: colors.unColorDarker },
					}}
					focusedIcon="home-city"
					unfocusedIcon="home-city-outline"
					active={focusedRoute === "BySectors"}
					onPress={() => navigation.navigate("BySectors")}
				/>
				<Spacer />
				{hasContributions && (
					<DrawerPaper.CollapsedItem
						label="Contributions"
						theme={{
							colors: {
								onSecondaryContainer: colors.unColorDarker,
							},
							fonts: {
								labelMedium: {
									letterSpacing: 0.15,
								},
							},
						}}
						focusedIcon={() => (
							<Ionicons
								name="md-cash"
								size={26}
								style={{ marginTop: -3 }}
								color={colors.unColorDarker}
							/>
						)}
						unfocusedIcon={() => (
							<Ionicons
								name="md-cash-outline"
								size={26}
								style={{ marginTop: -3 }}
							/>
						)}
						active={focusedRoute === "Contributions"}
						onPress={() => navigation.navigate("Contributions")}
					/>
				)}
				{hasContributions && <Spacer />}
				<DrawerPaper.CollapsedItem
					label="About"
					theme={{
						colors: { onSecondaryContainer: colors.unColorDarker },
					}}
					focusedIcon="alpha-i-circle"
					unfocusedIcon="alpha-i-circle-outline"
					active={focusedRoute === "About"}
					onPress={() => navigation.navigate("About")}
				/>
			</DrawerContentScrollView>
		);
	}

	return (
		<SelectionContext.Provider
			value={{
				year,
				setYear,
				fundType,
				setFundType,
				years,
				setTooltipData,
				showModal,
			}}
		>
			<Tooltip
				visible={visible}
				tooltipData={tooltipData}
				hideModal={hideModal}
				onDismiss={hideModal}
			/>
			<NavigationContainer independent={true}>
				<Drawer.Navigator
					initialRouteName="Overview"
					drawerContent={props => <CustomDrawerContent {...props} />}
					screenOptions={{
						drawerStyle: {
							width: "30%",
							paddingTop: 20,
							alignItems: "center",
						},
					}}
				>
					<Drawer.Screen
						name="Overview"
						component={Overview}
						options={{
							headerShown: false,
						}}
						initialParams={{ fundId: route.params.fundId }}
					/>
					<Drawer.Screen
						name="Map"
						component={Map}
						options={{
							headerShown: false,
						}}
						initialParams={{ fundId: route.params.fundId }}
					/>
					<Drawer.Screen
						name="ByPartners"
						component={ByPartners}
						options={{
							headerShown: false,
						}}
						initialParams={{ fundId: route.params.fundId }}
					/>
					<Drawer.Screen
						name="BySectors"
						component={BySectors}
						options={{
							headerShown: false,
						}}
						initialParams={{ fundId: route.params.fundId }}
					/>
					<Drawer.Screen
						name="Contributions"
						component={Contributions}
						options={{
							headerShown: false,
						}}
						initialParams={{ fundId: route.params.fundId }}
					/>
					<Drawer.Screen
						name="About"
						component={About}
						options={{
							headerShown: false,
						}}
						initialParams={{ fundId: route.params.fundId }}
					/>
				</Drawer.Navigator>
			</NavigationContainer>
		</SelectionContext.Provider>
	);
}

export default Country;
