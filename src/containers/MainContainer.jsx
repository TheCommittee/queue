import React, { Component } from 'react';
import CategoryContainer from './CategoryContainer.jsx';
import VenueContainer from './VenueContainer.jsx';

class MainContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchInput: '',
      location: '',
      // searchResults: [{id: 'test', name: 'hello'}, {id: '5', name: 'hello'}, {id: '6', name: 'hello'}],
      // searchResults: [],
      waitTime: 0,
      venueId: '',
      venueName: '',
      venueUrl: '',
      venueImage: '',
      venueLocation: '',
      latitude: '',
      longitude: '',
      homePage: true,
      categoryPage: false,
      venuePage: false,
      searchResults: [],
      current: 10,
      total: 50,
    }

    this.setLocation = this.setLocation.bind(this);
    this.setSearchInput = this.setSearchInput.bind(this);
    this.search = this.search.bind(this);
    this.selectVenue = this.selectVenue.bind(this);
    this.setWaitTime = this.setWaitTime.bind(this);
    this.addWaitTime = this.addWaitTime.bind(this);
  }

  setLocation(event) {
    this.setState({ location: event.target.value });
  }

  setSearchInput(event) {
    this.setState({ searchInput: event.target.value });
    console.log(this.state.searchResults)
  }

  search() {
    if (this.state.current >= this.state.total) return;

    console.log('THIS STATE LOCATION : ', this.state.location);
    
    fetch ('/api', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({location: this.state.location})
    })
      .then(response => response.json())
      .then(data => {
        const parsedData = JSON.parse(data);
        console.log('PARSEDDATA: ', parsedData);
        console.log('introspecting the data: ', parsedData.businesses[0])
        const firstBusinessLatitude = parsedData.businesses[0].coordinates.latitude;
        const firstBusinessLongitude = parsedData.businesses[0].coordinates.longitude;
        
        const listOfBusinesses = [];
        console.log(parsedData.businesses.length)
        for (let i = 0; i < this.state.current; i += 1) {
          listOfBusinesses.push({
            id: parsedData.businesses[i].id, 
            name: parsedData.businesses[i].name, 
            image: parsedData.businesses[i].image_url, 
            location: parsedData.businesses[i].location,
            category: parsedData.businesses[i].categories[0].title,
          });
        }

        // this.setState({ latitude: firstBusinessLatitude.toString(), longitude: firstBusinessLongitude.toString() })

        this.setState(state => {
          return {
            latitude: firstBusinessLatitude.toString(),
            longitude: firstBusinessLongitude.toString(),
            searchResults: listOfBusinesses,
            current: state.current + 10
          }
        })
      })

      this.setState({ 
      homePage: false,
      categoryPage: true,
      venuePage: false,
    })
  }

  setWaitTime(event) {
    this.setState({ waitTime: event.target.value })
  }

  addWaitTime() {
    // create body from the things we've saved in state through the setwaittime and from selecting a specific venue
    const body = {
      waitTime: this.state.waitTime,
      venueId: this.state.venueId,
      venueName: this.state.venueName,
    }
    // console.log(body);
    fetch('/dbRouter/addWaitTime', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    })
    .then(() => console.log('addwaittime fetch request successful'))
    .catch((err) => {
      console.log(`${err}: addWaitTime func err when adding wait time`)
    })
  }
  
  selectVenue(id, name, url, image, location) {
    const venueId = id;
    const venueName = name;
    const venueUrl = url;
    const venueImage = image;
    const venueLocation = location;
    
    this.setState({ 
      homePage: false,
      categoryPage: false,
      venuePage: true,
      venueId,
      venueName,
      venueUrl,
      venueImage,
      venueLocation,
    })
  }

  render() {
    // conditional rendering for the homepage; default true (shows first)
    let home = null;
    if (this.state.homePage) {
      home = 
      <div>
        <div>
        Home Page
        </div>
        <input type="input" id="searchInput" placeholder="Business or Category" onChange={this.setSearchInput}/>
        <input type="input" id="location" placeholder="Location" onChange={this.setLocation}/>
        <input type="button" id="searchButton" value="Search" onClick={this.search}/>
      </div>
    }

    let category = null;
    if (this.state.categoryPage) {
      category = 
      <CategoryContainer 
        searchInput={this.state.searchInput}
        location={this.state.location}
        searchResults={this.state.searchResults}
        waitTimes={this.state.waitTimes}
        homePage={this.state.homePage}
        categoryPage={this.state.categoryPage}
        venuePage={this.state.venuePage}   
        selectVenue={this.selectVenue}
        latitude={this.state.latitude}
        longitude={this.state.longitude}
        search={this.search}
      />
    }

    // conditional render of the vendor page
  let venue = null;
  if (this.state.venuePage) {
    venue = 
    <VenueContainer
      venueId={this.state.venueId}
      venueName={this.state.venueName}
      venueUrl={this.state.venueUrl}
      venueImage={this.state.venueImage}
      venueLocation={this.state.venueLocation}
      setWaitTime={this.setWaitTime}
      addWaitTime={this.addWaitTime}
    />
  }
    
    return (
      <div>
      {home}
      {category}
      {venue}
      </div>
    )
  }
}

export default MainContainer;