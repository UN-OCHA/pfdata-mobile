import { json as d3Json, csv as d3Csv } from "d3-fetch";
import { autoType } from "d3-dsv";

function fetchFile(url, method, dataFilter) {
	const fetchMethod = method === "csv" ? d3Csv : d3Json;
	const rowFunction = method === "csv" ? d => verifyRow(d, dataFilter) : null;
	return fetchMethod(url, rowFunction).then(fetchedData => fetchedData);
}

function verifyRow(obj, dataFilter) {
	autoType(obj);
	let validRow;
	if (dataFilter) {
		validRow = dataFilter.columns.every(column => {
			let filterResult, typeResult;
			typeResult =
				typeof column.type === "function"
					? column.type(obj[column.name])
					: typeof obj[column.name] === column.type;
			if (typeResult)
				filterResult = column.filterFunction
					? column.filterFunction(obj[column.name])
					: true;
			return filterResult && typeResult;
		});
		if (validRow) {
			return obj;
		} else {
			return null;
		}
	}
	return obj;
}

export default fetchFile;
