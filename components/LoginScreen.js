import React, { Component } from 'react'
import { Animated, View, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Text, TextInput, Button, StyleSheet, Image } from 'react-native'
import config from '../config'
import { CheckBox } from 'react-native-elements'
import store from 'react-native-simple-store';

const noKeyboard = {
  logoHeight: 200,
  topGap: 50
}

const shownKeyboard = {
  logoHeight: 150,
  topGap: 0
}

const keyboardAnimate = (animatedVal, newVal, event) => {
  Animated.timing(animatedVal, {
    duration: event.duration,
    toValue: newVal
  }).start();
}

export class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      logoHeight: new Animated.Value(noKeyboard.logoHeight),
      topGap: new Animated.Value(noKeyboard.topGap),
      rememberUser: true
    }   
  }

  componentWillMount () {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (event) => {this._keyboardWillShow(event)});
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', (event) => {this._keyboardWillHide(event)});
  }

  componentWillUnmount () {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  _keyboardWillShow(event) {
    for(let key in shownKeyboard) {
      if(shownKeyboard.hasOwnProperty(key)) {
        keyboardAnimate(this.state[key], shownKeyboard[key], event)
      }
    }
  }

  _keyboardWillHide(event) {
    for(let key in noKeyboard) {
      if(noKeyboard.hasOwnProperty(key)) {
        keyboardAnimate(this.state[key], noKeyboard[key], event)
      }
    }
  }

  async login(username, password, rememberUser) {
    return fetch(config.IoAService + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then((response) => {
      let status = response.status;
      let jwt = response.headers.map.authorization;
  
      if(status > 199 && status < 300 && jwt) {
        store.save('jwt', jwt);
        store.save('rememberUser', rememberUser);
      }
      return response
    })
  }

  async submit() {
    let { navigate } = this.props.navigation;
    let {username, password, rememberUser} = this.state;
    if(username && password) {
      this.login(username, password, rememberUser).then((response) => {
        switch(response.status) {
          case 204: 
            navigate('IOAFormRoute');
            break
          default: 
            return
        }
      }).catch((error) => {
        //TODO handle
        console.error(error);
      })
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}
                            behavior='padding'>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#fff'
          }}>
            <View style={styles.header}>
              <Animated.Image
                source = {require('../images/justicecorps.jpg')}
                style={{height: this.state.logoHeight, width: this.state.logoHeight}}
              />
            </View>
            <View style={{flex: 0.2}} />
            <View style={styles.form}>
              <View style={styles.formInput}>
                <Text>
                  Username:
                </Text>
                <TextInput style={styles.input}
                           blurOnSubmit
                           onChangeText={(username) => this.setState({username})}
                           value={this.state.username}/>
              </View>
              <View style={{height: 5}} />
              <View style={styles.formInput}>
                <Text>
                  Password:
                </Text>
                <TextInput style={styles.input}
                           blurOnSubmit
                           onChangeText={(password) => this.setState({password})}
                           value={this.state.password}
                           secureTextEntry/>
              </View>
              <View style={styles.remember}>
                <CheckBox
                  title='Keep me logged in'
                  checked={this.state.rememberUser}
                  onPress={() => this.setState({rememberUser: !this.state.rememberUser})}
                />
              </View>
              <View style={{height: 10}} />
              <View style={styles.submitWrapper}>
                <Button title='Login'
                        color='white'
                        style={styles.submit}
                        onPress={() => this.submit()}/>
              </View>
              <View style={{ height: 60 }}/>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1
  },
  form: {
    flex: 4,
    justifyContent: 'flex-start',
    flexDirection: 'column'
  },
  formInput: {
    margin: 5
  },
  logoWrapper: {
    flex: 3,
    justifyContent: 'center'
  },
  submitWrapper: {
    margin: 5,
    backgroundColor: 'blue'
  },
  submit: {
    color: 'white'
  } });
