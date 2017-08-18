import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { LoginScreen } from './components/LoginScreen'
import { IOAScreen } from './components/IOAScreen'

const Nav = StackNavigator({
  LoginRoute: {
    screen: LoginScreen,
    navigationOptions: {
      header: null
    }
  },
  IOAScreenRoute: {
    screen: IOAScreen,
    navigationOptions: {
      // header: null,
      // headerLeft: null
    }
  }
})

export default class App extends React.Component {
  render() {
    return (
      <Nav/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  }
});
