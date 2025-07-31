import React from "react";
import { View, Text, StyleSheet,Image, TouchableOpacity } from "react-native";

export default function DirectionRoute({selectedPlaceName ,isDirectionRouteVisible, setIsDirectionRouteVisible}: {selectedPlaceName: string, isDirectionRouteVisible: boolean ,setIsDirectionRouteVisible: React.Dispatch<React.SetStateAction<boolean>>}) {
    return (
        <View style={styles.container}>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={styles.text}>{selectedPlaceName}</Text>
            <TouchableOpacity style={{alignSelf: "center",backgroundColor: "white",padding: 5,borderRadius: 100}}
                onPress={() => {
                    setIsDirectionRouteVisible(false)
                }}
            >
                <Image 
                source={require("../assets/images/close.png")} 
                style={{width: 25, height: 25, tintColor: "gray"}}
                />
            </TouchableOpacity>
            </View>
            { !isDirectionRouteVisible && (
                <View>
                <TouchableOpacity style={styles.directionButton}
                    onPress={() => {
                        setIsDirectionRouteVisible(true)
                    }}
                >
                    <Image 
                        source={require("../assets/images/routeSign.png")} 
                        style={{width: 30, height: 30}}
                    />
                    <Text style={styles.directionButtonText}>Directions</Text>
                </TouchableOpacity>
            </View>
            )}
            
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 25,
        left: '2.5%',
        width: '95%',
        backgroundColor: "black",
        zIndex: 101,
        padding: 10,
        borderRadius: 20,
        paddingLeft:15,
        paddingBottom:15,
        paddingRight:15
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 5,
        marginBottom: 10,
        color:"white",
        width:"80%",
    },
    directionButton: {
        backgroundColor: "#0dadddff",
        width: "40%",
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25,
        paddingLeft:10,
        paddingRight:10
    },
    directionButtonText:{
        fontSize: 20,
        fontWeight: "bold",
        color:"white"
    }
});
