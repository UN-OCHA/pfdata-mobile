import React from "react";
import { StyleSheet } from "react-native";
import { Path, G } from "react-native-svg";
import { geoPath } from "d3-geo";

function MapLayer({ features, projection }) {
	const pathGenerator = geoPath().projection(projection);
	return (
		<G>
			{features.map((feature, index) => {
				return (
					<Path
						key={index}
						d={pathGenerator(feature)}
						style={styles.mapLayer}
					/>
				);
			})}
		</G>
	);
}

const styles = StyleSheet.create({
	mapLayer: {
		fill: "#f1f1f1",
		stroke: "#d5d5d5",
		strokeWidth: 0.5,
	},
});

export default MapLayer;
