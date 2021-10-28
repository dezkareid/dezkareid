import React from 'react';
// eslint-disable-next-line import/no-unresolved
import GoogleMaps from '@dezkareid/react-components/GoogleMaps';

const zoom = 8;
const center = {
  lat: -25.344,
  lng: 131.036
};
const mapOptions = {
  center,
  zoom
};

const key = process.env.GOOGLE_MAPS_KEY;
const App = () => (
  <GoogleMaps mapKey={key} mapOptions={mapOptions} className="App__Map" />
);

export default App;
