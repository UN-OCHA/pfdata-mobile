import { hsl } from "d3-color";

function createDesaturatedColors(colors, desaturatedColors = {}) {
	for (const [key, value] of Object.entries(colors)) {
		if (typeof value === "string" && value !== "transparent") {
			desaturatedColors[key] = desaturateColor(value);
		} else if (typeof value === "object") {
			createDesaturatedColors(value, (desaturatedColors[key] = {}));
		}
	}
	return desaturatedColors;
}

function desaturateColor(colorString) {
	const colorObject = hsl(colorString);
	colorObject.s *= 0.2;
	return colorObject.toString();
}

export default createDesaturatedColors;
