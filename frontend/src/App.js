import React,{useState} from 'react';
import './App.css';

function TripPlanner() {
  const [source,setSource]=useState('');
  const [destination,setDestination]=useState('');
  const [tripResults,setTripResults]=useState('');

  const planTrip=async()=>{
    try{
      const response=await fetch('path',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({source,destination}),
      });
      const data=await response.json();
      setTripResults(data);
    }catch(error){
      console.error('Error planning trip:',error);
    }
  };
  return (
    <div className="App">
      <h1>Trip Planner</h1>

      <label htmlFor='source'>Source:</label>
      <input type='text' id='source' placeholder="Enter source place:" value={source}
        onChange={(e) => setSource(e.target.value)} />
      
      <label htmlFor='destination'>Destination:</label>
      <input type='text' id='destination' placeholder="Enter destination place" value={destination}
        onChange={(e) => setDestination(e.target.value)} 
        />
      <button onClick={planTrip}>Plan Trip</button>
      <div id='tripResults'>
        <p>{tripResults}</p>
      </div>
    </div>
  );
}

export default TripPlanner;
