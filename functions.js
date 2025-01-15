function formatTime(isoString) {
    const date = new Date(isoString);
    const timeStr = date.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
    });
    
    return timeStr;
}

function populateDiv(times, divId){
    console.log(times);
}

async function getBusTimes(stopId, limit){
    try {
        const response = await fetch("https://grtivr-prod.regionofwaterloo.9802690.ca/vms/graphql", {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/json",
                "x-frontend-application": "React-Dashboard",
                "x-frontend-version": "60a4a6b4a33a85c4b9f9e8e2e8847a9c6d15f4ba",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "authorization": "Bearer 89858a2d-0497-46c7-876b-6f8ec4c99b94", // not exactly ideal, but it also doesn't really matter much at all. 
                "Priority": "u=4"
            },
            "referrer": "https://nextride.grt.ca/",
            "body": `{\"operationName\":\"GetArrivals\",\"variables\":{\"${limit}\":3,\"stops\":[\"${stopId}\"]},\"query\":\"query GetArrivals($station: ID, $stops: [ID]!, $limit: Int) {\\n  arrivals(filter: {stops: $stops, station: $station}, limit: $limit) {\\n    stop {\\n      id\\n      platformCode\\n      __typename\\n    }\\n    route {\\n      id\\n      shortName\\n      longName\\n      __typename\\n    }\\n    trip {\\n      headsign\\n      __typename\\n    }\\n    type: typeAsString\\n    sortKey: departure\\n    vehicle {\\n      occupancyStatus\\n      __typename\\n    }\\n    __typename\\n  }\\n}\"}`,
            "method": "POST",
            "mode": "cors"
        });
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
        var times = [];
        const json = await response.json();
        // console.log(JSON.stringify(json));
        const arrivals = json.data.arrivals;
        for (var i = 0; i < Object.keys(arrivals).length; i++){
            times.push([formatTime(arrivals[i].sortKey), arrivals[i].route.id, arrivals[i].route.longName, arrivals[i].trip.headsign]);
        }
        populateDiv(times.slice(0, limit), 1);
    } catch (e) {
        console.error(e);
    }
}

getBusTimes('1120', '3')