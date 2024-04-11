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
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Home />
    </SafeAreaView>
  );
    <SafeAreaView style={styles.container}>
        <Profile/>
    </SafeAreaView>
    );
}
