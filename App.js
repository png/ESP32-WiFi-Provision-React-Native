import { StatusBar } from 'expo-status-bar';
import React, { Component, useEffect } from 'react';
import { AppState, StyleSheet, Text, View, Button } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import NetInfo from '@react-native-community/netinfo';
//import generateKeyPairSync from 'crypto'

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      ssid: "uknown",
      connected: false,
      version: "null",
      step:0,
    }
  }

  /***
   * Function to fetch the SSID
   * Should work on both Android and iOS?
   * Need fine location permissions.
   * Sets the state
   */
  getSSID = () => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      console.log(state.details.ssid)
      this.setState({
        ssid: state.details.ssid,
      })
      if (state.details.ssid != undefined && state.details.ssid.startsWith("PROV")){
        this.getProv();
      }
      else{
        this.setState({
          connected: false,
        })
      }
    });
  }

  /***
   * Function to get protocol details
   * Makes POST to proto-ver
   * No content.
   * Ups state.
   */
  getProv = () => {
    return fetch('http://192.168.4.1/proto-ver', {
      method: 'POST',
      body: "-",
    }).then((response) => response.json())
    .then((json) => {
      console.log(json);
      this.setState({
        version:json,
        connected:true,
        step:1,
      })
      return json;
    })
    .catch((error) => {
      console.error(error);
    })
  }

  /**
   * Function to generate X25519 keypair
   */
  
   generateKey = () => {

  }
  

  /***
   * 
   */

  /***
   * Add event listeners on component load
   * Notably, getSSID and window focus change
   */
  componentDidMount(){
    console.log("Mounted.")
    this.getSSID();
    AppState.addEventListener("change", this.getSSID);
    NetInfo.addEventListener(this.getSSID);
  }
  render(){
    if (!this.state.connected){
      return (
        <View style={styles.container}>
          <Button
            title="Connect to Wifi" onPress={() =>
              IntentLauncher.startActivityAsync(IntentLauncher.ACTION_WIFI_SETTINGS)
            }/>
            <Text>{this.state.ssid}</Text>
            <Text>Ready to go? {this.state.connected.toString()}</Text>
          <StatusBar style="auto" />
        </View>
        );
    }
    else{
      return (
        <View style={styles.container}>
          <Text>Connected.</Text>
          <Text>{JSON.stringify(this.state.version)}</Text>
        </View>
      )
    }
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
