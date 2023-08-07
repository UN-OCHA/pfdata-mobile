import React from "react";
import { StyleSheet } from "react-native";
import { Svg, G, Rect, Text, Line } from "react-native-svg";
import { scaleBand, scaleLinear, max, format } from "d3";
import { useTheme } from "react-native-paper";
import formatSI from "../utils/formatSi";

function OverviewBarChart({
	data,
	fundType,
	year,
	viewWidth,
	setTooltipData,
	showModal,
}) {
	const maximumBarWidth = 18;
	const padding = [18, 10, 15, 32];
	const barWidth = Math.min(
		(viewWidth - padding[1] - padding[3]) / data.length,
		maximumBarWidth
	);
	const gridLines = 3;
	const aspectRatio = 0.6;
	const svgWidth = barWidth * data.length + padding[1] + padding[3];
	const svgHeight = viewWidth * aspectRatio;
	const { colors } = useTheme();
	const xScale = scaleBand()
		.domain(data.map(d => d.year))
		.range([padding[3], svgWidth - padding[1]])
		.paddingInner(0.4)
		.paddingOuter(0.2);
	const yScale = scaleLinear()
		.domain([0, max(data, d => d[fundType])])
		.range([svgHeight - padding[2], padding[0]]);

	const moneyFormat = format(",.0f");
	function handleTooltip(datum) {
		setTooltipData([
			{ name: "Year", value: datum.year },
			{ name: "Allocations", value: "$" + moneyFormat(datum[fundType]) },
		]);
		showModal();
	}

	return !viewWidth ? null : (
		<Svg
			width={svgWidth}
			height={svgHeight}
		>
			<G>
				{yScale
					.ticks(gridLines)
					.filter(d => d !== 0)
					.map((d, i) => (
						<G key={i}>
							<Line
								x1={padding[3]}
								y1={yScale(d)}
								x2={svgWidth - padding[1]}
								y2={yScale(d)}
								stroke={"#ccc"}
								strokeWidth={1}
								strokeDasharray={"4,4"}
							/>
							<Text
								x={padding[3] - 4}
								y={yScale(d) + 4}
								style={styles.gridText}
							>
								{format(".0s")(d)}
							</Text>
						</G>
					))}
			</G>
			{data.map((d, i) => (
				<G key={i}>
					<Rect
						x={xScale(d.year)}
						y={yScale(d[fundType])}
						width={xScale.bandwidth()}
						height={svgHeight - padding[2] - yScale(d[fundType])}
						fill={
							d.year === year
								? fundType === "total"
									? colors.unColorDarker
									: colors[`${fundType}ColorDarker`]
								: fundType === "total"
								? colors.unColorLighter
								: colors[`${fundType}Color`]
						}
						onPress={() => handleTooltip(d)}
						onClick={() => handleTooltip(d)} //REMOVE
					/>
					<Text
						x={xScale(d.year) + xScale.bandwidth() / 2}
						y={svgHeight - padding[2] + 10}
						fill="#444"
						style={styles.text}
					>
						{String(d.year).slice(-2)}
					</Text>
				</G>
			))}
			<Text
				x={xScale(year) + xScale.bandwidth() / 2}
				y={yScale(data.find(d => d.year === year)[fundType]) - 6}
				style={styles.value}
			>
				{formatSI(data.find(d => d.year === year)[fundType])}
			</Text>
		</Svg>
	);
}

const styles = StyleSheet.create({
	text: {
		textAnchor: "middle",
		fontSize: 10,
	},
	value: {
		textAnchor: "middle",
		fontSize: 10,
		fontWeight: "bold",
		fontFamily: "Roboto",
	},
	gridText: {
		textAnchor: "end",
		fontSize: 10,
		fill: "#666",
	},
});

export default OverviewBarChart;
