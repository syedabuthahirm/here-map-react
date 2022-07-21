import React, {useState} from "react";
import Map from './Map';

function App() {
  const [mapLocation, setmapLocation] = useState({ lat: 50, lng: 5, zoom: 4 });

  const handleMapViewChange = (zoom, lat, lng) => {
    setmapLocation({
      lat,
      lng,
      zoom
    });
  };

  return (
    <div>
      <Map
        lat={mapLocation.lat}
        lng={mapLocation.lng}
        zoom={mapLocation.zoom}
        onMapViewChange={handleMapViewChange} />
    </div>
  );
}

export default App;
