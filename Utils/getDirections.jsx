import { decode } from "@mapbox/polyline";

export const getDirections = async (startLoc, destinationLoc) => {
  try {
    const Key = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${destinationLoc.latitude},${destinationLoc.longitude}`;
    url += `&key=${Key}`;

    const resp = await fetch(url);
    const data = await resp.json();


    if(!data || !data.routes || !data.routes[0] || !data.routes[0].legs || !data.routes[0].legs[0] || !data.routes[0].legs[0].steps) throw new Error("No route found");

      console.log("Data:",data);

    if (data.routes.length === 0) throw new Error("No route found");

    let coords = [];

    const steps = data.routes[0].legs.flatMap((leg) => leg.steps);
    for (const step of steps) {
      const segment = decode(step.polyline.points);
      const segmentCoords = segment.map(([latitude, longitude]) => ({ latitude, longitude }));
      coords = [...coords, ...segmentCoords];
    }

    return coords;
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
};
