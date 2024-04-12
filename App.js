import { View, Text, SafeAreaView } from "react-native";
import Home from "./screens/Home";

export default function App() {
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
}
