// /client/App.js
import React, { Component } from "react";
import './App.css'
import DbShit from './components/DbShit'
import TomTomMap from './components/tom-tom-map/TomTomMap'

class App extends Component {
  render() {
    return <div>
    <DbShit></DbShit>
    <TomTomMap></TomTomMap>
  </div>
  }
}

export default App;