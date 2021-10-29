import React from 'react';
// eslint-disable-next-line import/no-unresolved
import GoogleMaps from '@dezkareid/react-components/GoogleMaps';
import DMarker from './components/DMarker';

const zoom = 8;
const center = {
  lat: 20.646052379584862,
  lng: -103.41286996931315
};
const mapOptions = {
  center,
  zoom
};

const key = process.env.GOOGLE_MAPS_KEY;
const App = () => (
  <GoogleMaps mapKey={key} mapOptions={mapOptions} className="App__Map">
    <DMarker position={center} />
  </GoogleMaps>
);

export default App;
