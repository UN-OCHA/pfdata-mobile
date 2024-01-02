import React from "react";
import { StyleSheet } from "react-native";
import { Svg, G, Path, Text } from "react-native-svg";
import { useTheme } from "react-native-paper";
import { pie, arc, format } from "d3";

function PieChart({ data, fundType, viewWidth, setTooltipData, showModal }) {
	const padAngleDonut = 0.035;
	const donutThickness = 0.5;
	const donutGenerator = pie().value(d => d.value);
	const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);
	const arcGenerator = arc()
		.outerRadius(viewWidth / 2)
		.innerRadius((viewWidth / 2) * (1 - donutThickness));
	const { colors } = useTheme();

	const donutData = donutGenerator
		.padAngle(data.every(e => e.value) ? padAngleDonut : 0)
		.startAngle(0)(data);

	const colorsByFund =
		fundType === "cerf"
			? colors.cerfAnalogous
			: fundType === "cbpf"
			? colors.cbpfAnalogous
			: [];

	function positionText(d) {
		const [x, y] = arcGenerator.centroid(d);
		const angle = (d.startAngle + d.endAngle) / 2;
		const radius = (viewWidth * donutThickness) / 4;
		const dist = 1.2 * radius;
		const textX = x + Math.sin(angle) * dist;
		const textY = y + Math.cos(angle) * dist;
		return { textX, textY };
	}

	const moneyFormat = format(",.0f");
	function handleTooltip(datum) {
		setTooltipData([
			{
				name: fundType === "total" ? "Fund" : "Allocation type",
				value:
					fundType === "total"
						? datum.data.name.toUpperCase()
						: datum.data.name,
			},
			{ name: "Allocations", value: "$" + moneyFormat(datum.value) },
		]);
		showModal();
	}

	return !viewWidth ? null : (
		<Svg
			width={viewWidth}
			height={viewWidth}
		>
			<G transform={`translate(${viewWidth / 2}, ${viewWidth / 2})`}>
				{donutData.map((d, i) => (
					<Path
						key={i}
						d={arcGenerator(d)}
						fill={
							fundType === "total"
								? colors[`${d.data.name}Color`]
								: colorsByFund[colorsByFund.length - 2 - i]
						}
						style={styles.path}
						onPress={() => handleTooltip(d)}
						onClick={() => handleTooltip(d)} //REMOVE
					/>
				))}
				{donutData.map((d, i) => (
					<Text
						style={styles.text}
						key={i}
						x={
							d.data.value === totalValue
								? 0
								: d.data.value / totalValue < 0.05
								? positionText(d).textX + 10
								: arcGenerator.centroid(d)[0]
						}
						y={
							d.data.value === totalValue
								? 0
								: d.data.value / totalValue < 0.05
								? positionText(d).textY + 10
								: arcGenerator.centroid(d)[1]
						}
						fill={
							d.data.value === totalValue ||
							d.data.value / totalValue < 0.05
								? "#444"
								: fundType === "cbpf"
								? "#fff"
								: "#000"
						}
						fontSize={viewWidth / 10}
					>
						{d.data.value
							? ~~((d.data.value * 100) / totalValue) + "%"
							: ""}
					</Text>
				))}
			</G>
		</Svg>
	);
}

const styles = StyleSheet.create({
	text: {
		fontSize: 18,
		fontWeight: "bold",
		textAnchor: "middle",
		alignmentBaseline: "middle",
		fontFamily: "Roboto",
		stroke: "#fff",
		strokeWidth: 2,
		paintOrder: "stroke",
		pointerEvents: "none",
	},
	path: {
		outlineStyle: "none",
	},
});

export default PieChart;
