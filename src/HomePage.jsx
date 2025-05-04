// HomePage.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HomePageBanner from'./components/HomePageBanner'

function HomePage() {
    const navigate = useNavigate();
    return (
        <div>
            <HomePageBanner/>
               
        </div>
    )
}

export default HomePage;