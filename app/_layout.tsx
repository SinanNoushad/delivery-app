import { StatusBar, View, Text, StyleSheet, SafeAreaView,Image,KeyboardAvoidingView, Platform } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import React, { useEffect, useState, useRef,useMemo } from 'react';
import { getDirections } from '../Utils/getDirections';
import PlacesSearch from '@/components/PlacesSearch';
import 'react-native-get-random-values';
import {useGetCurrentLocation} from '../Utils/getCurrentLocation';
import DirectionRoute from '../components/DirectionRoute';


interface LatLng {
  latitude: number;
  longitude: number;
}



export default function RootLayout() {  
  const [coordinates, setCoordinates] = useState([]);
  const mapRef = useRef<MapView>(null);
  const [selectedPlace,setSelectedPlace] = useState<LatLng | null>();
  const [selectedPlaceName,setSelectedPlaceName] = useState<string | null>();
  const { currentLatLng } = useGetCurrentLocation();
  const [isDirectionRouteVisible, setIsDirectionRouteVisible] = useState(false);
  const [isSearchBarClear, setIsSearchBarClear] = useState(false);

const currentLatLngMemo = useMemo(() => {
  if (!currentLatLng) return null;
  return {
    latitude: currentLatLng.latitude,
    longitude: currentLatLng.longitude,
  };
}, [currentLatLng]);


  useEffect(() => {
    if (!selectedPlace) return;
    getDirections(currentLatLngMemo, selectedPlace)
      .then((coordinates: any) => setCoordinates(coordinates))
      .catch((error: any) => console.error(error));
  }, [selectedPlace, currentLatLngMemo]);
  

useEffect(() => {
  if (
    currentLatLngMemo &&
    typeof currentLatLngMemo.latitude === 'number' &&
    typeof currentLatLngMemo.longitude === 'number'
  ) {
    mapRef.current?.animateToRegion({
      latitude: currentLatLngMemo.latitude,
      longitude: currentLatLngMemo.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0
    });
  }

  if (
    selectedPlace &&
    typeof selectedPlace.latitude === 'number' &&
    typeof selectedPlace.longitude === 'number' && !isSearchBarClear
  ) {
    mapRef.current?.animateToRegion({
      latitude: selectedPlace.latitude,
      longitude: selectedPlace.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0
    }, 3000);
  }
}, [selectedPlace, isSearchBarClear]);

console.log("isDirectionRouteVisible:",isDirectionRouteVisible);
console.log("isSearchBarClear:",isSearchBarClear);
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -(StatusBar.currentHeight || 0)}
    >
      <View style={{ flex: 1}}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <SafeAreaView style={styles.searchContainer}>
            <PlacesSearch
              setSelectedPlace={setSelectedPlace}
              setSelectedPlaceName={setSelectedPlaceName}
              setIsDirectionRouteVisible={setIsDirectionRouteVisible}
              setIsSearchBarClear={setIsSearchBarClear}
            />
          </SafeAreaView>
          
          <View style={styles.mapContainer}>
            <MapView 
              style={styles.map} 
              ref={mapRef}
            >
              {coordinates.length > 1 && selectedPlace && isDirectionRouteVisible && (
                <Polyline
                  coordinates={coordinates}
                  strokeColor="blue"
                  strokeWidth={5}
                />
              )}

              {!isSearchBarClear && selectedPlace && (
                <Marker
                  coordinate={selectedPlace}
                  title="Selected Place"
                  pinColor='green'
                />
              )
              }

              {currentLatLng && typeof currentLatLng.latitude === 'number' && typeof currentLatLng.longitude === 'number' && (
                <Marker
                  coordinate={{
                    latitude: currentLatLng.latitude,
                    longitude: currentLatLng.longitude
                  }}
                  title="Current Location"
                >
                  <Image
                    source={require('../assets/images/Marker/LiveLocationDot.png')}
                    style={{ width: 20, height: 20 }}
                  />
                  </Marker>
              )}

            </MapView>
            <View style={styles.locationDisplay}>
              <View style={styles.locationDisplayIndicator}>
                </View>
            </View>
          </View>
          {selectedPlace && !isSearchBarClear && (
            <DirectionRoute  selectedPlaceName={selectedPlaceName ?? ''}  isDirectionRouteVisible={isDirectionRouteVisible}  setIsDirectionRouteVisible={setIsDirectionRouteVisible}/>  
          )}   
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100, 
    zIndex: 10, 
  },
  mapContainer: {
    flex: 1,
    zIndex: 1,
  },
  map: {
    flex: 1,
  },
  locationDisplay: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width:50,
    height:50,
    borderRadius: 100,
  },
  locationDisplayIndicator: {
    backgroundColor: 'blue',
    width: 20,
    height: 20,
    borderRadius: 100,
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 999,
  },
});
