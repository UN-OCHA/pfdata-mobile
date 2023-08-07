import React, { useContext, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Appbar, Snackbar } from "react-native-paper";
import { ListContext } from "../context/ListProvider";
import DataContext from "../context/DataContext";
import { useTheme } from "react-native-paper";
import CountrySurface from "../components/CountrySurface";

//creates the 'My list' screen.
function Mylist(props) {
	const { colors } = useTheme();
	const { list } = useContext(ListContext);
	const [visible, setVisible] = useState(!list.length);
	const { searchData } = useContext(DataContext);

	const listData = searchData.filter(item => list.includes(item.fundId));

	const onDismissSnackBar = () => setVisible(false);

	return (
		<View style={styles.container}>
			<Appbar.Header
				mode="small"
				style={{ ...styles.header, backgroundColor: colors.unColor }}
			>
				<Appbar.Content
					style={styles.headerContent}
					titleStyle={styles.title}
					title="My Countries"
				/>
			</Appbar.Header>
			{!!list.length && (
				<FlatList
					style={styles.list}
					data={listData}
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
			)}
			{!list.length && (
				<Snackbar
					duration={Number.POSITIVE_INFINITY}
					visible={visible}
					onDismiss={onDismissSnackBar}
					action={{
						label: "Clear",
						onPress: onDismissSnackBar,
					}}
				>
					There are no countries selected. To add a country to this
					list, please go to the Search tab and tap the menu icon on
					the right of the country name, or toggle the switch on the
					top of the country page.
				</Snackbar>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	header: {
		elevation: 4,
	},
	headerContent: {
		alignItems: "center",
	},
	title: {
		fontSize: 20,
		color: "#fff",
	},
	list: {
		paddingTop: 12,
	},
});

export default Mylist;
