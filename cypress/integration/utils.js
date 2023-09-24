const jsonToQueryString = (json) => {
    return Object.keys(json).map(function(key) {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
    }).join('&');
}


const getNewDate = (days=20) => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);

    const options = { day: "2-digit", month: "short", year: "numeric" };
    return futureDate.toLocaleDateString("en-US", options)
        .replace(/(\w+) (\d+), (\d+)/, (match, month, day, year) =>
            `${parseInt(day)}-${month}-${year}`
        );
};

const defalutOWpayloadQuery = (key = '', value = null) => {
    const payload = {
        dep1: "DXB",
        ret1: "LON",
        dtt1: getNewDate(),
        cl1: "Y",
        triptype: 1,
        adult: 1,
        child: 0,
        infant: 0,
        direct: false,
        baggage: false,
        key: "OW",
        airlines: "",
        ref: false,
        langcode: "EN",
        curr: "AED",
        ipc: false,
        dep2: "",
        ret2: "",
        dtt2: "",
        cl2: "Y",
        dep3: "",
        ret3: "",
        dtt3: "",
        cl3: "",
        mgcc:"IN"
    }
    if (key && value) {
        payload[key] = value;
    }
    return payload;
}


const generatePayloadFromExcelRow = (rowData) => {
    // Extract data from rowData
    const [dep1, ret1] = rowData.Route.split("-");
    const [dtt1, dtt2] = rowData.Date.split("|");  // Split the dates
    const [adult, child, infant] = rowData["Pax(A|C|I)"].split("|").map(Number);
    const airlines = rowData.Airline;
    const Gateway = rowData.Gateway;
    const tripType = rowData.Type;
    const scenario = `Should book a ${tripType} flight from ${dep1} to ${ret1} on ${dtt1} for ${adult} adults, ${child} children and ${infant} infants with Airline ${airlines} payment method ${Gateway}`;

    const triptype = rowData.Type === "One Way" ? 1 : 2;
    let key = triptype === 1 ? "OW" : "IRT";


    return {
        dep1: dep1,
        ret1: ret1,
        dtt1: dtt1,
        cl1: "Y",
        triptype: triptype,
        adult: adult,
        child: child,
        infant: infant,
        direct: false,
        baggage: false,
        key: key,
        airlines: airlines,
        ref: false,
        langcode: "EN",
        curr: "AED",
        ipc: false,
        dep2: triptype === 2 ? ret1 : "",  // Reverse the route for the return trip.
        ret2: triptype === 2 ? dep1 : "",
        dtt2: dtt2 || "",  // If it's a one-way trip, dtt2 will be undefined, so we default to an empty string.
        cl2: "Y",
        dep3: "",
        ret3: "",
        dtt3: "",
        cl3: "",
        mgcc: "IN",
        scenario: scenario,
        gateway: Gateway
    };
}





module.exports = {
    jsonToQueryString,
    getNewDate,
    defalutOWpayloadQuery,
    generatePayloadFromExcelRow
}
