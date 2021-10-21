import React, { Fragment, useState, useEffect,useContext } from 'react'
import { View, SafeAreaView, ScrollView, Text, TextInput,AppState, TouchableOpacity, FlatList, Alert,StatusBar, StyleSheet,ActivityIndicator } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'
import {useFocusEffect} from '@react-navigation/native'

import message from '@react-native-firebase/messaging'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import AsyncStorage from '@react-native-community/async-storage'

import moment from 'moment-timezone'

import {Authcontext} from '../context/context'
import {link} from '../link/link'
import { mainColor } from '../../GlobleColor/GlobleColor'

export default function Orders({navigation}) {

  const [orderlist, setorderlist] = useState([])
  const [loader,setloader]=useState(true)
    
    const { logout } = useContext(Authcontext)

    useFocusEffect(
      React.useCallback(() => {
        open()
        return () => true;
       }, [])
    );

    useEffect(()=>{
      AppState.addEventListener('change',handle)

      message().onMessage(async remoteMessage => {
        console.log('remote  mmmmee'+remoteMessage);
          setTimeout(() => {
            open()
            console.log('123');
          }, 500);
        })
        return(()=>{
          console.log('removed')
          AppState.removeEventListener('change',handle)
        })
    },[])

    const handle = (e) => {
      if (e === 'active') {
        open()
      }
    }
   

    const open=async()=>{

      const val = JSON.parse(await AsyncStorage.getItem('details'))

      fetch(link + 'order/getOrdersByVendor?vendorId=' + val.id)
        .then((response) => response.json())
        .then(async (responseJson) => {
        //  console.log(responseJson.result)
          const val=responseJson.result

          const val2= val.map(e=>{
            e.updatedAt=moment(e.updatedAt).format('DD-MMM-YYYY hh:mm a').toUpperCase()
            return e
          })
          // console.log(val2)

          setorderlist(val2)
          setloader(false)
          
        })

    }

    const authlogout = async () => {

      try{

      const val = JSON.parse(await AsyncStorage.getItem('details'))

      fetch(link + 'vendor/onLogout?vendorId=' + val.id)

      }catch(e){

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


  const status = (item) => {
    if (item == 'accepted') {
      return (

        <MaterialIcons name='access-time' size={25} color='#5d5e00' />

      )
    }
    else if (item == 'delivered') {
      return (
        <MaterialIcons name='check-circle' size={25} color='#2ba300' />
      )
    }
    else if (item == 'requested') {
      return (
        <MaterialCommunityIcons name='calendar-question' size={25} color='#0300a3' />
      )
    }

  }

  const _Flatlist = ({ item }) => {
    return (

      <View style={{
        height: height(12), shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2, width: width(95), marginVertical: height(1), alignSelf: 'center', borderRadius: 5, backgroundColor: '#fff'
      }}>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

          <View style={{ width: width(90), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

            <View style={{flexDirection:'row',alignItems:'center'}}>

              <Text style={{ fontSize: totalSize(1.7), fontWeight: 'bold' }}>
              Order id : 
              
            </Text>

            <Text style={{fontSize:totalSize(1.7),margin:width(1)}}>

                {item._id}
                
                </Text>
            
            </View>
            

            <View style={{ width: width(17), alignItems: 'center' }}>

              {status(item.orderStatus)}

            </View>

          </View>

          <View style={{ width: width(90), marginTop: height(1), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

            <View>

              <Text
                style={{ fontSize: totalSize(1.5) }}>
                Total Price : £{item.total.toFixed(2)}
              </Text>

              <Text style={{ fontSize: totalSize(1.5) }}>
                {item.updatedAt}
              </Text>

            </View>

            <TouchableOpacity
            onPress={()=>navigation.navigate('vorder',{
              data:item
            })}
              style={{ height: height(4), width: width(17), justifyContent: 'center', alignItems: 'center', backgroundColor: mainColor }}
            >

              <Text style={{ fontSize: totalSize(1.5), color: '#fff' }}>
                View
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </View>
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

            <TouchableOpacity
              onPress={()=>{open()
       
              }}
                style={{ height: 30, width: 70,justifyContent:'center',alignItems:'flex-start' }}>

                <Text style={{ fontSize: totalSize(2.1), color: '#ffffff' }}>
                  Refresh
                    </Text>

              </TouchableOpacity>

              <View
              >

                <Text style={{ fontSize: totalSize(2.5), fontWeight: 'bold', color: '#ffffff' }}>
                  Orders
                    </Text>

              </View>

              <TouchableOpacity
              onPress={()=>authlogout()}
                style={{ height: 30, width: 70,justifyContent:'center',alignItems:'flex-end' }}>

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
            data={orderlist}
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