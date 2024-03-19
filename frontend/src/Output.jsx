import React from "react";
import './Output.css';

const Output=({stations,route})=>{
    return (
        <div id="output-container">
            {stations.map((station,index)=>(
                <div key={index} className="station">
                    <div className="line" style={{backgroundColor:route[index]==='Train'?'green':'transparent'}}>
                        {route[index]==='Bus' && <div className="bus-marker"></div>}
                    </div>
                    {index > 0 && <div className="interchange"></div>}
                    <p>{station}</p>    
                </div>
            ))}
        </div>

        
    );
};
export default Output;