import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme, Button, Modal, Portal, Text } from "react-native-paper";

function Tooltip({ visible, hideModal, tooltipData }) {
	const { colors } = useTheme();

	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={hideModal}
				contentContainerStyle={styles.modalStyle}
			>
				<View style={styles.modalContainer}>
					{tooltipData &&
						tooltipData.map((d, i) => (
							<View
								key={i}
								style={styles.row}
							>
								<Text
									style={styles.rowName}
								>{`${d.name}:`}</Text>
								<Text style={styles.rowValue}>{d.value}</Text>
							</View>
						))}
					<View style={styles.buttonContainer}>
						<Button
							style={{ margin: 5 }}
							mode="contained"
							buttonColor={colors.unColor}
							onPress={hideModal}
						>
							Close
						</Button>
					</View>
				</View>
			</Modal>
		</Portal>
	);
}

const styles = StyleSheet.create({
	modalStyle: {
		backgroundColor: "white",
		marginHorizontal: 40,
		marginVertical: 20,
		padding: 10,
		borderRadius: 10,
	},
	row: {
		flexDirection: "row",
		marginVertical: 5,
		width: "90%",
	},
	modalContainer: {
		flexDirection: "column",
	},
	rowName: {
		fontSize: 16,
		flexWrap: "wrap",
	},
	rowValue: {
		fontWeight: "bold",
		marginLeft: 10,
		fontSize: 16,
	},
	buttonContainer: {
		marginTop: 26,
		marginBottom: 0,
		flexDirection: "row",
		justifyContent: "center",
	},
});

export default Tooltip;
