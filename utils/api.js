import { useState, useEffect } from "react";
import fetchFile from "./fetchfile";
import dataFilters from "./datafilters";
import processData from "./processdata";

function useData() {
	//API urls
	const lastModifiedUrl = "https://cbpfapi.unocha.org/vo2/odata/LastModified",
		unworldmapUrl =
			"https://cbpfgms.github.io/pfbi-data/map/unworldmap.json",
		masterFundsUrl =
			"https://cbpfgms.github.io/pfbi-data/mst/MstCountry.json",
		masterDonorsUrl =
			"https://cbpfgms.github.io/pfbi-data/mst/MstDonor.json",
		masterAllocationTypesUrl =
			"https://cbpfgms.github.io/pfbi-data/mst/MstAllocation.json",
		masterFundTypesUrl =
			"https://cbpfgms.github.io/pfbi-data/mst/MstFund.json",
		masterPartnerTypesUrl =
			"https://cbpfgms.github.io/pfbi-data/mst/MstOrganization.json",
		masterClusterTypesUrl =
			"https://cbpfgms.github.io/pfbi-data/mst/MstCluster.json",
		masterPartnersUrl =
			"https://cbpfgms.github.io/pfbi-data/mst/MstPartner.json",
		masterUnAgenciesUrl =
			"https://cerfgms-webapi.unocha.org/v1/agency/All.json",
		contributionsDataUrl =
			"https://cbpfgms.github.io/pfbi-data/contributionbycerfcbpf.csv",
		allocationsDataUrl =
			"https://cbpfgms.github.io/pfbi-data/sectorSummarybyOrg.csv",
		adminLevel1DataUrl =
			"https://cbpfgms.github.io/pfbi-data/fund_adm1.csv";

	const [data, setData] = useState([]),
		[loading, setLoading] = useState(true),
		[error, setError] = useState(null);

	useEffect(() => {
		Promise.all([
			fetchFile(lastModifiedUrl, "json", null),
			fetchFile(unworldmapUrl, "json", null),
			fetchFile(masterFundsUrl, "json", null),
			fetchFile(masterDonorsUrl, "json", null),
			fetchFile(masterAllocationTypesUrl, "json", null),
			fetchFile(masterFundTypesUrl, "json", null),
			fetchFile(masterPartnerTypesUrl, "json", null),
			fetchFile(masterClusterTypesUrl, "json", null),
			fetchFile(masterPartnersUrl, "json", null),
			fetchFile(masterUnAgenciesUrl, "json", null),
			fetchFile(contributionsDataUrl, "csv", dataFilters.contributionsData),
			fetchFile(allocationsDataUrl, "csv", dataFilters.allocationsData),
			fetchFile(adminLevel1DataUrl, "csv", dataFilters.adminLevel1Data),
		])
			.then(rawData => {
				const allData = processData(rawData);
				setData(allData);
				setLoading(false);
			})
			.catch(error => {
				setError(error);
				setLoading(false);
			});
	}, []);

	return { data, loading, error };
}

export default useData;
