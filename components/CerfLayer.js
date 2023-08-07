import React from "react";
import { StyleSheet } from "react-native";
import { Path, G } from "react-native-svg";

function CerfLayer({
	data,
	projection,
	markerAttribute,
	setTooltipData,
	showModal,
}) {
	function handleTooltip(datum) {
		setTooltipData([
			{ name: "Location", value: datum.location },
			{ name: "Allocations", value: "No value available" },
		]);
		showModal();
	}

	return (
		<G>
			{data.map((d, i) => (
				<Path
					key={i}
					d={markerAttribute}
					transform={`translate(${projection([d.lon, d.lat])})`}
					style={styles.cerfMarker}
					strokeWidth={1}
					onPress={() => handleTooltip(d)}
					onClick={() => handleTooltip(d)} //REMOVE
				/>
			))}
		</G>
	);
}

const styles = StyleSheet.create({
	cerfMarker: {
		fill: "rgba(251, 212, 92, 0.5)",
		stroke: "rgba(102, 102, 102, 0.8)",
		strokeWidth: 1,
	},
});

export default CerfLayer;
