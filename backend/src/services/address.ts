import mapquest from "../connectors/mapquest-client";
const getLatLongForAddress = async (
  address: string
): Promise<{ lat: number; long: number }> => {
  const res = await mapquest.get("/address", {
    params: {
      location: address,
    },
  });
  /** example result
   * {"info":{"statuscode":0,"copyright":{"text":"© 2022 MapQuest, Inc.","imageUrl":"http://api.mqcdn.com/res/mqlogo.gif","imageAltText":"© 2022 MapQuest, Inc."},"messages":[]},"options":{"maxResults":-1,"thumbMaps":true,"ignoreLatLngInput":false},"results":[{"providedLocation":{"location":"9901 N Hurst Ave, Portland, OR 97203, United States"},"locations":[{"street":"9901 N Hurst Ave","adminArea6":"","adminArea6Type":"Neighborhood","adminArea5":"Portland","adminArea5Type":"City","adminArea4":"Multnomah","adminArea4Type":"County","adminArea3":"OR","adminArea3Type":"State","adminArea1":"US","adminArea1Type":"Country","postalCode":"97203-2075","geocodeQualityCode":"P1AAA","geocodeQuality":"POINT","dragPoint":false,"sideOfStreet":"L","linkId":"r34939110|p280391652|n230790256","unknownInput":"","type":"s","latLng":{"lat":45.594217,"lng":-122.708774},"displayLatLng":{"lat":45.59465,"lng":-122.708607},"mapUrl":"http://www.mapquestapi.com/staticmap/v5/map?key=a3irgDhGGl0EGygS1IAYuicn9Kq2qEGG&type=map&size=225,160&locations=45.594217,-122.708774|marker-sm-50318A-1&scalebar=true&zoom=15&rand=-596819974"}]}]}
   * */
  // console.debug(`res: ${JSON.stringify(res.data)}`);
  const latLng: { lat: number; lng: number } =
    res.data.results[0].locations[0].latLng;
  return { lat: latLng.lat, long: latLng.lng };
};
export default {
  getLatLongForAddress,
};
