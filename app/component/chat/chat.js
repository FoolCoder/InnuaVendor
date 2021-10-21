import React, { Fragment, useState, useEffect, useContext } from 'react'
import { View, SafeAreaView, ScrollView, Text, TextInput, AppState, TouchableOpacity, FlatList, Alert, StatusBar, StyleSheet, ActivityIndicator } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'
import { useFocusEffect } from '@react-navigation/native'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import messag from '@react-native-firebase/messaging'

import moment from 'moment-timezone'

import AsyncStorage from '@react-native-community/async-storage'

import { Authcontext } from '../context/context'
import { link } from '../link/link'
import { mainColor } from '../../GlobleColor/GlobleColor'

export default function Chat({ navigation }) {

  const [chatlist, setchatlist] = useState([])
  const [loader, setloader] = useState(true)

  const { logout } = useContext(Authcontext)

  const authlogout = async () => {

    try {

      const val = JSON.parse(await AsyncStorage.getItem('details'))

      fetch(link + 'vendor/onLogout?vendorId=' + val.id)

    } catch (e) {

      console.log(e)

    }

    await AsyncStorage.removeItem('details')
    await AsyncStorage.setItem('IsSignedIn', 'false').then(() => {
      logout()
    })
    Alert.alert(
      'Innuaa',
      'Logout Successfully'
    )
  }

  useFocusEffect(
    React.useCallback(() => {
      open()
      // console.log('456');
      return () => true;
    }, [])
  );

  useEffect(() => {

    AppState.addEventListener('change', handle)
    // open()
    messag().onMessage(async remoteMessage => {
      setTimeout(() => {
        open()
        // console.log('123');
      }, 500);
    })
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

      let val = JSON.parse(await AsyncStorage.getItem('details'))
      let data = { vendorId: val.id }

      fetch(link + 'chat/getAllChats', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then((response) => response.json())
        .then((responsejson) => {

          if (responsejson.type == 'success') {
            console.log('getting chat;',responsejson)
            let item = responsejson.result.map(e => {
              return {
                name: e.customer.name,
                customerid: e.customer._id,
                vendorId: e.vendor,
                time: moment(e.updatedAt).format('DD-MMM-YY hh:mm').toUpperCase(),
                message: e.messages[e.messages.length - 1].text
              }
            })
            setchatlist(item)
            setloader(false)
          }

        }).catch((e) => {
          console.log(e)
        })

    } catch (e) {
      console.log(e)
    }

  }


  const _Flatlist = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('pchat', { data: item })}
        style={{ height: height(10), width: '100%', borderBottomWidth: 0.5, justifyContent: 'center' }}>

        <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>

          <View style={{ width: '65%' }}>

            <Text
              numberOfLines={1}
              style={{ fontSize: totalSize(2.5) }}>
              {item.name}
            </Text>

            <Text
              numberOfLines={1}
              style={{ fontSize: totalSize(2), color: '#000', marginTop: height(1) }}>
              {item.message}
            </Text>

          </View>

          <Text style={{ fontSize: totalSize(2), color: '#000' }}>
            {item.time}
          </Text>

        </View>

      </TouchableOpacity>
    )
  }

  return (
    
    <Fragment>

      <SafeAreaView style={styles.container, { backgroundColor: '#fff' }} />

      <SafeAreaView style={styles.container}>

        <StatusBar
          backgroundColor={mainColor}
        />

        <View style={{ flex: 1 }}>

          <View style={{ height: height(10), width: '100%', borderBottomRightRadius: 10, borderBottomLeftRadius: 10, backgroundColor: mainColor }}>

            <View style={{ marginTop: height(5), width: '95%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center' }}>

              <View style={{ width: 70 }} />

              <View
              >

                <Text style={{ fontSize: totalSize(2.5), fontWeight: 'bold', color: '#ffffff' }}>
                  Chat
                    </Text>

              </View>

              <TouchableOpacity
                onPress={() => authlogout()}
                style={{ height: 30, width: 70, justifyContent: 'center', alignItems: 'flex-end' }}>

                <Text style={{ fontSize: totalSize(2.2), color: '#ffffff' }}>
                  Logout
                    </Text>

              </TouchableOpacity>

            </View>

          </View>
          {loader == true ?

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

              <ActivityIndicator size='large' color={mainColor} />

            </View>

            :

            <FlatList
              data={chatlist}
              style={{ flexGrow: 0 }}
              keyExtractor={(item, index) => { return index.toString() }}
              renderItem={_Flatlist}
            />

          }

        </View>


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