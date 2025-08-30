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
                              <span className="question">Who am I?</span> "A huge nerd" doesn't even scratch the surface. 
                              <br /><br />
                              I love making things with code, whether its games, apps, database systems or anything in between, working with software is my biggest passion!<br />
                              Have fun looking around!
                              <br /><br />
                              You can also check out my socials on the left and feel free to reach out however you see fit!
                              <br /><br />
                              <span className="motto"><i>Coding my chaos!</i></span>
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
