import React, { useRef, useEffect } from 'react';

const Map = ({ apiKey, address }) => {
  const mapRef = useRef(null);
  const map = useRef(null); 

  useEffect(() => {
  
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.error('Error loading Google Maps API.');
    };

    document.body.appendChild(script);

    script.onload = () => {
      map.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 12,
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey]);

  useEffect(() => {
    if (map.current && address) {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results[0] && results[0].geometry) {
          map.current.setCenter(results[0].geometry.location);
        } else {
          console.error('Geocode request failed:', status);
        }
      });
    }
  }, [address]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>;
};

export default Map;




