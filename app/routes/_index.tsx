import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useState } from "react";
import { Map, Source, Layer} from "react-map-gl";
import type { HeatmapLayer, CircleLayer } from "react-map-gl";
import { json } from "@remix-run/react";
import connectToDatabase from '../utils/mongodb.js';
import { useLoaderData } from "@remix-run/react";
import type { FeatureCollection } from 'geojson';
import { useCallback } from "react";
import '../overlay.css';

export const meta: MetaFunction = () => {
  return [
    { title: "Safe and Sound" },
    { name: "description", content: "Stay safe out there <3" },
  ];
};

export const loader: LoaderFunction = async () => {
  console.log("Running loader...");
  const client = await connectToDatabase();
  const db = client.db("safe-and-sound");
  
  // Query ALL of the airbnb data for Los Angeles
  // This takes forever
  const fieldsWeWant = { _id : 1, 
                        location: 1, 
                        listing_url: 1, 
                        name: 1, 
                        price: 1,
                        room_type: 1,
                        review_scores_rating: 1,
                      }
  const airbnbData = await db.collection("airbnb_full").find({}, { projection: fieldsWeWant }).toArray();
  console.log("Successfully pulled airbnb data....")

  // Arbitrarily limit the number of crime data points to 1000
  // TODO: write a query that gets the most recent crime data
  const crimeData = await db.collection("crime_la").find({}).limit(1000).toArray();
  console.log("Successfully pulled crime data....")

  // TODO: get crimeData, covidData, concentrationData

  console.log("Successfully queried all data 🎉")
  return json({ 
    airbnb: airbnbData,
    crime: crimeData
  });
};

export default function Index() {
  const [showCrime, setShowCrime] = useState(true);
  const [showCovid, setShowCovid] = useState(true)
  const [showConcentration, setShowConcentration] = useState(true)
  const loaderData = useLoaderData<typeof loader>();
  // const [popupInfo, setPopupInfo] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);


  const airbnbData: FeatureCollection = {
    type: 'FeatureCollection',
    features: loaderData.airbnb.map((x) => {
      return {
        type: 'Feature',
        geometry: x.location,
        properties: {
          listing_url: x.listing_url,
          name: x.name,
          price: x.price,
          room_type: x.room_type,
          rating: x.review_scores_rating
        }
      }
    })
  }

  const crimeData: FeatureCollection = {
    type: 'FeatureCollection',
    features: loaderData.crime.map((x) => {
      return {
        type: 'Feature',
        geometry: x.location
      }
    })
  }

  // TODO: get crimeData, covidData, concentrationData in geoJSON format
  const onHover = useCallback(event => {
    const {
      features,
      point: {x, y}
    } = event;
    const hoveredFeature = features && features[0];

    // prettier-ignore
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
  }, []);

  const handleCrimeChange = (event) => {
    setShowCrime(event.target.checked)
  }

  const crimeHeatLayer: HeatmapLayer = {
    id: 'crime-heat',
    type: 'heatmap',
    source: 'crime',
    maxzoom: 15,
    paint: {
      // increase weight as diameter breast height increases
      'heatmap-weight': {
        property: 'dbh',
        type: 'exponential',
        stops: [
          [1, 0],
          [62, 1]
        ]
      },
      // increase intensity as zoom level increases
      'heatmap-intensity': {
        stops: [
          [11, 1],
          [15, 3]
        ]
      },
      // assign color values be applied to points depending on their density
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(255, 235, 235, 0)', // lightest red, almost transparent
        0.2,
        'rgb(255, 205, 205)', // very light red
        0.4,
        'rgb(255, 152, 152)', // light red
        0.6,
        'rgb(255, 99, 99)', // medium red
        0.8,
        'rgb(255, 0, 0)' // full red
      ],
      // increase radius as zoom increases
      'heatmap-radius': {
        stops: [
          [11, 15],
          [15, 20]
        ]
      },
      // decrease opacity to transition into the circle layer
      'heatmap-opacity': {
        default: 1,
        stops: [
          [14, 1],
          [15, 0]
        ]
      }
    }
  }

  const airbnbPointLayer: CircleLayer = {
    id: 'airbnb-point',
    type: 'circle',
    source: 'airbnb',
    paint: {
      'circle-radius': {
        'base': 1.75,
        'stops': [
          [12, 2],
          [22, 180]
        ]
      }
    }
  }

  return (
    <div className="h-screen">
      <div className="flex justify-center p-6 title"> 
        <h1 className="text-3xl font-bold no-underline">Dashboard</h1>
      </div>
      <div className="w-3/4 h-3/4 mx-auto">
        <>
        <Map
          initialViewState={{
            longitude: -118.42477876658972,
            latitude: 34.04836118390573,
            zoom: 12
          }}
          mapStyle='mapbox://styles/mapbox/streets-v12'
          mapboxAccessToken="pk.eyJ1IjoiYWp0YWRlbyIsImEiOiJjbHY4Ym56czMwMzJmMmlyeXJpaGx3aHBoIn0.oMQb-_b4NrGmhtVkwn-O1Q"
          interactiveLayerIds={['airbnb-point']}
          onMouseMove={onHover}
        >
          <Source type="geojson" data={airbnbData}>
            <Layer {...airbnbPointLayer} />
          </Source>
          {hoverInfo && (
            <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
              <h2><a href={hoverInfo.feature.properties.listing_url}>{hoverInfo.feature.properties.name}</a></h2>
              <p>{hoverInfo.feature.properties.room_type}</p>
              <p>{hoverInfo.feature.properties.price}</p>
            </div>
          )}
          <Source type="geojson" data={crimeData}>
            <Layer {...crimeHeatLayer} layout={{ visibility: showCrime ? 'visible' : 'none' }} />
          </Source>
          
        </Map>
        <div className="control-panel">
          <h3>Control Panel </h3>
          <div>
            <label htmlFor="crime">Crime: </label>
            <input type="checkbox" id="crime" name="crime" checked={showCrime} onChange={handleCrimeChange}></input>
          </div>
        </div>
        </>
      </div>
    </div>
  )
}