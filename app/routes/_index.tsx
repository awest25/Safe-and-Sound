import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useState } from "react";
import { Map, Source, Layer} from "react-map-gl";
import { Popup } from "react-map-gl";
import type { HeatmapLayer, CircleLayer } from "react-map-gl";
import { json } from "@remix-run/react";
import connectToDatabase from '../utils/mongodb.js';
import { useLoaderData } from "@remix-run/react";
import type { FeatureCollection } from 'geojson';
import { useCallback } from "react";
// import ControlPanel from './control_panel';
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

  const airbnbPipeline = [
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [-118.42477876658972, 34.04836118390573]
        },
        key: "location",
        distanceField: "dist.calculated",
        maxDistance: 36055
      }
    },
    {
      $project: {
        _id: 1,
        listing_url: 1,
        name: 1,
        address: 1,
        location: 1,
        distance: "$dist.calculated"
      }
    }
  ]

  const airbnbData = await db.collection("airbnb_full").aggregate(airbnbPipeline).toArray();

  // TODO: get crimeData, covidData, concentrationData

  console.log("Successfully queried data 🎉")
  return json({ 
    airbnb: airbnbData
  });
};

export default function Index() {
  const [showCrime, setShowCrime] = useState(true);
  const [showCovid, setShowCovid] = useState(true)
  const [showConcentration, setShowConcentration] = useState(true)
  const loaderData = useLoaderData<typeof loader>();
  // const [popupInfo, setPopupInfo] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  // console.log(loaderData[0].location.coordinates[0]);


  const airbnbData: FeatureCollection = {
    type: 'FeatureCollection',
    features: loaderData.airbnb.map((x) => {
      return {
        type: 'Feature',
        geometry: x.location
      }
    })
  }

  // TODO: get crimeData, covidData, concentrationData in geoJSON format

  const handleCrimeChange = (event) => {
    setShowCrime(event.target.checked)
    console.log(event.target.checked)
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
        'rgba(236,222,239,0)',
        0.2,
        'rgb(208,209,230)',
        0.4,
        'rgb(166,189,219)',
        0.6,
        'rgb(103,169,207)',
        0.8,
        'rgb(28,144,153)'
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
          // onMouseMove={onHover}
        >
          <Source type="geojson" data={airbnbData}>
            <Layer {...airbnbPointLayer} layout={{ visibility: showCrime ? 'visible' : 'none' }} />
            {/* <Layer {...treesHeatLayer} layout={{visibility: showCrime ? 'visible' : 'none'}}/>
            <Layer {...treesPointLayer} layout={{visibility: showCrime ? 'visible' : 'none'}}/> */}
          </Source>
          {/* {hoverInfo && (
          <div className="tooltip" style={{left: hoverInfo.longitude, top: hoverInfo.latitude}}>
            <div>State: {hoverInfo.listing_url}</div>
          </div>
          )} */}
          
        </Map>
        {/* <ControlPanel /> */}
        <div className="control-panel">
          <h3>Marker, Popup, NavigationControl and FullscreenControl </h3>
          <div>
            <label htmlFor="crime">AirBnBs: </label>
            <input type="checkbox" id="crime" name="crime" checked={showCrime} onChange={handleCrimeChange}></input>
          </div>
        </div>
        </>
      </div>
    </div>
  )
}