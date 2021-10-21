import React, { Fragment, useContext, useEffect, useState } from 'react'
import { View, ImageBackground, Text, TouchableOpacity, TextInput, Image, SafeAreaView, StatusBar, StyleSheet, Alert, ActivityIndicator, Modal } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'
// import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
// import { LoginManager, AccessToken, LoginButton, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import message from '@react-native-firebase/messaging'

import AsyncStorage from '@react-native-community/async-storage'
import { Authcontext } from '../context/context'

import { link } from '../link/link'
import { mainColor } from '../../GlobleColor/GlobleColor'


import mail from '../../assets/mail.png'
import pass from '../../assets/password.png'
import user from '../../assets/user.png'
import logi from '../../assets/imageB.jpeg'
import facebook from '../../assets/facebook.png'
import goole from '../../assets/google.png'

var mobile = 'http://localhost/'
var elimator = 'http://10.0.2.2/'

export default function Login() {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [loader, setloader] = useState(false)
  const { login } = useContext(Authcontext)

  // componentDidMount = () => {
  //   GoogleSignin.configure({
  //     //It is mandatory to call this method before attempting to call signIn()
  //     scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
  //     // Repleace with your webClientId generated from Firebase console
  //     webClientId: '304029155739-f60g9jko5qufnsbi75pfb1oonmojri1a.apps.googleusercontent.com',
  //   });
  // }

  const log = async () => {

    const val = await message().getToken()

    console.log(val)

    if (email && password) {
      setloader(true)

      try {
        fetch(link + 'vendor/signin?email=' + email.toLowerCase() + '&password=' + password + '&fromMobile=true' + '&fcmToken=' + val)
          .then((response) => response.json())
          .then(async (responseJson) => {
            console.log('login user data;',responseJson.result);
            if(responseJson.type==='block'){
              setloader(true)
              return alert('Your ID is block')
            }
            if (responseJson.type === 'success') {
              const val = responseJson
              // console.log(val);
              await AsyncStorage.setItem('details', JSON.stringify(val))
              console.log('vendoe details',val);
              await AsyncStorage.setItem('IsSignedIn', 'true').then(() => {
                login()
                setloader(false)
              })
            }
            else {
              setloader(false)
              alert('Email or Password not exist')
            }
          }).catch((e) => {
            Alert.alert(
              'Login',
              'Network Problem'
            )
            setloader(false)
          })

      } catch (e) {
        Alert.alert(
          'Login',
          'Network Problem'
        )
        setloader(false)
      }
    }
    else {
      alert('Please Fill all fields')
    }
  }

  //facebook = async () => {

    // const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    // if (result.isCancelled) {
    //   throw 'User cancelled the login process';
    // }

    // // Once signed in, get the users AccesToken
    // const data = await AccessToken.getCurrentAccessToken();

    // if (!data) {
    //   throw 'Something went wrong obtaining access token';
    // }

    // const token = data.accessToken.toString()

    // const PROFILE_REQUEST_PARAMS = {
    //   fields: {
    //     string: 'id, name,email, first_name, last_name',
    //   },
    // };
    // const profileRequest = new GraphRequest(
    //   '/me',
    //   { token, parameters: PROFILE_REQUEST_PARAMS },
    //   (error, result) => {
    //     if (error) {
    //       console.log('login info has error: ' + error);
    //     } else {

    //       try {
    //         fetch('http://localhost:3000/user/login/' + result.email + '/' + result.id)
    //           .then((response) => response.json())
    //           .then(async (responseJson) => {
    //             if (responseJson.ok == 'ok') {
    //               const val = responseJson.docs
    //               console.log(val);
    //               await AsyncStorage.setItem('details', JSON.stringify(val))

    //               this.props.navigation.navigate('home', { data: responseJson.docs })

    //             }
    //             else {
    //               alert('Account does not exist')
    //             }
    //           })
    //       } catch (e) {

    //       }

    //     }
    //   },
    // );
    // new GraphRequestManager().addRequest(profileRequest).start();

  //}

  // google = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices({
  //       //Check if device has Google Play Services installed.
  //       //Always resolves to true on iOS.
  //       showPlayServicesUpdateDialog: true,
  //     });

  //     // const { idToken } = await GoogleSignin.signIn()
  //     // Create a Google credential with the token

  //     const userInfo = await GoogleSignin.signIn();


  //     if (!userInfo) {

  //     }
  //     else {

  //       try {
  //         fetch('http://localhost:3000/user/login/' + userInfo.user.email + '/' + userInfo.user.id)
  //           .then((response) => response.json())
  //           .then(async (responseJson) => {
  //             if (responseJson.ok == 'ok') {
  //               const val = responseJson.docs
  //               console.log(val);
  //               await AsyncStorage.setItem('details', JSON.stringify(val))

  //               this.props.navigation.navigate('home', { data: responseJson.docs })

  //             }
  //             else {
  //               alert('Account does not exist')
  //               await GoogleSignin.signOut()
  //             }
  //           })
  //       } catch (e) {

  //       }
  //     };
  //   } catch (error) {
  //     console.log('Message', error.message);
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       console.log('User Cancelled the Login Flow');
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       console.log('Signing In');
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       console.log('Play Services Not Available or Outdated');
  //     } else {
  //       console.log('Some Other Error Happened');
  //     }
  //   }
  // }



  return (
    <Fragment>
      <SafeAreaView
        style={(styles.container, { backgroundColor: '#2ca0df' })}
      />
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={mainColor}
        />
        <ImageBackground
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}
        // source={logi}
        >

          <Text style={{ fontSize: totalSize(3), alignSelf: 'center' }}>
            LOGIN
            </Text>

          <View style={{ height: height(8), width: width(85), marginTop: height(3), justifyContent: 'center', borderWidth: 1, borderColor: '#000', backgroundColor: '#ffffff', alignSelf: 'center' }}>

            <View style={{ width: width(80), flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center' }}>

              <Image style={{ height: 25, width: 25, alignSelf: 'center' }}
                source={mail}
              />

              <TextInput
                placeholder='Email ID'
                placeholderTextColor='#555'
                onChangeText={(email) => setemail(email)}
                style={{ fontSize: totalSize(2.5), width: width(70) }}
              />

            </View>

          </View>

          <View style={{ height: height(8), width: width(85), marginTop: height(3), justifyContent: 'center', borderWidth: 1, borderColor: '#000', backgroundColor: '#ffffff', alignSelf: 'center' }}>

            <View style={{ width: width(80), flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center' }}>

              <Image style={{ height: 25, width: 25, alignSelf: 'center' }}
                source={pass}
              />

              <TextInput
                placeholder='Password'
                placeholderTextColor='#555'
                secureTextEntry
                onChangeText={(password) => setpassword(password)}
                style={{ fontSize: totalSize(2.5), width: width(70) }}
              />

            </View>

          </View>

          <TouchableOpacity
            onPress={() => log()}
            style={{ height: height(7), width: width(60), marginTop: height(3), borderRadius: 50, justifyContent: 'center', alignSelf: 'center', backgroundColor: mainColor }}>
            <Text style={{ fontSize: totalSize(3), alignSelf: 'center', color: '#ffffff' }}>
              Sign in
              </Text>
          </TouchableOpacity>

          {/* <View style={{ marginTop: height(1), alignSelf: 'center', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

              <Text>
                New here?
              </Text>

              <View style={{ width: width(1) }}></View>

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('signup')}
              >
                <Text style={{ color: mainColor }}>
                  Signup
                </Text>
              </TouchableOpacity>
            </View> */}

          <TouchableOpacity
            // onPress={() => this.props.navigation.navigate('fp')}
            style={{ alignSelf: 'center' }}>
            <Text>
              Forgot Password?
                </Text>
          </TouchableOpacity>

          <Text style={{ fontSize: totalSize(2), marginTop: height(2), alignSelf: 'center' }}>
            OR
            </Text>


          <View style={{ width: width(50), marginTop: height(2), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

            {/* <TouchableOpacity
              // onPress={() => this.facebook()}
              style={{ height: 35, width: 35, borderRadius: 17.5, backgroundColor: '#428ff3', justifyContent: 'center' }}
            >
              <Image
                style={{ height: 15, width: 15, alignSelf: 'center' }}
                source={facebook}
              />

            </TouchableOpacity>

            <View style={{ width: width(10) }} />

            <TouchableOpacity
              // onPress={() => this.google()}
              style={{ height: 35, width: 35, borderRadius: 17.5, backgroundColor: '#e2251f', justifyContent: 'center' }}
            >
              <Image
                style={{ height: 20, width: 20, alignSelf: 'center' }}
                source={goole}
              />

            </TouchableOpacity> */}
          </View>

          <Modal
            animationType={'fade'}
            transparent={true}
            visible={loader}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>

              <ActivityIndicator size='large' color='#fff' />

            </View>

          </Modal>

        </ImageBackground>
      </SafeAreaView>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  }
})
