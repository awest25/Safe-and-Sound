import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

export default function Dashboard() {  
  const locations = [{
      "_id": "10006546",
      "listing_url": "https://www.airbnb.com/rooms/10006546",
      "name": "Ribeira Charming Duplex",
      "summary": "Fantastic duplex apartment with three bedrooms, located in the historic area of Porto, Ribeira (Cube) - UNESCO World Heritage Site. Centenary building fully rehabilitated, without losing their original character.",
      "space": "Privileged views of the Douro River and Ribeira square, our apartment offers the perfect conditions to discover the history and the charm of Porto. Apartment comfortable, charming, romantic and cozy in the heart of Ribeira. Within walking distance of all the most emblematic places of the city of Porto. The apartment is fully equipped to host 8 people, with cooker, oven, washing machine, dishwasher, microwave, coffee machine (Nespresso) and kettle. The apartment is located in a very typical area of the city that allows to cross with the most picturesque population of the city, welcoming, genuine and happy people that fills the streets with his outspoken speech and contagious with your sincere generosity, wrapped in a only parochial spirit.",
      "description": "Fantastic duplex apartment with three bedrooms, located in the historic area of Porto, Ribeira (Cube) - UNESCO World Heritage Site. Centenary building fully rehabilitated, without losing their original character. Privileged views of the Douro River and Ribeira square, our apartment offers the perfect conditions to discover the history and the charm of Porto. Apartment comfortable, charming, romantic and cozy in the heart of Ribeira. Within walking distance of all the most emblematic places of the city of Porto. The apartment is fully equipped to host 8 people, with cooker, oven, washing machine, dishwasher, microwave, coffee machine (Nespresso) and kettle. The apartment is located in a very typical area of the city that allows to cross with the most picturesque population of the city, welcoming, genuine and happy people that fills the streets with his outspoken speech and contagious with your sincere generosity, wrapped in a only parochial spirit. We are always available to help guests",
      "neighborhood_overview": "In the neighborhood of the river, you can find several restaurants as varied flavors, but without forgetting the so traditional northern food. You can also find several bars and pubs to unwind after a day's visit to the magnificent Port. To enjoy the Douro River can board the boats that daily make the ride of six bridges. You can also embark towards Régua, Barca d'Alva, Pinhão, etc and enjoy the Douro Wine Region, World Heritage of Humanity. The Infante's house is a few meters and no doubt it deserves a visit. They abound grocery stores, bakeries, etc. to make your meals. Souvenir shop, wine cellars, etc. to bring some souvenirs.",
      "notes": "Lose yourself in the narrow streets and staircases zone, have lunch in pubs and typical restaurants, and find the renovated cafes and shops in town. If you like exercise, rent a bicycle in the area and ride along the river to the sea, where it will enter beautiful beaches and terraces for everyone. The area is safe, find the bus stops 1min and metro line 5min. The bustling nightlife is a 10 min walk, where the streets are filled with people and entertainment for all. But Porto is much more than the historical center, here is modern museums, concert halls, clean and cared for beaches and surf all year round. Walk through the Ponte D. Luis and visit the different Caves of Port wine, where you will enjoy the famous port wine. Porto is a spoken city everywhere in the world as the best to be visited and savored by all ... natural beauty, culture, tradition, river, sea, beach, single people, typical food, and we are among those who best receive tourists, confirm! Come visit us and feel at ho",
      "transit": "Transport: • Metro station and S. Bento railway 5min; • Bus stop a 50 meters; • Lift Guindais (Funicular) 50 meters; • Tuc Tuc-to get around the city; • Buses tourist; • Cycling through the marginal drive; • Cable car in Gaia, overlooking the Port (just cross the bridge).",
      "access": "We are always available to help guests. The house is fully available to guests. We are always ready to assist guests. when possible we pick the guests at the airport.  This service transfer have a cost per person. We will also have service \"meal at home\" with a diverse menu and the taste of each. Enjoy the moment!",
      "interaction": "Cot - 10 € / night Dog - € 7,5 / night",
      "house_rules": "Make the house your home...",
      "property_type": "House",
      "room_type": "Entire home/apt",
      "bed_type": "Real Bed",
      "minimum_nights": "2",
      "maximum_nights": "30",
      "cancellation_policy": "moderate",
      "last_scraped": {
          "$date": "2019-02-16T05:00:00.000Z"
      },
      "calendar_last_scraped": {
          "$date": "2019-02-16T05:00:00.000Z"
      },
      "first_review": {
          "$date": "2016-01-03T05:00:00.000Z"
      },
      "last_review": {
          "$date": "2019-01-20T05:00:00.000Z"
      },
      "accommodates": 8,
      "bedrooms": 3,
      "beds": 5,
      "number_of_reviews": 51,
      "bathrooms": {
          "$numberDecimal": "1.0"
      },
      "amenities": [
          "TV",
          "Cable TV",
          "Wifi",
          "Kitchen",
          "Paid parking off premises",
          "Smoking allowed",
          "Pets allowed",
          "Buzzer/wireless intercom",
          "Heating",
          "Family/kid friendly",
          "Washer",
          "First aid kit",
          "Fire extinguisher",
          "Essentials",
          "Hangers",
          "Hair dryer",
          "Iron",
          "Pack ’n Play/travel crib",
          "Room-darkening shades",
          "Hot water",
          "Bed linens",
          "Extra pillows and blankets",
          "Microwave",
          "Coffee maker",
          "Refrigerator",
          "Dishwasher",
          "Dishes and silverware",
          "Cooking basics",
          "Oven",
          "Stove",
          "Cleaning before checkout",
          "Waterfront"
      ],
      "price": {
          "$numberDecimal": "80.00"
      },
      "security_deposit": {
          "$numberDecimal": "200.00"
      },
      "cleaning_fee": {
          "$numberDecimal": "35.00"
      },
      "extra_people": {
          "$numberDecimal": "15.00"
      },
      "guests_included": {
          "$numberDecimal": "6"
      },
      "images": {
          "thumbnail_url": "",
          "medium_url": "",
          "picture_url": "https://a0.muscache.com/im/pictures/e83e702f-ef49-40fb-8fa0-6512d7e26e9b.jpg?aki_policy=large",
          "xl_picture_url": ""
      },
      "host": {
          "host_id": "51399391",
          "host_url": "https://www.airbnb.com/users/show/51399391",
          "host_name": "Ana\u0026Gonçalo",
          "host_location": "Porto, Porto District, Portugal",
          "host_about": "Gostamos de passear, de viajar, de conhecer pessoas e locais novos, gostamos de desporto e animais! Vivemos na cidade mais linda do mundo!!!",
          "host_response_time": "within an hour",
          "host_thumbnail_url": "https://a0.muscache.com/im/pictures/fab79f25-2e10-4f0f-9711-663cb69dc7d8.jpg?aki_policy=profile_small",
          "host_picture_url": "https://a0.muscache.com/im/pictures/fab79f25-2e10-4f0f-9711-663cb69dc7d8.jpg?aki_policy=profile_x_medium",
          "host_neighbourhood": "",
          "host_response_rate": 100,
          "host_is_superhost": false,
          "host_has_profile_pic": true,
          "host_identity_verified": true,
          "host_listings_count": 3,
          "host_total_listings_count": 3,
          "host_verifications": [
              "email",
              "phone",
              "reviews",
              "jumio",
              "offline_government_id",
              "government_id"
          ]
      },
      "address": {
          "street": "Porto, Porto, Portugal",
          "suburb": "",
          "government_area": "Cedofeita, Ildefonso, Sé, Miragaia, Nicolau, Vitória",
          "market": "Porto",
          "country": "Portugal",
          "country_code": "PT",
          "location": {
              "type": "Point",
              "coordinates": [
                  -8.61308,
                  41.1413
              ],
              "is_location_exact": false
          }
      },
      "availability": {
          "availability_30": 28,
          "availability_60": 47,
          "availability_90": 74,
          "availability_365": 239
      },
      "review_scores": {
          "review_scores_accuracy": 9,
          "review_scores_cleanliness": 9,
          "review_scores_checkin": 10,
          "review_scores_communication": 10,
          "review_scores_location": 10,
          "review_scores_value": 9,
          "review_scores_rating": 89
      },
      "reviews": [
          {
              "_id": "58663741",
              "date": {
                  "$date": "2016-01-03T05:00:00.000Z"
              },
              "listing_id": "10006546",
              "reviewer_id": "51483096",
              "reviewer_name": "Cátia",
              "comments": "A casa da Ana e do Gonçalo foram o local escolhido para a passagem de ano com um grupo de amigos. Fomos super bem recebidos com uma grande simpatia e predisposição a ajudar com qualquer coisa que fosse necessário.\r\nA casa era ainda melhor do que parecia nas fotos, totalmente equipada, com mantas, aquecedor e tudo o que pudessemos precisar.\r\nA localização não podia ser melhor! Não há melhor do que acordar de manhã e ao virar da esquina estar a ribeira do Porto."
          },
          {
              "_id": "62413197",
              "date": {
                  "$date": "2016-02-14T05:00:00.000Z"
              },
              "listing_id": "10006546",
              "reviewer_id": "40031996",
              "reviewer_name": "Théo",
              "comments": "We are french's students, we traveled some days in Porto, this space was good and we can cooking easly. It was rainning so we eard every time the water fall to the ground in the street when we sleeping. But It was cool and or was well received by Ana et Gonçalo"
          },
          {
              "_id": "68310569",
              "date": {
                  "$date": "2016-04-04T04:00:00.000Z"
              },
              "listing_id": "10006546",
              "reviewer_id": "53859850",
              "reviewer_name": "Bart",
              "comments": "We had a spledid time in the old centre of Porto.\r\nThe appartment is very well situated next to the old Ribeira square. It's perfect to have such an appartment to your disposal, you feel home, and have a place to relax between the exploration of this very nice city.\r\nWe thank Ana \u0026 Gonçalo, and we hope the appartment is free when we go back next year. Porto is charming original."
          },
          {
              "_id": "403055315",
              "date": {
                  "$date": "2019-01-20T05:00:00.000Z"
              },
              "listing_id": "10006546",
              "reviewer_id": "15138940",
              "reviewer_name": "Milo",
              "comments": "The house was extremely well located and Ana was able to give us some really great tips on locations to have lunch and eat out. The house was perfectly clean and the easily able to accommodate 6 people despite only having one bathroom. The beds and living room were comfortable. \n\nHowever, we always felt somewhat on edge in the house due to the number of signs posted around the kitchen, bedrooms and bathroom about being charged 15€ for all sorts of extras like not washing up or using extra towels and bed linen. Not that this would be particularly unreasonable but it made us feel like we were walking on egg shells in and around the house. \n\nThe hosts were aware that we were a group of six yet one of the beds was not prepared and we ran out of toilet paper well before we were due to check out despite only being there 2 nights. It really wasn't the end of the world but the shower head does not have a wall fitting meaning you had to hold it yourself if you wanted to stand underneath it."
          }
      ]
  }]

  const geometryJson = {
    type: "FeatureCollection",
    features: locations.map(location => ({
      type: "Feature",
      geometry: {
        type: location.address.location.type, // Assuming this exists in your location data
        coordinates: location.address.location.coordinates
      }
    }))
  };
  
  // print stringified JSON
  console.log(JSON.stringify(geometryJson, null, 2));
  
  // map starts at UCLA
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-8.61308);
  const [lat, setLat] = useState(41.1413);
  const [zoom, setZoom] = useState(13);

  console.log('Rendering Dashboard');
  useEffect(() => {
    if (map.current) return; // initialize map only once
  
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
  
    console.log('Map created');
    // Wait for the map to be loaded before adding markers
    map.current.on('load', () => {
      console.log('Map loaded');
      locations.forEach(location => {
        new mapboxgl.Marker()
          .setLngLat([location.address.location.coordinates[0], location.address.location.coordinates[1]])
          .addTo(map.current); // make sure to add to map.current
      });

      map.current.addSource('locations', {
        type: 'geojson',
        data: geometryJson
      });

      map.current.addLayer({
        'id': 'listings',
        'type': 'circle',
        'source': 'locations',
        'paint': {
            'circle-radius': 6,
            'circle-color': '#B42222'
        },
        'filter': ['==', '$type', 'Point']
      });
    });
  }, []); // Empty dependency array ensures this effect runs only once
  

  return (
    <div className="h-screen">
      <h1 className="text-3xl font-bold underline">Dashboard</h1>
      <div ref={mapContainer} className="map-container h-full" />
    </div>
  )
}