import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

export default function Dashboard() {  
  // map starts at UCLA
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-118.4441);
  const [lat, setLat] = useState(34.0722);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
  });
  return (
    <div className="h-screen">
      <h1 className="text-3xl font-bold underline">Dashboard</h1>
      <div ref={mapContainer} className="map-container h-full" />
    </div>
  )
}