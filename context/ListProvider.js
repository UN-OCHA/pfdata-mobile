import React, { useState, useEffect, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ListContext = createContext();

// eslint-disable-next-line react/prop-types
function ListProvider({ children }) {
	const [list, setList] = useState([]);

	useEffect(() => {
		const getData = async () => {
			try {
				const jsonValue = await AsyncStorage.getItem("mylist");
				if (jsonValue != null) {
					setList(JSON.parse(jsonValue));
				}
			} catch (error) {
				console.log(error);
			}
		};
		getData();
	}, []);

	useEffect(() => {
		const saveData = async () => {
			try {
				const jsonValue = JSON.stringify(list);
				await AsyncStorage.setItem("mylist", jsonValue);
			} catch (e) {
				console.log(e);
			}
		};
		saveData();
	}, [list]);

	return (
		<ListContext.Provider value={{ list, setList }}>
			{children}
		</ListContext.Provider>
	);
}

export default ListProvider;
