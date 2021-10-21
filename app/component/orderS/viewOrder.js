import React, { Fragment, useState, useEffect } from 'react'
import { View, SafeAreaView, Image, ScrollView, Text, TextInput, ActivityIndicator, Modal, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import DropDownPicker from 'react-native-dropdown-picker';

import { link } from '../link/link'
import { mainColor } from '../../GlobleColor/GlobleColor'

export default function Vieworder({ navigation, route }) {

  const [orderid, setorderid] = useState('')
  const [items, setitems] = useState([])
  const [total, settotal] = useState(0)
  const [status, setstatus] = useState('')
  const [orderStatus, setordreStatus] = useState('')
  const [time, settime] = useState(0)

  const [loader, setloader] = useState(false)

  useEffect(() => {

    try {

      setorderid(route.params.data._id)
      setitems(route.params.data.items)
      settotal(route.params.data.total)
      setordreStatus(route.params.data.orderStatus)
      if (route.params.data.paid == true) {
        setstatus('PAID')
      }
      else {
        setstatus('UNPAID')
      }

    } catch (e) {

    }

  }, [])


  const sendNotification = () => {
    try {

      if (time >= 5) {

        fetch(link + 'notification/sendTimeNotification?minutes=' + time + '&orderId=' + orderid)
          .then((response) => response.json())
          .then(async (responseJson) => {

            console.log(responseJson)

          })

      }
      else {
        Alert.alert(
          'Notification',
          'Please select time first'
        )
      }

    } catch (e) {

    }
  }

  const deliver = () => {
    try {

      setloader(true)

      fetch(link + 'order/orderDelivered?orderId=' + orderid, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then(async (responseJson) => {

          if (responseJson.type == 'success') {
            Alert.alert(
              'Order',
              'Order delivered'
            )
            setloader(false)
            setordreStatus('delivered')
          }
          else {
            setloader(false)
          }

        }).catch((e) => {
          setloader(false)
          console.log(e)
        })

    } catch (e) {
      setloader(false)
      console.log(e)
    }

  }

  const responseOF = (item) => {

    try {

      setloader(true)

      fetch(link + 'notification/actionOnOrder?orderId=' + orderid + '&action=' + item)
        .then((response) => response.json())
        .then(async (responseJson) => {

          console.log(responseJson)

          if (responseJson.type == 'success') {
            navigation.goBack()
          }
          else {
            setloader(false)
          }

        }).catch((e) => {
          setloader(false)
          console.log(e)
        })

    } catch (e) {
      setloader(false)
      console.log(e)
    }
  }


  const _Flatlist = ({ item }) => {
    return (
      <View style={{ height: height(12), width: width(90), margin: 10, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', alignSelf: 'center', backgroundColor: '#e8e8e8', borderRadius: 15 }}>

        <Image
          style={{ height: 70, borderColor: '#000', width: 80, borderRadius: 10, resizeMode: 'contain' }}
          source={{ uri: link + item.item.image }}
        />

        <View style={{ width: width(35), marginStart: width(2) }}>

          <Text style={{ fontSize: totalSize(2.5), fontWeight: 'bold', color: '#000' }}>
            {item.item.name}
          </Text>

          <Text style={{ fontSize: totalSize(2.5), color: '#000' }}>
            £{(item.item.price * (1 - (item.item.discount / 100))).toFixed(2)}
          </Text>

        </View>

        <View style={{ width: width(22) }}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

            <View style={{ width: width(23), flexDirection: 'row', alignItems: 'center' }}>

              <Text style={{ fontSize: totalSize(2), color: '#000' }}>
                Quantity
              </Text>

              <View style={{ width: width(7), alignItems: 'center' }}>

                <Text style={{ fontSize: totalSize(2), color: '#000' }}>
                  {item.quantity}
                </Text>

              </View>


            </View>

          </View>

        </View>

      </View>
    )
  }

  const condition = () => {

    if (orderStatus == 'delivered') {
      return (
        <Text style={{ marginTop: height(3), fontSize: totalSize(2.5), fontWeight: 'bold', alignSelf: 'center' }}>

          Order has been delivered

        </Text>
      )
    }
    else if (orderStatus == 'accepted') {
      return (
        <View style={{ marginTop: height(4), alignItems: 'center' }}>

          <DropDownPicker
            items={[
              { label: '5 Minutes', value: 5 },
              { label: '10 Minutes', value: 10 },
              { label: '20 Minutes', value: 20 },
              { label: '30 Minutes', value: 30 },
              { label: '40 Minutes', value: 40 },
              { label: '50 Minutes', value: 50 },
            ]}
            containerStyle={{ height: height(5), width: width(45) }}
            style={{ backgroundColor: '#fafafa' }}
            itemStyle={{
              justifyContent: 'flex-start'
            }}
            dropDownStyle={{ backgroundColor: '#fafafa' }}
            onChangeItem={item => settime(item.value)}
          />

          <TouchableOpacity
            onPress={() => sendNotification()}
            style={{ height: height(5), width: width(45), marginTop: height(3), borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>

            <Text style={{ fontSize: totalSize(2), color: '#000' }}>
              Send Time
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => deliver()}
            style={{ height: height(5), width: width(45), marginTop: height(3), borderRadius: 10, backgroundColor: mainColor, justifyContent: 'center', alignItems: 'center' }}>

            <Text style={{ fontSize: totalSize(2), color: '#fff' }}>
              Order Complete
            </Text>

          </TouchableOpacity>

        </View>
      )
    }
    else if (orderStatus == 'requested') {
      return (

        <View style={{ marginTop: height(4), width: width(75), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

          <TouchableOpacity
            onPress={() => responseOF('Accepted')}
            style={{ height: height(5), width: width(35), borderRadius: 10, backgroundColor: '#178517', justifyContent: 'center', alignItems: 'center' }}>

            <Text style={{ fontSize: totalSize(2), color: '#fff' }}>
              Accept
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => responseOF('Rejected')}
            style={{ height: height(5), width: width(35), borderRadius: 10, backgroundColor: '#8a0c0c', justifyContent: 'center', alignItems: 'center' }}>

            <Text style={{ fontSize: totalSize(2), color: '#fff' }}>
              Reject
            </Text>

          </TouchableOpacity>

        </View>
      )
    }
  }


  return (
    <Fragment>

      <SafeAreaView style={styles.container, { backgroundColor: '#fff' }} />

      <SafeAreaView style={styles.container}>

        <View style={{ flex: 1 }}>

          <View style={{ height: height(10), width: '100%', borderBottomRightRadius: 10, borderBottomLeftRadius: 10, backgroundColor: mainColor }}>

            <View style={{ marginTop: height(5), width: '95%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center' }}>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
              >

                <MaterialIcons name='arrow-back' size={30} color='#ffffff' />

              </TouchableOpacity>

              <Text style={{ fontSize: totalSize(2.5), fontWeight: 'bold', color: '#ffffff' }}>
                View Order
                    </Text>

              <View style={{ height: 30, width: 30 }}>

              </View>

            </View>

          </View>


          <Text style={{ fontSize: totalSize(2), marginTop: height(2), alignSelf: 'center' }}>

            Order ID : {orderid}

          </Text>

          <FlatList
            data={items}
            keyExtractor={(item, index) => { return index.toString() }}
            style={{ maxHeight: height(30), flexGrow: 0, width: width(95), marginTop: height(2), alignSelf: 'center', backgroundColor: mainColor, borderRadius: 10 }}
            renderItem={_Flatlist}
          />


          <View style={{
            height: height(15), shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.20,
            shadowRadius: 1.41,

            elevation: 2, width: width(95), marginTop: height(2), alignSelf: 'center', justifyContent: 'center', backgroundColor: mainColor, borderRadius: 10
          }}>

            <View style={{ width: width(90), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

              <Text style={{ fontSize: totalSize(1.7), color: '#fff' }}>
                Status
                </Text>

              <Text style={{ fontSize: totalSize(1.7), color: '#fff' }}>
                {status}
              </Text>

            </View>

            <View style={{ width: width(90), marginTop: height(2), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

              <Text style={{ fontSize: totalSize(1.7), color: '#fff' }}>
                Sub total
                </Text>

              <Text style={{ fontSize: totalSize(1.7), color: '#fff' }}>
                £{total.toFixed(2)}
              </Text>

            </View>

            <View style={{ width: width(90), marginTop: height(2), alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

              <Text style={{ fontSize: totalSize(1.7), color: '#fff' }}>
                total
                </Text>

              <Text style={{ fontSize: totalSize(1.7), color: '#fff' }}>
                £{total.toFixed(2)}
              </Text>

            </View>

          </View>

          {condition()}

          <Modal
            animationType='fade'
            visible={loader}
            transparent={true}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>

              <ActivityIndicator size='large' color='#fff' />

            </View>

          </Modal>

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