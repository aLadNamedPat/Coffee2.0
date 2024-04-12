import { View, Text, SafeAreaView } from "react-native";
import Home from "./screens/Home";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Profile from "./screens/Profile";

export default function App() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Home />
    </View>
  );
    <SafeAreaView style={styles.container}>
        <Profile/>
    </SafeAreaView>
    );
}
