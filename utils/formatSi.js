import { formatPrefix } from "d3";

function formatSI(value) {
	const length = (~~Math.log10(value) + 1) % 3;
	const digits = length === 1 ? 2 : length === 2 ? 1 : 0;
	return formatPrefix("." + digits + "~", value)(value).replace("G", "B");
}

export default formatSI;
