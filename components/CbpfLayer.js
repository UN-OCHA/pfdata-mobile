import React from "react";
import { StyleSheet } from "react-native";
import { Circle, G } from "react-native-svg";
import { format } from "d3";

function CbpfLayer({ data, projection, scale, setTooltipData, showModal }) {
	const moneyFormat = format(",.0f");
	function handleTooltip(datum) {
		setTooltipData([
			{ name: "Location", value: datum.location },
			{ name: "Allocations", value: "$" + moneyFormat(datum.value) },
		]);
		showModal();
	}

	return (
		<G>
			{data.map((d, i) => (
				<Circle
					style={styles.cbpfCircle}
					key={i}
					r={scale(d.value)}
					transform={`translate(${projection([d.lon, d.lat])})`}
					onPress={() => handleTooltip(d)}
					onClick={() => handleTooltip(d)} //REMOVE
				/>
			))}
		</G>
	);
}

const styles = StyleSheet.create({
	cbpfCircle: {
		fill: "rgba(243, 114, 97, 0.5)",
		stroke: "rgba(102, 102, 102, 0.8)",
		strokeWidth: 1,
	},
});

export default CbpfLayer;
