import React, { useEffect, useMemo, useState } from 'react'
import { View ,Text} from 'react-native'

import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import {Badge} from 'react-native-elements'
import Splash from '../splash/splash'
import login from '../login/login'
import orders from '../orderS/orderS'
import viewOrder from '../orderS/viewOrder'
import Chatt from '../chat/chat'
import pchat from '../chat/personalchat'
import mapScreen from '../map/map'
import { Authcontext } from '../context/context'
import AsyncStorage from '@react-native-community/async-storage'


import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { color } from 'react-native-elements/dist/helpers'
import { link } from '../link/link'

let chatflag
const first = createStackNavigator()
const tab = createBottomTabNavigator()

const Log = () => {
  return (
    <first.Navigator headerMode='none'>
      <first.Screen name='login' component={login} />
    </first.Navigator>
  )
}

const Chat = () => {
  return (
    <first.Navigator headerMode='none'>
      <first.Screen name='tabs' component={Tabs} />
      <first.Screen name='vorder' component={viewOrder} />
      <first.Screen name='pchat' component={pchat} />
    </first.Navigator>
  )
}

const Tabs = () => {
  return (
    <tab.Navigator initialRouteName='Order'
      tabBarOptions={{
        activeTintColor: '#000',
        inactiveTintColor: '#aaa',
      }}
    >
      <tab.Screen name='Order' component={orders}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name='fastfood' size={20} color={color} />
          ),
        
          
        }}
      />
      <tab.Screen name='Chat' component={Chatt}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name='chat' size={20} color={color} />
          ),
          tabBarBadge:(
            chatflag ?
       <Badge status='error'/>
           :
        null
       
       
          ),
        }}
          listeners={({ navigation, route }) =>({
            tabPress:async()=>{
             sendingflag()

            }
          })}

       
      />
      <tab.Screen name='Map' component={mapScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name='map' size={20} color={color} />
          )
        }}
      />
    </tab.Navigator>
  )
}
const sendingflag=async()=>{
  chatflag=false
  console.log('Chat press triggred',chatflag);
  const vendordetail= JSON.parse(await AsyncStorage.getItem('details'))
let data={chatflag}
  try {
      
    
    fetch(link + 'vendor/postVendorMessage?vendorId='+vendordetail.id,{
      method:'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type':'application/json'
    },
    body:JSON.stringify(data)
    })
    .then((response)=>response.json())
    .then((json)=>{
     console.log(json);
    })
  } catch (error) {
      alert(error)
  }


}

export default function Navigation() {
  const [IsSplash, setIsSplash] = useState(true)
  const [IsSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
   
  
    open()
    vendordetails()
    
  }, [])

  const vendordetails=async()=>{
    console.log('this is VD');
    const vendordetail= JSON.parse(await AsyncStorage.getItem('details'))
data={chatflag}
    try {
      
    
    fetch(link + 'vendor/getVendorMessage?vendorId='+vendordetail.id,{
      method:'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type':'application/json'
    }
    })
    .then((response)=>response.json())
    .then(async(json)=>{
     if(json.result==true){
  
 chatflag=json.result
 console.log('chatflag',chatflag);
 
     }
     else{
chatflag=json.result
     }
    })
  } catch (error) {
      alert(error)
  }

  }
  const open = async () => {

    const val = await AsyncStorage.getItem('IsSignedIn')

    setTimeout(() => {

      if (val == 'true') {
        setIsSignedIn(true)
      }
      else {
        setIsSignedIn(false)
      }
      setIsSplash(false)
    }, 3000);

  }

  const auth = useMemo(() => ({
    login: () => {
      setIsSignedIn(true)
    },
    logout: () => {
      setIsSignedIn(false)
    }
  }), [])

  if (IsSplash) {
    return (
      <Splash />
    )
  }
  else {

    return (

      <Authcontext.Provider value={auth}>

        <NavigationContainer>

          {
            !IsSignedIn ? (
              <Log />
            ) : (
                <Chat />
              )
          }

        </NavigationContainer>

      </Authcontext.Provider>
    )
  }

}