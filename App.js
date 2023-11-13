import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
	MD3LightTheme as DefaultTheme,
	PaperProvider,
} from "react-native-paper";
import useData from "./utils/api";
import DataContext from "./context/DataContext";
import ListProvider from "./context/ListProvider";
import Loading from "./screens/Loading";
import Error from "./screens/Error";
import Country from "./screens/Country";
import BottomTabNavigator from "./components/BottomTabNavigator";
import createDesaturatedColors from "./utils/desaturatedColors";
import * as serviceWorkerRegistration from "./src/serviceWorkerRegistration";

//for debugging
if (typeof window !== "undefined") {
	window._frameTimestamp = null;
}

const Stack = createStackNavigator();

const theme = {
	...DefaultTheme,
	colors: {
		...createDesaturatedColors(DefaultTheme.colors),
		unColor: "#3289C9",
		unColorDarker: "#286DA0",
		unColorLighter: "#6EB3DD",
		cerfColor: "#FBD45C",
		cerfColorDarker: "#C9AA4A",
		cerfColorLighter: "#FCEB8F",
		cbpfColor: "#F37261",
		cbpfColorDarker: "#E74C3C",
		cbpfColorLighter: "#F79C8F",
		cerfAnalogous: ["#E48F07", "#E2A336", "#FBD45C", "#FBE23E"],
		cbpfAnalogous: ["#B52625", "#CE2E2D", "#F37261", "#F79C8F"],
	},
};

function App() {
	const { data, loading, error } = useData();

	//IMPORTANT: use StatusBar or SafeAreaView?
	return (
		<PaperProvider theme={theme}>
			{loading ? (
				<Loading />
			) : error ? (
				<Error />
			) : (
				<DataContext.Provider value={data}>
					<ListProvider>
						<NavigationContainer>
							<Stack.Navigator>
								<Stack.Screen
									name="Root"
									component={BottomTabNavigator}
									options={{ headerShown: false }}
								/>
								<Stack.Screen
									name="Country"
									component={Country}
									options={{
										headerStyle: {
											backgroundColor:
												theme.colors.unColor,
										},
										headerTintColor: "#fff",
										headerTitleAlign: "center",
										headerShown: true,
										headerTitle: "",
									}}
								/>
							</Stack.Navigator>
						</NavigationContainer>
					</ListProvider>
				</DataContext.Provider>
			)}
		</PaperProvider>
	);
}

export default App;

serviceWorkerRegistration.register();
