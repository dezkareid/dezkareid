import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useGoogleMaps } from '@dezkareid/react-hooks';

function GoogleMaps({ mapKey, mapOptions, className, children }) {
  const google = useGoogleMaps({ key: mapKey });
  const [map, setMap] = useState(null);
  const mapRef = useRef();
  useEffect(() => {
    if (google) {
      const mapInstance = new google.maps.Map(mapRef.current, {
        ...mapOptions
      });
      setMap(mapInstance);
    }
  }, [google, mapOptions]);
  const mapElements = React.Children.map(children, child =>
    React.cloneElement(child, { map })
  );
  return (
    <div ref={mapRef} className={className}>
      {mapElements}
    </div>
  );
}

GoogleMaps.propTypes = {
  className: PropTypes.string,
  mapKey: PropTypes.string.isRequired,
  mapOptions: PropTypes.shape({
    center: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired
    }).isRequired,
    zoom: PropTypes.number.isRequired
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

GoogleMaps.defaultProps = {
  className: '',
  children: null
};

export default GoogleMaps;
