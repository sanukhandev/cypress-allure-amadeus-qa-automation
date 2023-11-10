import FlightSearchBase from "./FlightSearchBase";

class OWflightSearchPage extends FlightSearchBase{

    constructor() {
        super();
    }

    baseRequest = {
        "dep1": "DXB",
        "ret1": "LHR",
        "dtt1": "23-Nov-2023",
        "cl1": "Y",
        "mgcc": "IN",
        "triptype": "1",
        "adult": "1",
        "child": "1",
        "infant": "1",
        "direct": "true",
        "baggage": "true",
        "key": "IRT",
        "airlines": "EK",
        "ref": "true",
        "langcode": "EN",
        "curr": "AED",
        "ipc": "true"
    }


    makeSearchWithPax = (adult,child,infant) => {
        const request = {
            ...this.baseRequest,
            adult: adult,
            child: child,
            infant: infant,
            airlines: "",
            direct: "false",
            baggage: "false",
            ref: false,
            ipc: false
        };
        this.getFlights(request);
    }

    makeSearchWithAirlines = (airlines) => {
        const request = {
            ...this.baseRequest,
            adult: 1,
            child: 0,
            infant: 0,
            airlines: airlines,
            direct: false,
            baggage: false,
            ref: false,
            ipc: false
        };
        this.getFlights(request);
    }

    makeSearchWithDirect = () => {
        const request = {
            ...this.baseRequest,
            adult: 1,
            child: 0,
            infant: 0,
            airlines: "",
            direct: true,
            baggage: false,
            ref: false,
            ipc: false
        };
        this.getFlights(request);
    }

    makeSearchWithBaggage = () => {
        const request = {
            ...this.baseRequest,
            adult: 1,
            child: 0,
            infant: 0,
            airlines: "",
            direct: false,
            baggage: true,
            ref: false,
            ipc: false
        };
        this.getFlights(request);
    }

    makeSearchWithRefundable = () => {
        const request = {
            ...this.baseRequest,
            adult: 1,
            child: 0,
            infant: 0,
            airlines: "",
            direct: false,
            baggage: false,
            ref: true,
            ipc: false
        };
        this.getFlights(request);
    }

    makeSearchWithIPC = () => {
        const request = {
            ...this.baseRequest,
            adult: 1,
            child: 0,
            infant: 0,
            airlines: "",
            direct: false,
            baggage: false,
            ref: false,
            ipc: true
        };
        this.getFlights(request);
    }

    makeSearchWithRefundableAndDirect = () => {
        const request = {
            ...this.baseRequest,
            adult: 1,
            child: 0,
            infant: 0,
            airlines: "",
            direct: true,
            baggage: false,
            ref: true,
            ipc: false
        };
        this.getFlights(request);
    }



}

export default OWflightSearchPage;