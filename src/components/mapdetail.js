import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import Image from '../assets/school.jpeg';
import waterMarker from '../assets/marker/water.png';
import registerMarker from '../assets/marker/register.png';
import conferenceMarker from '../assets/marker/conference.png';
import toiletMarker from '../assets/marker/toilet.png';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import polyline from 'polyline';
import starbucks1 from '../assets/marker/starbucks.png'
import mcdonalds from '../assets/marker/mcodnald.png'
import foodcourt from '../assets/marker/foodcourt.png'
import default1 from '../assets/marker/default.png'
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react"; 
import recenterIcon from "../images/Maprecenter.png";

const MapComponent = (props) => {
  const localhostapi = "http://localhost:5000";
  const serverlessapi = "https://adminilftest.onrender.com";
  const [userLocation, setUserLocation] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(true);
  const [isRouting, setIsRouting] = useState(false);
  const [routingControl, setRoutingControl] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const position = [1.308437408372863, 103.77671290142386];
  const mapRef = useRef();
  const [cloudName] = useState("dxkozpx6g");
  const [uploadPreset] = useState("jcck4okm");
  const [publicId, setPublicId] = useState("");

  const [uwConfig] = useState({
    cloudName,
    uploadPreset,
    cropping: true, //add a cropping step
    // showAdvancedOptions: true,  //add advanced options (public_id and tag)
    // sources: [ "local", "url"], // restrict the upload sources to URL and local files
    multiple: false, //restrict upload to a single file
    // folder: "user_images", //upload files to the specified folder
    // tags: ["users", "profile"], //add the given tags to the uploaded files
    // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
    // clientAllowedFormats: ["images"], //restrict uploading to image files only
    // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
    // maxImageWidth: 500, //Scales the image down to a width of 2000 pixels before uploading
    // theme: "purple", //change to a purple theme
  });


  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const myImage = cld.image(publicId);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverlessapi}/markers`);
        setMarkers(response.data);
        console.log('Refill data:', response.data);
      } catch (error) {
        console.error('Error fetching refill locations:', error);
      }
    };

    fetchData();
  }, []);

  const handleRouteButtonClick = async (coordinates) => {
    if (isRouting) {
      handleStopRouting();
    } else {
      try {
        if (!mapRef.current || !userLocation) {
          console.error('Map or user location not available.');
          return;
        }

        const urluser = `https://www.onemap.gov.sg/api/auth/post/getToken`;

        const requestBody = {
          email: process.env.REACT_APP_EMAIL,
          password: process.env.REACT_APP_PASSWORD,
        };
        const userresponse = await fetch(urluser, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const userresponseData = await userresponse.json();
        console.log("token response", userresponseData.access_token);

        const authToken = userresponseData.access_token;
        const startCoordinates = `${userLocation[0]},${userLocation[1]}`;
        const endCoordinates = `${coordinates[0]},${coordinates[1]}`;

        const apiUrl = `https://www.onemap.gov.sg/api/private/routingsvc/route?start=${startCoordinates}&end=${endCoordinates}&routeType=walk`;

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          console.error('Error fetching route data:', response.status, response.statusText);
          return;
        }

        const routeData = await response.json();

        if (!routeData.route_geometry) {
          console.error('No route geometry found in the API response.');
          return;
        }

        const decodedCoordinates = polyline.decode(routeData.route_geometry);
        const routeLatLngs = decodedCoordinates.map(([lat, lng]) => L.latLng(lat, lng));

        const routePolyline = L.polyline(routeLatLngs, { color: 'blue' });

        const newRoutingControl = L.Routing.control({
          waypoints: [L.latLng(userLocation[0], userLocation[1]), L.latLng(coordinates[0], coordinates[1])],
          createMarker: function () {},
          routeLine: (route) => routePolyline,
        });

        newRoutingControl.addTo(mapRef.current);
        setRoutingControl(newRoutingControl);
        setIsRouting(true);
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  };

  const handleStopRouting = () => {
    if (isRouting && routingControl) {
      mapRef.current.removeControl(routingControl);
      setRoutingControl(null);
      setIsRouting(false);
    }
  };

  const handleFilterClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleRecenterClick = () => {
    if (mapRef.current ) {
      mapRef.current.setView(position, 16.5);
    }
  };

  const filteredMarkerLocations = markers.filter((markerlocation) => {
    return selectedCategory ? markerlocation.category === selectedCategory : true;
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => {
        console.error(error);
        setHasLocationPermission(false);
      }
    );
  }, []);

  useEffect(() => {
    return () => {
      if (routingControl) {
        mapRef.current.removeControl(routingControl);
      }
    };
  }, [routingControl]);

  return (
    <div id="map" className="relative">
      <MapContainer center={position} zoom={16.5} className="w-full h-screen" ref={mapRef}>
        <TileLayer
          url="https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png"
          attribution='Map data © <a href="https://www.onemap.sg/" target="_blank">OneMap</a'
        />

        {userLocation && (
          <CircleMarker center={userLocation} radius={5} color="red">
            <Popup>User's Location</Popup>
          </CircleMarker>
        )}

        {filteredMarkerLocations.map((markerlocation) => {
          let iconUrl;
          let iconSize;

          switch (markerlocation.category) {
            case 'water':
              iconUrl = waterMarker;
              iconSize = [18, 29];
              break;
            case 'register':
              iconUrl = registerMarker;
              iconSize = [18, 29];
              break;
            case 'conference':
              iconUrl = conferenceMarker;
              iconSize = [18, 29];
              break;
            case 'toilet':
              iconUrl = toiletMarker;
              iconSize = [18, 29];
              break;
            case 'sbux':
              iconUrl = starbucks1;
              iconSize = [30, 29]; // Set different size for 'sbux'
              break;
            case 'mcd':
              iconUrl = mcdonalds;
              iconSize = [30, 29]; // Set different size for 'mcd'
              break;
            case 'fc':
                iconUrl = foodcourt;
                iconSize = [40, 40]; // Set different size for 'mcd'
                break;
            default:
              iconUrl = default1;
              iconSize = [18, 29];
          }

          const customIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: iconSize,
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });

       

          const coordinates = markerlocation.coordinates.split(',').map((coord) => parseFloat(coord));

          return (
            <Marker key={markerlocation.mapid} position={coordinates} icon={customIcon}>
              <Popup>
                <div id={`divRefill${markerlocation.mapid}`}>
                  <h3 id={`Refill${markerlocation.mapid}`}>{markerlocation.location_name}</h3>
                  <AdvancedImage
                        style={{ maxWidth: "100%" }}
                        cldImg={cld.image(publicId || markerlocation.image)}
                        plugins={[responsive(), placeholder()]}
                      />
                  <p>{markerlocation.description}</p>
                  {hasLocationPermission && (
                    <button
                      id="RefillButton"
                      onClick={() => (isRouting ? handleStopRouting() : handleRouteButtonClick(coordinates))}
                    >
                      {isRouting ? 'Stop Routing' : `Route to ${markerlocation.location_name}`}
                    </button>
                  )}
                  {!hasLocationPermission && <p>Please enable location services to show route</p>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute top-1 right-4 mt-2">
  <button
    className="flex items-center justify-center bg-white text-white rounded-full text-xs w-[2.75rem] h-[2.75rem] md:w-12 md:h-12 border border-gray-950 shadow-lg hover"
    onClick={handleRecenterClick}
  >
    <img
      className="w-4/6 h-auto"
      src={recenterIcon}
      alt="map"
    />
  </button>
</div>

      <div id="buttons-container" className="flex flex-wrap justify-center items-center fixed bottom-4 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        <button
          className={`filter-button ${selectedCategory === 'water' ? 'water' : ''} px-3 py-2 mx-1 my-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-xs w-[5.5rem] h-12 md:text-sm  md:w-40`}
          onClick={() => handleFilterClick('water')}
        >
          Water Refill
        </button>
        <button
          className={`filter-button ${selectedCategory === 'register' ? 'register' : ''} px-3 py-2 mx-1 my-1 bg-[#B76711] hover:bg-[#9E5A10] text-white rounded-md text-xs w-[5.5rem] h-12 md:text-sm  md:w-40`}
          onClick={() => handleFilterClick('register')}
        >
          Registration Desks
        </button>
        <button
          className={`filter-button ${selectedCategory === 'conference' ? 'conference' : ''} px-3 py-2 mx-1 my-1 bg-[#39B54A] hover:bg-[#1B6B26] text-white rounded-md text-xs w-[5.5rem] h-12 md:text-sm  md:w-40`}
          onClick={() => handleFilterClick('conference')}
        >
          Convention Centre
        </button>
        <button
          className={`filter-button ${selectedCategory === 'toilet' ? 'toilet' : ''} px-3 py-2 mx-1 my-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs  w-[5.5rem] h-12 md:text-sm  md:w-40`}
          onClick={() => handleFilterClick('toilet')}
        >
          Restrooms
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
