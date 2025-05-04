import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function USChinaSimulation() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>USChinaSimulation</h1>;
            <button className="active" onClick={() => { navigate('/vqm-TradeWarX/') }}>Home</button>
            
                
        </div>
    )
}

export default USChinaSimulation;