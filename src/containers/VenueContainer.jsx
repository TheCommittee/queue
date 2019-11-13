import React from 'react';
import VenueDetails from '../components/VenueDetails.jsx';
import WaitTimesDisplay from '../components/WaitTimesDisplay.jsx';
import '../css/VenuePage.css'

const VenueContainer = (props) => {

  const openTableName = props.venueName.replace(/[é]/g, 'e');

  const googleName = props.mapName.replace(/[^A-Za-z]/g, "")


  fetch(`https://opentable.herokuapp.com/api/restaurants?name=${openTableName}&zip=${props.venueLocation.zip_code}`)
      .then(data => data.json())
      .then(data => console.log(data.restaurants[0].id ))

  console.log('word');



  // render map and wait times
  return (
    <div>
      <section className="search-bar">
        <img id="logo-pic-venue" src="https://image.flaticon.com/icons/png/512/876/876569.png"/>
        <input type="input" id="searchInput" placeholder="Business or Category" onChange={ props.setSearchInput }/>
        <input type="input" id="location" placeholder="Location" onChange={ props.setLocation }/>
        <input type="button" id="searchButton" onClick={ props.search }/>
      </section>
      <div id="venue-page">
        <div id="venue-details-column">
          <VenueDetails
            venueName = { props.venueName }
            venueUrl = { props.venueUrl }
            venueImage = { props.venueImage }
            venueLocation = { props.venueLocation }
            venuePhone = { props.venuePhone }
          />
          <WaitTimesDisplay
            venueId = { props.venueId }
            venueWaitTimeList = { props.venueWaitTimeList }
            addWaitTime = { props.addWaitTime }
            setWaitTime = { props.setWaitTime }
          />
        </div>

        <div id="map">
          <iframe
            width="500"
            height="400"
            frameBorder="0"
            // #19 before ${props.venueLatitude} in src link specifies zoom (smaller number = less zoom)
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBa3IwbgGlZ80JTt97JZnl63Rz23uQKrYE&q=${googleName}`}>
          </iframe>
        </div>
      </div>
    </div>
  )
}

export default VenueContainer;
