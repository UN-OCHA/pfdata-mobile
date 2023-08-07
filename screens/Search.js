import React, { useContext, useState } from "react";
import { View, StyleSheet, FlatList, StatusBar } from "react-native";
import { Searchbar } from "react-native-paper";
import DataContext from "../context/DataContext";
import CountrySurface from "../components/CountrySurface";

//creates the search screen
function Search(props) {
	const { searchData } = useContext(DataContext);
	const [searchText, setSearchText] = useState("");

	const countryListData =
		searchText === ""
			? searchData
			: searchData.filter(
					item =>
						item.fundAbbreviatedName
							.toLowerCase()
							.includes(searchText.toLowerCase()) ||
						item.fundName
							.toLowerCase()
							.includes(searchText.toLowerCase())
			  );

	function onChangeText(text) {
		setSearchText(text);
	}

	return (
		<View
			style={{
				...styles.container,
				paddingTop: StatusBar.currentHeight || 0,
			}}
		>
			<Searchbar
				style={styles.searchBar}
				placeholder="Search"
				onChangeText={onChangeText}
				value={searchText}
			/>
			<FlatList
				style={styles.list}
				data={countryListData}
				initialNumToRender={16}
				renderItem={({ item }) => (
					<CountrySurface
						navigation={props.navigation}
						fundTypes={item.fundTypes}
						fundId={item.fundId}
						fundName={item.fundName}
						fundAbbreviatedName={item.fundAbbreviatedName}
					/>
				)}
				keyExtractor={item => item.fundId}
			></FlatList>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	searchBar: {
		margin: 10,
	},
	list: {
		paddingTop: 6,
	},
});

export default Search;
