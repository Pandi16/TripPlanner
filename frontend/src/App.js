import React,{useState} from 'react';
import './App.css';
import Output from './Output'
function TripPlanner() {
  // const [source,setSource]=useState('');
  // const [destination,setDestination]=useState('');
  // const [tripResults,setTripResults]=useState('');

  // const planTrip=async()=>{
  //   try{
  //     const response=await fetch('path',{
  //       method:'POST',
  //       headers:{
  //         'Content-Type':'application/json',
  //       },
  //       body:JSON.stringify({source,destination}),
  //     });
  //     const data=await response.json();
  //     setTripResults(data);
  //   }catch(error){
  //     console.error('Error planning trip:',error);
  //   }
  // };
  const stations=['Station_A','Station_b','Station_c','Station_d'];
  const route=['train','bus','train'];
  return (
    <div className="App">
      {/* <h1>Trip Planner</h1>

      <label htmlFor='source'>Source:</label>
      <input type='text' id='source' placeholder="Enter source place:" value={source}
        onChange={(e) => setSource(e.target.value)} />
      
      <label htmlFor='destination'>Destination:</label>
      <input type='text' id='destination' placeholder="Enter destination place" value={destination}
        onChange={(e) => setDestination(e.target.value)} 
        />
      <button onClick={planTrip}>Plan Trip</button> */}
      <div id='tripResults'>
        <h1>Trip Planner</h1>
        <Output stations={stations} route={route} />
      </div>
    </div>
  );
}

export default TripPlanner;
