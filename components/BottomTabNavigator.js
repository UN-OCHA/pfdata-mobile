import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";
import React from "react";
import { setStatusBarStyle } from "expo-status-bar";
import Search from "../screens/Search";
import Mylist from "../screens/Mylist";
import TabBarIcon from "./TabBarIcon";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Search";

function BottomTabNavigator() {
	return (
		<BottomTab.Navigator
			initialRouteName={INITIAL_ROUTE_NAME}
			tabBar={({ navigation, state, descriptors, insets }) => (
				<BottomNavigation.Bar
					theme={{
						colors: {
							elevation: {
								level2: "#3289C9",
							},
							secondaryContainer: "#fff",
							onSurface: "#fff",
							onSurfaceVariant: "#ccc",
						},
					}}
					navigationState={state}
					safeAreaInsets={insets}
					onTabPress={({ route, preventDefault }) => {
						setStatusBarStyle(
							route.name === "Search" ? "dark" : "light"
						);
						const event = navigation.emit({
							type: "tabPress",
							target: route.key,
							canPreventDefault: true,
						});
						if (event.defaultPrevented) {
							preventDefault();
						} else {
							navigation.dispatch({
								...CommonActions.navigate(
									route.name,
									route.params
								),
								target: state.key,
							});
						}
					}}
					renderIcon={({ route, focused, color }) => {
						const { options } = descriptors[route.key];
						if (options.tabBarIcon) {
							return options.tabBarIcon({
								focused,
								color,
								size: 26,
							});
						}

						return null;
					}}
					getLabelText={({ route }) => {
						const { options } = descriptors[route.key];
						const label =
							options.tabBarLabel !== undefined
								? options.tabBarLabel
								: options.title !== undefined
								? options.title
								: route.title;

						return label;
					}}
				/>
			)}
		>
			<BottomTab.Screen
				name="Search"
				component={Search}
				options={{
					title: "Search",
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabBarIcon
							focused={focused}
							size={28}
							name="text-box-search-outline"
						/>
					),
				}}
			/>
			<BottomTab.Screen
				name="MyList"
				component={Mylist}
				options={{
					title: "My Countries",
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabBarIcon
							focused={focused}
							size={28}
							name="book-outline"
						/>
					),
				}}
			/>
		</BottomTab.Navigator>
	);
}

export default BottomTabNavigator;
