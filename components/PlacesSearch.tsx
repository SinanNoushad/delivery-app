import React, { useEffect, useRef, useState } from 'react';
import { View,Image,StyleSheet,TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';

const PlacesSearch = (
    {setSelectedPlace,setSelectedPlaceName,setIsDirectionRouteVisible,setIsSearchBarClear }: 
    {setSelectedPlace: any,setSelectedPlaceName: any,setIsDirectionRouteVisible: React.Dispatch<React.SetStateAction<boolean>> ,setIsSearchBarClear: React.Dispatch<React.SetStateAction<boolean>>}) => {
  
  const ref = useRef<GooglePlacesAutocompleteRef | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [, forceUpdate] = useState(0);
  

  const triggerRerender = () => {
  forceUpdate(prev => prev + 1);
};

  const handleSelectedPlaceName = (data: any) => {
    const placeName = data.description.split(',')[0];
    setSelectedPlaceName(placeName);
  };

  const handleSelectedPlace = (details: any) => {
    if (!details || !details.geometry || !details.geometry.location) {
      console.log('Invalid place details');
      return;
    }

    const LatLng = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    };
    setSelectedPlace(LatLng);
    setIsDirectionRouteVisible(false)
    setIsSearchBarClear(false);
    console.log("LatLng:",LatLng);
    
    setTimeout(() => {
      setInputValue('');
      ref.current?.clear();
      triggerRerender();
    }, 100);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.clearButton} 
        onPress={() => {
          setInputValue('');
          ref.current?.setAddressText('');
          triggerRerender();
          setIsSearchBarClear(true)
          setIsDirectionRouteVisible(false)
        }}
      >
        <Image 
        source={require('../assets/images/SearchClear.png')}
        style={{width:30,height:30,left:10,top:10,tintColor:'gray'}}
        />
      </TouchableOpacity>
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder="Search for a place"
        fetchDetails={true}
        textInputProps={{
          value: inputValue,
          onChangeText: setInputValue,
          autoCapitalize: 'none',
          autoCorrect: false,
          autoFocus: false,
          returnKeyType: 'search',
          clearButtonMode: 'while-editing',
          onFocus: () => {
            console.log('Input focused');
          },
          onBlur: () => {
            console.log('Input blurred');
          },
        }}
        onPress={(data, details = null) => {
          // console.log("Data:",data);
          // console.log("Details:",details);
          if (details) {
            handleSelectedPlace(details);            
          }
          if(data){
            handleSelectedPlaceName(data);
          }
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          language: 'en',
          components: 'country:in',
          sessiontoken: undefined,
          radius: 300000,
          strictbounds: false,
          location: '10.850516,76.271080',
        }}
        predefinedPlaces={[]}
        enablePoweredByContainer={false}
        minLength={2}
        debounce={200}
        timeout={20000}
        keepResultsAfterBlur={true}
        suppressDefaultStyles={false}
        listEmptyComponent={() => null}
        onFail={(error) => {
          console.error('GooglePlacesAutocomplete Error:', error);
        }}
        onNotFound={() => {
          console.log('No results found');
        }}
        onTimeout={() => {
          console.log('Request timeout');
        }}
        styles={{
          container: {
            flex: 1,
            position: 'relative',
            zIndex: 1,
          },
          textInput: {
            backgroundColor: '#f0ececff',
            height: 50,
            borderRadius: 5,
            paddingHorizontal: 10,
            fontSize: 16,
            borderWidth: 1,
            borderColor: '#ddd',
          },
          listView: {
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#ddd',
            borderTopWidth: 0,
            position: 'absolute',
            top: 50,
            left: 0,
            right: 0,
            zIndex: 2,
            elevation: 5,
            maxHeight: 300,
          },
          row: {
            backgroundColor: 'white',
            padding: 13,
            minHeight: 44,
            flexDirection: 'row',
          },
          separator: {
            height: 0.5,
            backgroundColor: '#c8c7cc',
          },
          poweredContainer: {
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderColor: '#c8c7cc',
            borderTopWidth: 0.5,
          },
        }}
      />
    </View>
  );
};

export default PlacesSearch;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  clearButton:{
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 999,
    width: 50,
    height: 50,
    backgroundColor: '#f0ececff',
  }
})