import React, { Component, Fragment, useEffect, useState } from 'react'
import { View, ImageBackground, AppState, Text, TouchableOpacity, TextInput, Image, SafeAreaView, FlatList, StyleSheet, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import messag from '@react-native-firebase/messaging'

import pic from '../../assets/user2.png'

import sign from '../../assets/imageB.jpeg'

import { link } from '../link/link'
import { mainColor } from '../../GlobleColor/GlobleColor'

import AsyncStorage from '@react-native-community/async-storage'

export default function Chat({ navigation, route }) {
  const [name, setname] = useState('')
  const [chat, setchat] = useState([])
  const [chat2, setchat2] = useState([])
  const [message, setmassage] = useState('')
  const [bDisable, setbDisable] = useState(false)
  const [loader, setloader] = useState(true)

  useEffect(() => {
    // console.log(route.params.data)
    open()

    AppState.addEventListener('change', handle)

    messag().onMessage(async remoteMessage => {
      setTimeout(() => {
        open()
        console.log('123');
      }, 500);
    })
    setname(route.params.data.name)

    return (() => {
      console.log('removed')
      AppState.removeEventListener('change', handle)
    })

  }, [])

  const handle = (e) => {
    if (e === 'active') {
      open()
    }
  }

  const open = async () => {

    try {

      let data = route.params.data

      // console.log(data)

      var data2 = {
        vendor: data.vendorId, customer: data.customerid,
      }

      fetch(link + 'chat/getChat', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data2)
      })
        .then((response) => response.json())
        .then((responsejson) => {

          if (responsejson.type == 'success') {
            console.log(responsejson.result[0].messages)
            setchat(responsejson.result[0].messages.reverse())
            setloader(false)
          }

        }).catch((e) => {
          console.log(e)
        })

    } catch (e) {

    }
  }

  const mess = () => {
    try {
      if (message !== '') {

        setbDisable(true)

        let data = route.params.data

        var data2 = {
          vendor: data.vendorId, customer: data.customerid,
          text: message, from: 'vendor',
          
        }

        fetch(link + 'chat/sendMessage', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data2)
        })
          .then((response) => response.json())
          .then((responsejson) => {

            console.log('send massege',responsejson)
            let array = { by: 'vendor', text: message }
            setchat([array, ...chat])
            setmassage('')
            setbDisable(false)

          }).catch((e) => {
            setbDisable(false)
            Alert.alert(
              'Network',
              'Network failed'
            )
          })
      }
      else {
        Alert.alert(
          'Message',
          'Please type something'
        )
      }

    } catch (e) {
      console.log(e)
    }

  }

  const _Flatlist = ({ item }) => {
    return (
      <View style={{ width: width(90), alignSelf: 'center' }}>

        {item.by == 'customer' ?

          <View style={{ marginTop: height(1.5), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

            <View style={{ padding: 10, borderRadius: 20, backgroundColor: '#6f6e6c', justifyContent: 'center', alignItems: 'center' }}>

              <Image style={{ height: 20, width: 20 }} source={pic} />

            </View>

            <View style={{ maxWidth: width(55), padding: 10, marginLeft: width(5), backgroundColor: '#d2d5cb', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>

              <Text style={{ fontSize: totalSize(1.9) }}>
                {item.text}
              </Text>
            </View>

          </View>

          : item.by == 'vendor' ?
            <View style={{ marginTop: height(1.5), flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>


              <View style={{ maxWidth: width(55), padding: 10, marginRight: width(5), backgroundColor: '#d2d5cb', borderRadius: 10 }}>

                <Text style={{ fontSize: totalSize(1.9) }}>
                  {item.text}
                </Text>
              </View>


              <View style={{ padding: 10, borderRadius: 20, backgroundColor: '#6f6e6c', justifyContent: 'center', alignItems: 'center' }}>

                <Image style={{ height: 20, width: 20 }} source={pic} />

              </View>

            </View>
            : null}

      </View>
    )
  }

  return (
    <Fragment>

      <SafeAreaView style={styles.container, { backgroundColor: '#fff' }} />

      <SafeAreaView style={{ flex: 1 }}>

        <ImageBackground
          // source={sign}
          style={{ flex: 1, backgroundColor: '#fff' }}>

          <View style={{ height: height(10) }}>

            <View style={{ height: height(10), width: width(100), position: 'absolute', zIndex: 1, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, backgroundColor: mainColor }}>

              <View style={{ marginTop: height(5), width: width(95), flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center' }}>

                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                >

                  <MaterialIcons name='arrow-back' size={30} color='#ffffff' />
                </TouchableOpacity>

                <TouchableOpacity
                >

                  <Text style={{ fontSize: totalSize(2.5), fontWeight: 'bold', color: '#ffffff' }}>
                    {name}
                  </Text>

                </TouchableOpacity>

                <View style={{ height: 30, width: 30 }}>

                </View>

              </View>

            </View>

          </View>

          {loader == true ?

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

              <ActivityIndicator size='large' color={mainColor} />

            </View>

            :

            <FlatList
              style={{ marginBottom: height(2) }}
              data={chat}
              keyExtractor={(item, index) => { return index.toString() }}
              renderItem={_Flatlist}
              inverted
            />

          }

          <View style={{ height: height(7), backgroundColor: '#00000020', justifyContent: 'center', alignItems: 'center' }}>

            <View style={{ width: width(90), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

              <TextInput
                placeholder='Say something'
                onChangeText={(text) => setmassage(text)}
                value={message}
                style={{ width: width(80) }}
              />

              <TouchableOpacity
                disabled={bDisable}
                onPress={() => mess()}
                style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}
              >
                <MaterialIcons name='arrow-forward' size={20} />

              </TouchableOpacity>

            </View>

          </View>

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
