import React, { Component } from 'react'
import { Animated, View, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Text, TextInput, Button, StyleSheet, Image } from 'react-native'

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
      topGap: new Animated.Value(noKeyboard.topGap)
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

  async submit() {
    const { navigate } = this.props.navigation;
    let username = this.state.username;
    let password = this.state.password;
    if(username) {
      fetch('https://292e0ff7.ngrok.io/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      }).then((response) => {
        if(response.status === 204) {
          navigate('IOAScreenRoute')
        }
        return response.json();
      }).then((response) => {
        // TODO handle
        console.log(response);
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
              <View style={{height: 10}} />
              <View style={styles.submitWrapper}>
                <Button title='Login'
                        color='white'
                        style={styles.submit}
                        onPress={this.submit.bind(this)}/>
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
    // alignSelf: 'stretch',
    flex: 1,
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    // flexDirection: 'column',
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
    // flex: 1
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
