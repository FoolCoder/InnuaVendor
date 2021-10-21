import React, { Fragment, useState, useEffect } from 'react'
import { View, ImageBackground, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, FlatList, StatusBar, Alert, StyleSheet } from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'

import { mainColor } from '../../GlobleColor/GlobleColor'

import splas from '../../assets/innuasplash.jpeg'

export default function Splash() {


  return (
    <Fragment>

      <SafeAreaView style={styles.container, { backgroundColor: '#fff' }} />

      <SafeAreaView style={styles.container}>

        <StatusBar
          backgroundColor={mainColor}
        />

        <ImageBackground
          source={splas}
          style={{ flex: 1 }} />

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