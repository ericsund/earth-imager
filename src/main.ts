import { stringify } from "querystring";

const fetch = require("node-fetch")
const fs = require('fs');

export class Query {
    static async getImage(city: string, date: string = '2020-06-01'): Promise<void> {
        var queryCoords = await getCoords(city);
        var resImage: Blob = await getSatelliteImage(queryCoords.lat, queryCoords.lng, date);

        var arrayBuff = await resImage.arrayBuffer();
        var data = Buffer.from(arrayBuff);

        fs.writeFile('out1.png', data, 'binary', (err: any) => {
            if (err) {
                console.log("Failed to write to disk");
            }
        });
    }
}

export async function getSatelliteImage(lat: string, lon: string, date: string): Promise<Blob> {
    return fetch(`https://api.nasa.gov/planetary/earth/imagery?lat=${lat}&lon=${lon}&date=${date}&dim=0.4&api_key=${process.env.NASA_API_KEY}`, {
        method: 'GET'
    }).then((res: Response) => {
        return res.blob();
    }).catch((err: any) => {
        return Promise.reject("Failed to make request");
    });
}

export async function getCoords(locationName: string): Promise<any> {
    return fetch(`http://open.mapquestapi.com/geocoding/v1/address?key=${process.env.MAPQUEST_API_KEY}&location=${locationName}`, {        method: 'GET'
    }).then((res: Response) => {
        return res.json();
    }).then((res: any) => {
        return res["results"][0]["locations"][0]["latLng"];
    }).catch((err: any) => {
        return Promise.reject("Failed to make request");
    });
}
