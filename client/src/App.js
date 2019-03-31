// /client/App.js
import React, { Component } from "react";
import './App.css'
import DbShit from './components/DbShit'
import Map from './components/map/Map'

class App extends Component {
  render() {
    return <div>
    <DbShit key='shit'></DbShit>
    <Map key='map'></Map>
  </div>
  }
}

export default App;