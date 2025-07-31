import { View,Text,StyleSheet } from 'react-native';



export default function NotFoundScreen() {
  return (
    <>
      <View style={styles.container}>
        <Text>Oops! Something went wrong on our side.</Text>
          <Text>Go to the home screen!</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
