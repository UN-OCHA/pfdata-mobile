// @ts-nocheck
const cbpfStatusList = {},
	cerfIdsList = {},
	fundNamesList = {},
	fundAbbreviatedNamesList = {},
	fundRegionsList = {},
	fundIsoCodesList = {},
	fundIsoCodes3List = {},
	fundLatLongList = {},
	donorNamesList = {},
	donorTypesList = {},
	donorIsoCodesList = {},
	fundTypesList = {},
	partnersList = {},
	clustersList = {},
	allocationTypesList = {},
	unAgenciesNamesList = {},
	unAgenciesShortNamesList = {},
	partnersNamesList = {},
	fundNamesListKeys = [],
	donorNamesListKeys = [],
	cbpfFundsList = [],
	separator = "##";

let cerfPooledFundId;

function processData([
	lastModified,
	unworldmap,
	masterFunds,
	masterDonors,
	masterAllocationTypes,
	masterFundTypes,
	masterPartnerTypes,
	masterClusterTypes,
	masterPartners,
	masterUnAgencies,
	contributionsData,
	allocationsData,
	adminLevel1Data,
]) {
	createFundNamesList(masterFunds);
	createDonorNamesList(masterDonors);
	createFundTypesList(masterFundTypes);
	createPartnersList(masterPartnerTypes);
	createClustersList(masterClusterTypes);
	createAllocationTypesList(masterAllocationTypes);
	createUnAgenciesNamesList(masterUnAgencies);
	createPartnerNamesList(masterPartners);

	//Hardcoded Syria Cross Border ISO 3 code
	fundIsoCodes3List["108"] = "SCB";

	const lists = {
		fundNamesList,
		cbpfStatusList,
		cerfIdsList,
		fundAbbreviatedNamesList,
		fundRegionsList,
		fundIsoCodesList,
		fundIsoCodes3List,
		fundLatLongList,
		donorNamesList,
		donorTypesList,
		donorIsoCodesList,
		fundTypesList,
		partnersList,
		clustersList,
		unAgenciesNamesList,
		unAgenciesShortNamesList,
		partnersNamesList,
		allocationTypesList,
		fundNamesListKeys,
		donorNamesListKeys,
		cerfPooledFundId,
		cbpfFundsList,
	};

	const dataObj = {
		countriesData: [],
		lists,
		unworldmap,
		lastModified: lastModified.value[0].last_updated_date,
		searchData: [],
	};

	allocationsData.forEach(row => {
		const foundFund = dataObj.countriesData.find(
			e => e.fundId === row.PooledFundId
		);
		if (foundFund) {
			foundFund.fundTypesSet.add(row.FundId);
			const foundYear = foundFund.allocations.find(
				e => e.year === row.AllocationYear
			);
			if (foundYear) {
				populateOverview(foundYear.overview, row, lists);
				populatePartners(foundYear.byPartners, row, lists);
				populateSectors(foundYear.bySectors, row, lists);
			} else {
				const allocationsObj = createAllocationsObj(row);
				populateOverview(allocationsObj.overview, row, lists);
				populatePartners(allocationsObj.byPartners, row, lists);
				populateSectors(allocationsObj.bySectors, row, lists);
				foundFund.allocations.push(allocationsObj);
			}
		} else {
			const allocationsObj = createAllocationsObj(row);
			populateOverview(allocationsObj.overview, row, lists);
			populatePartners(allocationsObj.byPartners, row, lists);
			populateSectors(allocationsObj.bySectors, row, lists);
			const obj = {
				fundId: row.PooledFundId,
				fundName: lists.fundNamesList[row.PooledFundId],
				fundAbbreviatedName:
					lists.fundAbbreviatedNamesList[row.PooledFundId],
				fundTypesSet: new Set([row.FundId]),
				allocations: [allocationsObj],
				contributions: [],
			};
			dataObj.countriesData.push(obj);
		}
	});

	adminLevel1Data.forEach(row => {
		const foundFund = dataObj.countriesData.find(
			e => e.fundId === row.PooledFundId
		);
		if (foundFund) {
			const foundYear = foundFund.allocations.find(
				e => e.year === row.AllocationYear
			);
			if (foundYear) {
				populateMap(foundYear.map, row, lists);
			} else {
				console.warn(
					`Admin1 data without allocations data for the year ${row.AllocationYear}\n`,
					row
				);
			}
		} else {
			console.warn("Admin1 data without allocations data\n", row);
		}
	});

	contributionsData.forEach(row => {
		if (row.PooledFundId !== cerfPooledFundId) {
			const foundFund = dataObj.countriesData.find(
				e => e.fundId === row.PooledFundId
			);
			if (foundFund) {
				const foundYear = foundFund.contributions.find(
					e => e.year === row.FiscalYear
				);
				if (foundYear) {
					populateContributions(foundYear, row);
				} else {
					const contributionsObj = createContributionsObj(row);
					populateContributions(contributionsObj, row);
					foundFund.contributions.push(contributionsObj);
				}
			} else {
				const contributionsObj = createContributionsObj(row);
				populateContributions(contributionsObj, row);
				const obj = {
					fundId: row.PooledFundId,
					fundTypesSet: new Set([2]), //2 is the id for CBPF
					fundName: lists.fundNamesList[row.PooledFundId],
					fundAbbreviatedName:
						lists.fundAbbreviatedNamesList[row.PooledFundId],
					contributions: [contributionsObj],
					allocations: [],
				};
				console.warn("Object created for contributions only\n", obj);
				dataObj.countriesData.push(obj);
			}
		}
	});

	dataObj.countriesData.forEach(row => {
		row.fundTypes = Array.from(row.fundTypesSet).map(
			type => dataObj.lists.fundTypesList[type]
		);
		if (row.allocations.length) {
			dataObj.searchData.push({
				fundId: row.fundId,
				fundName: row.fundName,
				fundAbbreviatedName: row.fundAbbreviatedName,
				fundTypes: row.fundTypes,
			});
		}
		if (row.allocations.length) {
			row.allocations.sort((a, b) => a.year - b.year);
		}
		if (row.contributions.length) {
			row.contributions.sort((a, b) => a.year - b.year);
		}
	});

	dataObj.countriesData.sort((a, b) =>
		lists.fundAbbreviatedNamesList[a.fundId].localeCompare(
			lists.fundAbbreviatedNamesList[b.fundId]
		)
	);

	dataObj.searchData.sort((a, b) =>
		lists.fundAbbreviatedNamesList[a.fundId].localeCompare(
			lists.fundAbbreviatedNamesList[b.fundId]
		)
	);

	return dataObj;
}

function createAllocationsObj(row) {
	return {
		year: row.AllocationYear,
		overview: {
			projectscerf: new Set(),
			partnerscerf: new Set(),
			sectorscerf: new Set(),
			projectscbpf: new Set(),
			partnerscbpf: new Set(),
			sectorscbpf: new Set(),
			projectstotal: new Set(),
			partnerstotal: new Set(),
			sectorstotal: new Set(),
			fundTypes: new Set(),
			cerf: 0,
			cbpf: 0,
			total: 0,
			allocationSources: {},
		},
		byPartners: {
			partnersDatacerf: [],
			partnersDatacbpf: [],
			projectscerf: new Set(),
			partnerscerf: new Set(),
			projectscbpf: new Set(),
			partnerscbpf: new Set(),
			projectstotal: new Set(),
			partnerstotal: new Set(),
			partnersSummarycerf: [],
			partnersSummarycbpf: [],
			partnersSummarytotal: [],
			fundTypes: new Set(),
			cerf: 0,
			cbpf: 0,
			total: 0,
		},
		bySectors: {
			sectorsDatacerf: [],
			sectorsDatacbpf: [],
			sectorsDatatotal: [],
			projectscerf: new Set(),
			partnerscerf: new Set(),
			sectorscerf: new Set(),
			projectscbpf: new Set(),
			partnerscbpf: new Set(),
			sectorscbpf: new Set(),
			projectstotal: new Set(),
			partnerstotal: new Set(),
			sectorstotal: new Set(),
			fundTypes: new Set(),
			cerf: 0,
			cbpf: 0,
			total: 0,
		},
		map: {
			cerfMapData: [],
			cbpfMapData: [],
			totalMapData: [],
			fundTypes: new Set(),
		},
	};
}

function createContributionsObj(row) {
	return {
		year: row.FiscalYear,
		contributions: {
			total: 0,
			paid: 0,
			pledged: 0,
			donors: new Set(),
			contributionsData: [],
		},
	};
}

function populateContributions(obj, row) {
	obj.contributions.total += +row.PaidAmt + +row.PledgeAmt;
	obj.contributions.paid += +row.PaidAmt;
	obj.contributions.pledged += +row.PledgeAmt;
	obj.contributions.donors.add(row.DonorId);
	const foundDonor = obj.contributions.contributionsData.find(
		e => e.donor === row.DonorId
	);
	if (foundDonor) {
		foundDonor.paid += +row.PaidAmt;
		foundDonor.pledged += +row.PledgeAmt;
		foundDonor.total += +row.PaidAmt + +row.PledgeAmt;
	} else {
		obj.contributions.contributionsData.push({
			donor: row.DonorId,
			paid: +row.PaidAmt,
			pledged: +row.PledgeAmt,
			total: +row.PaidAmt + +row.PledgeAmt,
		});
	}
}

function populateOverview(obj, row, lists) {
	obj.allocationSources[row.AllocationSourceId] =
		(obj.allocationSources[row.AllocationSourceId] || 0) +
		+row.ClusterBudget;
	obj.fundTypes.add(lists.fundTypesList[row.FundId]);
	["total", lists.fundTypesList[row.FundId]].forEach(thisFund => {
		obj[thisFund] += +row.ClusterBudget;
		obj[`partners${thisFund}`].add(row.PartnerCode);
		obj[`sectors${thisFund}`].add(row.ClusterId);
		row.ProjList.toString()
			.split(separator)
			.forEach(e => obj[`projects${thisFund}`].add(e));
	});
}

function populatePartners(obj, row, lists) {
	obj.fundTypes.add(lists.fundTypesList[row.FundId]);
	["total", lists.fundTypesList[row.FundId]].forEach(thisFund => {
		obj[thisFund] += +row.ClusterBudget;
		obj[`partners${thisFund}`].add(row.PartnerCode);
		row.ProjList.toString()
			.split(separator)
			.forEach(e => obj[`projects${thisFund}`].add(e));
		const foundPartnerSummary = obj[`partnersSummary${thisFund}`].find(
			e => e.partnerCode === row.OrganizatinonId
		);
		if (foundPartnerSummary) {
			foundPartnerSummary.value += +row.ClusterBudget;
		} else {
			obj[`partnersSummary${thisFund}`].push({
				partnerCode: row.OrganizatinonId,
				value: +row.ClusterBudget,
			});
		}
		if (thisFund !== "total") {
			const foundPartner = obj[`partnersData${thisFund}`].find(
				e => e.partnerCode === row.PartnerCode
			);
			if (foundPartner) {
				foundPartner.value += +row.ClusterBudget;
			} else {
				obj[`partnersData${thisFund}`].push({
					partnerCode: row.PartnerCode,
					value: +row.ClusterBudget,
				});
			}
		}
	});
}

function populateSectors(obj, row, lists) {
	obj.fundTypes.add(lists.fundTypesList[row.FundId]);
	["total", lists.fundTypesList[row.FundId]].forEach(thisFund => {
		obj[thisFund] += +row.ClusterBudget;
		obj[`partners${thisFund}`].add(row.PartnerCode);
		obj[`sectors${thisFund}`].add(row.ClusterId);
		row.ProjList.toString()
			.split(separator)
			.forEach(e => obj[`projects${thisFund}`].add(e));
		const foundSector = obj[`sectorsData${thisFund}`].find(
			e => e.sectorCode === row.ClusterId
		);
		if (foundSector) {
			foundSector.value += +row.ClusterBudget;
		} else {
			obj[`sectorsData${thisFund}`].push({
				sectorCode: row.ClusterId,
				value: +row.ClusterBudget,
			});
		}
	});
}

function populateMap(obj, row, lists) {
	obj.fundTypes.add(lists.fundTypesList[row.FundType]);
	["total", lists.fundTypesList[row.FundType]].forEach(thisFund => {
		const foundFund = obj[`${thisFund}MapData`].find(
			e =>
				e.lat === row.AdminLocation1Latitude.toFixed(6) &&
				e.lon === row.AdminLocation1Longitude.toFixed(6)
		);
		if (foundFund) {
			foundFund.value += +row.AdminLocation1Budget;
		} else {
			obj[`${thisFund}MapData`].push({
				lat: row.AdminLocation1Latitude.toFixed(6),
				lon: row.AdminLocation1Longitude.toFixed(6),
				value: +row.AdminLocation1Budget,
				location: row.AdminLocation1,
			});
		}
	});
}

function createFundNamesList(fundsData) {
	fundsData.forEach(row => {
		cbpfStatusList[row.id + ""] = row.CBPFFundStatus;
		if (row.CBPFId && !row.CBPFFundStatus) cbpfFundsList.push(row.id);
		cerfIdsList[row.id + ""] = row.CERFId;
		fundNamesList[row.id + ""] = row.PooledFundName;
		fundAbbreviatedNamesList[row.id + ""] = row.PooledFundNameAbbrv;
		fundNamesListKeys.push(row.id + "");
		fundRegionsList[row.id + ""] = row.RegionNameArr;
		fundIsoCodesList[row.id + ""] = row.ISO2Code;
		fundIsoCodes3List[row.id + ""] = row.CountryCode;
		fundLatLongList[row.ISO2Code] = [row.latitude, row.longitude];
		if (row.PooledFundName === "CERF") cerfPooledFundId = row.id;
	});
}

function createDonorNamesList(donorsData) {
	donorsData.forEach(row => {
		donorNamesList[row.id + ""] = row.donorName;
		donorNamesListKeys.push(row.id + "");
		donorTypesList[row.id + ""] = row.donorType;
		donorIsoCodesList[row.id + ""] = row.donorISO2Code;
	});
}

function createFundTypesList(fundTypesData) {
	fundTypesData.forEach(
		row => (fundTypesList[row.id + ""] = row.FundName.toLowerCase())
	);
}

function createPartnersList(partnersData) {
	partnersData.forEach(
		row => (partnersList[row.id + ""] = row.OrganizationTypeName)
	);
}

function createClustersList(clustersData) {
	clustersData.forEach(row => (clustersList[row.id + ""] = row.ClustNm));
}

function createAllocationTypesList(allocationTypesData) {
	allocationTypesData.forEach(
		row => (allocationTypesList[row.id + ""] = row.AllocationName)
	);
}

function createUnAgenciesNamesList(unAgenciesTypesData) {
	unAgenciesTypesData.forEach(row => {
		unAgenciesNamesList[row.agencyID + ""] = row.agencyName;
		unAgenciesShortNamesList[row.agencyID + ""] = row.agencyShortName;
	});
}

function createPartnerNamesList(partnersData) {
	partnersData.forEach(
		row => (partnersNamesList[row.id + ""] = row.fullName)
	);
}

export default processData;
