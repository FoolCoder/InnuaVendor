import React, { Fragment, useState, useEffect, useRef, useContext } from 'react'
import {
    View,  PermissionsAndroid,
    Image,LogBox,
    TouchableOpacity,StyleSheet, Alert,
} from 'react-native'
import { height, width, totalSize } from 'react-native-dimension'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

import Geolocation from 'react-native-geolocation-service';

import AsyncStorage from '@react-native-community/async-storage'
import point from '../../assets/point.png'
import { link } from '../link/link'

const apikey = 'AIzaSyA-_ESKOszOV6bSzAqb6frFWMZqnLeQj1U'
export default function Map({ navigation }) {
    const [region, setregion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 100,
        longitudeDelta: 100,
    })
    const [cord, setcord] = useState({
        lat: 0,
        lng: 0
    })
    const [address, setAddress] = useState('')
    const map = useRef(null)
    useEffect(() => {
    Geocoder.init(apikey)

    setTimeout(() => {
        open()
    }, 3000);
setInterval(() => {
    location()
    open()
}, 50000);
        
       
    }, []);
    const _Geocoding = (lat, lon) => {

        Geocoder.from(lat, lon)
            .then(json => {
                var addressComponent = json.results[0].address_components[0];
                console.log(addressComponent);
                setAddress(addressComponent.long_name)
                console.log(address);
            })
            .catch(error => console.warn(error));

    }
    const location = async () => {

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition((pos) => {

                // setspeed((pos.coords.speed * 3.6).toFixed(0))

                map.current.animateToRegion({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    // nameee: pos.coords.heading,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,

                }, 1500)
                setcord({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                console.log(cord);
                _Geocoding(pos.coords.latitude, pos.coords.longitude)
            }, (err) => {
                console.log(err);
                alert("turn on current location")
            })

        }
        else {
            console.log("Location permission denied");
        }


    }
    const open = async () => {
        console.log('rrrrrrrrrrrrrrrrrrrr', cord, address);
        try {


            const val = JSON.parse(await AsyncStorage.getItem('details'))

            fetch(link + 'vendor/updateVendorMap?vendorId=' + val.id, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lat: cord.lat,
                    long: cord.lng,
                    address: address
                })
            }).then((response) => response.json())
                .then((json) => {
                    console.log(json);
                    if(json.type== "success")
                    {
                        Alert.alert(
                            'Location Update',
                            'Your Location Updated Successfully'
                        )
                    }
                })
        } catch (error) {
            console.log(error);
        }

    }
    return (
        <View style={styles.container}>


            <MapView style={styles.maps}
                ref={map}
                region={region}
                onRegionChangeComplete={region => setregion(region)}
                onMapReady={async () => {
                   await location()
                }}
            // customMapStyle={mapStyle}
            >
                {/* <Marker
                    coordinate={{ latitude: 30.3753, longitude: 69.3451 }}

                >
                </Marker> */}
                {

                    cord == null ? null :

                        <Marker
                            coordinate={{
                                latitude: cord.lat,
                                longitude: cord.lng
                            }}
                            

                        >
                            <Image source={point}  
                            style={{
                                height: 31, width: 30 ,resizeMode:'contain'
                            }}
                            />
                            </Marker>
                }

            </MapView>
            <TouchableOpacity style={{
                position: 'absolute',
                zIndex: 1,
                top: '85%',
                width: 50,
                right: 20,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                height: 45

            }}
                onPress={ () => {

                   location()
                    open()
                }}
            >
                <MaterialIcons name='my-location' color='grey' size={35} />

            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    maps: {
        height: height(100),
        width: width(100)


    }
})