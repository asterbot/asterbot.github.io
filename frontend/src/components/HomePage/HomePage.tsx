import React from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="homepage-container">
      <img src={require('./img/pfp.png')} alt="Profile" className="profile-image" />
      <h1 className="homepage-title">Hello!</h1>
        <div className="box-body">
          <table className="intro-table">
          <tbody>
              <tr>
                  <td>
                      <div className="text-container">
                          <div className="intro-text">
                              <span className="question">Who am I?</span> "A huge nerd" doesn't even scratch the surface.<br />
                              <br />
                              This website will be a culmination of my professional portfolio and a way for me to talk about things in tech I find cool. 
                              Have fun looking around!
                              <br /><br />
                              <span className="motto"><i>yee haw</i></span>
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
