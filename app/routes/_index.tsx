import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useState } from "react";
import { Map, Source, Layer} from "react-map-gl";
import type { HeatmapLayer, CircleLayer } from "react-map-gl";
import { json } from "@remix-run/react";
import connectToDatabase from '../utils/mongodb.js';
import { Link, useLoaderData } from "@remix-run/react";
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
  const airbnbData = await db.collection("airbnb_full").find({}, { projection: fieldsWeWant }).limit(5000).toArray();
  console.log("Successfully pulled airbnb data....")

  // Arbitrarily limit the number of crime data points to 1000
  // TODO: write a query that gets the most recent crime data
  const crimeData = await db.collection("crime_la").find({}, {projection: {_id: 1, location: 1}}).limit(1000).toArray();
  console.log("Successfully pulled crime data....")

  const neighborhoodsData = (await db.collection("neighborhoods_la")
                                     .find({}, {projection: {_id: 1, geometry: 1}})
                                     .limit(10000).toArray())
                                     .map((polygon) => polygon.geometry);
  console.log("Successfully pulled neighborhood data....")

  // Create aggregation pipeline to get the concentration data
  const concentrationPipeline = [
    {
      $geoNear: {
        near: {
          type: "Point",
          // somewhere in LA idgaf
          coordinates: [-118.42477876658972, 34.04836118390573]
        },
        key: "location",
        distanceField: "dist.calculated",
        // roughly the radius of LA
        maxDistance: 36055
      }
    },
    {
      $project: {
        _id: 1,
        location: 1,
        distance: "$dist.calculated"
      }
    }
  ]

  const concentrationData = await db.collection("concentration").aggregate(concentrationPipeline).toArray();
  console.log(`Successfully pulled ${concentrationData.length} concentration data points....`)

  console.log("Successfully queried all data 🎉")

  return json({ 
    airbnb: airbnbData,
    crime: crimeData,
    concentration: concentrationData,
    polygons: neighborhoodsData
  });
};

export default function Index() {
  const [showCrime, setShowCrime] = useState(true);
  const [showCovid, setShowCovid] = useState(true)
  const [showConcentration, setShowConcentration] = useState(true)
  const loaderData = useLoaderData<typeof loader>();
  const [hoverInfo, setHoverInfo] = useState(null);
  const [tooltipFrozen, setTooltipFrozen] = useState(false);
  const [showNeighborhoods, setShowNeighborhoods] = useState(false);

  const airbnbData: FeatureCollection = {
    type: 'FeatureCollection',
    features: loaderData.airbnb.map((x) => {
      return {
        type: 'Feature',
        geometry: x.location,
        properties: {
          _id: x._id,
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

  const concentrationData: FeatureCollection = {
    type: 'FeatureCollection',
    features: loaderData.concentration.map((x) => {
      return {
        type: 'Feature',
        geometry: x.location
      }
    })
  }

  const polygonsData: FeatureCollection = {
    type: 'FeatureCollection',
    features: loaderData.polygons.map((polygon, index) => {
      return {
        type: 'Feature',
        geometry: polygon,
        properties: {
          // you can add more properties if needed, like an id
          id: `polygon-${index}`
        }
      }
    })
  }

  const onHover = useCallback(event => {
    const {
      features,
      point: {x, y}
    } = event;
    const hoveredFeature = features && features[0];

    // prettier-ignore
    if (!tooltipFrozen) {
      setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
    }
  }, [tooltipFrozen]);

  const onClick = useCallback(event => {
    event.preventDefault();
    setTooltipFrozen(prevState => !prevState);
  }, []);

  const handleCrimeChange = (event) => {
    setShowCrime(event.target.checked)
  }

  const handleConcentrationChange = (event) => {
    setShowConcentration(event.target.checked)
  }

  const handleNeighborhoodsChange = (event) => {
    setShowNeighborhoods(event.target.checked)
  }

  const crimeHeatLayer: HeatmapLayer = {
    id: 'crime-heat',
    type: 'heatmap',
    source: 'crime',
    maxzoom: 15,
    paint: {
      // assign color values be applied to points depending on their density
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(255, 235, 235, 0)', // lightest red, almost transparent
        0.2,
        '#FDE727', // very light red
        0.5,
        '#218C8D', // light red
        0.8,
        '#450D56' // full red
      ],
      // increase radius as zoom increases
      'heatmap-radius': {
        stops: [
          [11, 15],
          [15, 20]
        ]
      },
      'heatmap-opacity': 0.7
    },
  }

  const concentrationHeatLayer: HeatmapLayer = {
    id: 'concentration-heat',
    type: 'heatmap',
    source: 'concentration',
    maxzoom: 15,
    paint: {
      // assign color values be applied to points depending on their density
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(255, 235, 235, 0)', // lightest red, almost transparent
        0.2,
        '#FCFDC0', // very light red
        0.5,
        '#B83778', // light red
        1,
        '#000000' // full red
      ],
      // increase radius as zoom increases
      'heatmap-radius': {
        stops: [
          [11, 15],
          [15, 20]
        ]
      },
      'heatmap-opacity': 0.7
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
      },
      'circle-color': '#EF5351'
    },
  }

  const neighborhoodLayer: Layer = {
    id: 'neighborhoods',
    type: 'line', // Changed from 'fill' to 'line' to represent the dividing lines
    source: 'neighborhoods',
    layout: {},
    paint: {
      'line-color': '#6b6b76', // Color of the line
      'line-width': 1,     // Width of the line in pixels
    }
  };
  
  return (
    <div className="h-screen">
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
        onClick={onClick}
      >
        <Source type="geojson" data={airbnbData}>
          <Layer {...airbnbPointLayer} beforeId='crime-heat'/>
        </Source>
        {hoverInfo && (
          <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
            <h2><Link to={`/${hoverInfo.feature.properties._id}`}>{hoverInfo.feature.properties.name}</Link></h2>
            <p>{hoverInfo.feature.properties.room_type}</p>
            <p>{hoverInfo.feature.properties.price}</p>
          </div>
        )}
        <Source type="geojson" data={crimeData}>
          <Layer {...crimeHeatLayer} layout={{ visibility: showCrime ? 'visible' : 'none' }} beforeId='concentration-heat'/>
        </Source>
        <Source type="geojson" data={concentrationData}>
          <Layer {...concentrationHeatLayer} layout={{ visibility: showConcentration ? 'visible' : 'none' }} />
        </Source>
        <Source type="geojson" data={polygonsData}>
            <Layer {...neighborhoodLayer} layout={{ visibility: showNeighborhoods ? 'visible' : 'none' }}/>
          </Source>
      </Map>
      <div className="control-panel">
        <h1>Safe and Sound</h1>
        <h3>Ensuring safety at your home away from home.</h3>
        <div className="toggle-container">
        <div>
            <div className="toggle">
              <label htmlFor="neighborhoods">Neighborhoods: </label>
              <input type="checkbox" id="neighborhoods" name="neighborhoods" checked={showNeighborhoods} onChange={handleNeighborhoodsChange}></input>
            </div>
            <a href="https://github.com/CityOfLosAngeles/covid19-indicators/blob/master/data/la_countywide_statistical_areas.geojson" target="_blank">Source: City of Los Angeles</a>
          </div>
          <div>
            <div className="toggle">
              <label htmlFor="crime">Crime Incidents: </label>
              <input type="checkbox" id="crime" name="crime" checked={showCrime} onChange={handleCrimeChange}></input>
            </div>
            <div className="crime-gradient"></div>
            <a href="https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8/about_data" target="_blank">Source: LAPD</a>
          </div>
          <div>
            <div className="toggle">
              <label htmlFor="concentration">Hazardous Air Pollutants: </label>
              <input type="checkbox" id="concentration" name="concentration" checked={showConcentration} onChange={handleConcentrationChange}></input>
            </div>
            <div className="concentration-gradient"></div>
            <a href="https://aqs.epa.gov/aqsweb/airdata/download_files.html" target="_blank">Source: EPA</a>
          </div>
        </div>
      </div>
    </div>
  )
}