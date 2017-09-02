import React from 'react'
import { StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Button, KeyboardAvoidingView } from 'react-native'
import DatePicker from 'react-native-datepicker'
import store from 'react-native-simple-store';
import config from '../config'

export class IOAForm extends React.Component {

  constructor(props) {
    super(props);
    
    let today = new Date().toISOString().substring(0, 10)
    this.state = {
      minDate: this.getMinDate(),
      maxDate: today,
      date: today,
      lessThanFifteen: '',
      greaterThanFifteen: '',
      limitedEnglishProficiency: '',
      totalForms: ''
    }
  }

  getMinDate() {
    let minDate = new Date()
    minDate.setDate(minDate.getDate() - 30);
    return minDate.toISOString().substring(0, 10);
  }

  async submit() {
    const { navigate } = this.props.navigation;
    let {date, lessThanFifteen, greaterThanFifteen, limitedEnglishProficiency, totalForms} = this.state;
    if(date && lessThanFifteen && greaterThanFifteen && limitedEnglishProficiency && totalForms) {
      store.get('rememberUser').then((val) => {
        console.log(val);
      });
      store.get('jwt').then((jwt) => {
        fetch(config.IoAService + '/tally', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': jwt[0] 
          },
          body: JSON.stringify({
            date,
            lessThanFifteen,
            greaterThanFifteen,
            limitedEnglishProficiency,
            totalForms
          })
        }).then((response) => {
          if(response.status === 204) {
            return navigate('IOAFormRoute')
          }
          return response.json();
        }).then((response) => {
          // TODO handle
          console.log(response);
        }).catch((error) => {
          //TODO handle
          console.error(error);
        })
      })
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}
                            behavior='position'>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.header}>
              Please enter Instance of Assistance info below:
            </Text>
            <View style={styles.form}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>
                  Select Date:
                </Text>
                <DatePicker
                  style={styles.datePicker}
                  date={this.state.date}
                  mode='date'
                  placeholder='select date'
                  format="YYYY-MM-DD"
                  minDateDate={this.state.minDate}
                  maxDateDate={this.state.maxDate}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                  }
                }/>
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>
                  Instances less than 15 minutes:
                </Text>
                <TextInput style={styles.instanceInput}
                          keyboardType='numeric'
                          onChangeText={(lessThanFifteen) => this.setState({lessThanFifteen})}
                          value={this.state.lessThanFifteen}/>
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>
                  Instances longer than 15 minutes:
                </Text>
                <TextInput style={styles.instanceInput}
                          keyboardType='numeric'
                          onChangeText={(greaterThanFifteen) => this.setState({greaterThanFifteen})}
                          value={this.state.greaterThanFifteen}/>
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>
                  Language Assistance Instances (LEP):
                </Text>
                <TextInput style={styles.instanceInput}
                          keyboardType='numeric'
                          onChangeText={(limitedEnglishProficiency) => this.setState({limitedEnglishProficiency})}
                          value={this.state.limitedEnglishProficiency}/>
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>
                  Total Forms: 
                </Text>
                <TextInput style={styles.instanceInput}
                          keyboardType='numeric'
                          onChangeText={(totalForms) => this.setState({totalForms})}
                          value={this.state.totalForms}/>
              </View>
              <View style={styles.submitWrapper}>
                <Button title='Submit'
                        color='white'
                        style={styles.submit}
                        onPress={this.submit.bind(this)}/>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  form: {
    justifyContent: 'space-around'
  },
  submitWrapper: {
    marginTop: 50,
    backgroundColor: 'blue'
  },
  submit: {
    height: 40,
    width: 200,
    color: 'white',
    backgroundColor: 'blue'
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40
  },
  instanceInput: {
    height: 40,
    width: 100,
    borderColor: 'gray',
    borderWidth: 1
  },
  label: {
    // textAlign: 'center',
    fontSize: 18,
    width: 180
  },
  header: {
    marginTop: 10,
    width: 300,
    fontSize: 20,
    textAlign: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  }
});
