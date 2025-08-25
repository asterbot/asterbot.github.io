import React from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
  
  return (
    <div className="homepage-container">
      <img src={require('../../img/pfp.png')} alt="Profile" className="profile-image" />
      <h1 className="homepage-title">Hello!</h1>
        <div className="box-body">
          <table className="intro-table">
          <tbody>
              <tr>
                  <td>
                      <div className="text-container">
                          <div className="intro-text">
                              <span className="question">Who am I?</span> A work in progress, fueled by code and curiosity.<br/> 
                              A massive tech nerd, currently studying <span className="highlight">CS@UWaterloo</span>, in the class of 2027!<br />
                              <br />
                              This website will be a culmination of my professional portfolio and an outlet for me to talk about things I find cool. 
                              Hope you enjoy looking around!
                              <br /><br />
                              <span className="motto"><i>Code, chaos, create!</i></span>
                          </div>
                      </div>
                  </td>
              </tr>
          </tbody>
          </table>
          </div>      
    </div>
  );
};

export default HomePage;
