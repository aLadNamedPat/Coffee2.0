import { View, Text, ScrollView } from "react-native";
import tw from 'twrnc';

export default function Profile() {
  return (
    <ScrollView
      style={tw`bg-blue-100`}>
      <Text>Profile generation</Text>
    </ScrollView>
  );
}
