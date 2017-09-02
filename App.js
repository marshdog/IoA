import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { LoginScreen } from './components/LoginScreen'
import { IOAForm } from './components/IOAForm'



const Nav = StackNavigator({
  LoginRoute: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
      headerBackTitle: 'Logout',
    }
  },
  IOAFormRoute: {
    screen: IOAForm,
    navigationOptions: {}
  }
})

export default class App extends React.Component {
  render() {
    return (
      <Nav/>
    );
  }
}
