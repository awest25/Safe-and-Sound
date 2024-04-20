import { useState} from "react";
import data from '../trees.json';
import { Map, Source, Layer } from "react-map-gl";
import type { HeatmapLayer, CircleLayer } from "react-map-gl";

export default function Dashboard() {
  const [showCrime, setShowCrime] = useState(true);

  const handleCrimeChange = (event) => {
    setShowCrime(event.target.checked)
    console.log(event.target.checked)
  }

  // TODO: change the names of these layers to be correct
  // TODO: use crime data pulled from mongodb
  const treesHeatLayer: HeatmapLayer = {
    id: 'trees-heat',
    type: 'heatmap',
    source: 'trees',
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

  const treesPointLayer: CircleLayer = {
    id: 'trees-point',
    type: 'circle',
    source: 'trees',
    minzoom: 14,
    paint: {
      // increase the radius of the circle as the zoom level and dbh value increases
      'circle-radius': {
        property: 'dbh',
        type: 'exponential',
        stops: [
          [{ zoom: 15, value: 1 }, 5],
          [{ zoom: 15, value: 62 }, 10],
          [{ zoom: 22, value: 1 }, 20],
          [{ zoom: 22, value: 62 }, 50]
        ]
      },
      'circle-color': {
        property: 'dbh',
        type: 'exponential',
        stops: [
          [0, 'rgba(236,222,239,0)'],
          [10, 'rgb(236,222,239)'],
          [20, 'rgb(208,209,230)'],
          [30, 'rgb(166,189,219)'],
          [40, 'rgb(103,169,207)'],
          [50, 'rgb(28,144,153)'],
          [60, 'rgb(1,108,89)']
        ]
      },
      'circle-stroke-color': 'white',
      'circle-stroke-width': 1,
      'circle-opacity': {
        stops: [
          [14, 0],
          [15, 1]
        ]
      }
    }
  }

  return (
    <div className="h-screen">
      <h1 className="text-3xl font-bold underline">Dashboard</h1>
      <div>
        <label htmlFor="crime">Crime Incidents:</label>
        <input type="checkbox" id="crime" name="crime" checked={showCrime} onChange={handleCrimeChange}></input>
      </div>
      <Map
        initialViewState={{
          longitude: -79.999732,
          latitude: 40.4374,
          zoom: 12
        }}
        mapStyle='mapbox://styles/mapbox/streets-v12'
        mapboxAccessToken="pk.eyJ1IjoiYWp0YWRlbyIsImEiOiJjbHY4Ym56czMwMzJmMmlyeXJpaGx3aHBoIn0.oMQb-_b4NrGmhtVkwn-O1Q"
      >
        <Source type="geojson" data={data}>
          <Layer {...treesHeatLayer} layout={{visibility: showCrime ? 'visible' : 'none'}}/>
          <Layer {...treesPointLayer} layout={{visibility: showCrime ? 'visible' : 'none'}}/>
        </Source>
      </Map>
    </div>
  )
}