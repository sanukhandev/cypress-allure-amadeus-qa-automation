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
        cl3: ""
    }
    if (key && value) {
        payload[key] = value;
    }
    return payload;
}

module.exports = {
    jsonToQueryString,
    getNewDate,
    defalutOWpayloadQuery
}