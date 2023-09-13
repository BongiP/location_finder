import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import Map from './components/Map';
import Footer from './components/Footer'

function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [travelMode, setTravelMode] = useState('DRIVING'); 

  const handleSearch = (address) => {
    if (!origin) {
      setOrigin(address);
    } else {
      setDestination(address);
    }
  };

  const handleTravelModeChange = (mode) => {
    setTravelMode(mode);
  };

  const calculateDistanceAndDuration = () => {
    if (origin && destination) {
      
      const directionsService = new window.google.maps.DirectionsService();

      
      const request = {
        origin: origin,
        destination: destination,
        travelMode: travelMode,
      };

      
      directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          const route = result.routes[0];
          const distance = route.legs[0].distance.text;
          const duration = route.legs[0].duration.text;
          setDistance(distance);
          setDuration(duration);
        } else {
          
          console.error('Directions request failed:', status);
          setDistance(null); 
          setDuration(null);
        }
      });
    }
  };

  
  useEffect(() => {
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.error('Error loading Google Maps API.');
    };

    document.body.appendChild(script);

    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="App">
      
      <h1>Location Finder App</h1>
      <SearchBar onSearch={handleSearch} />
     
      
      <div>
        <label>Select Travel Mode:</label>
        <select
          value={travelMode}
          onChange={(e) => handleTravelModeChange(e.target.value)}
        >
          <option value="DRIVING">Driving</option>
          <option value="WALKING">Walking</option>
        </select>
      </div>

      {origin && destination && (
        <div>
          <p>Distance: {distance}</p>
          <p>Duration: {duration}</p>
        </div>
      )}
      <Map apiKey="process.env.REACT_APP_API_KEY" /> 
      <button onClick={calculateDistanceAndDuration}>Calculate Distance</button>

      <Footer />
    </div>
  );
}

export default App;
