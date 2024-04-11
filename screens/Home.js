import {View, Text, TextInput, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView} from 'react-native';
import { useState } from 'react';
import tw from '../tw';
import axios from 'axios';


// Root URL of API
const rootURL = 'http://localhost:8080';

function Home() {
    const [text, setText] = useState('');

    const handleSearch = async () => {
        console.log('Searching for:', text);
        try {
            // Replace 'https://yourapi.com/search' with your actual API endpoint
            const response = await axios.get(`${rootURL}/insights`);
            // Process your response data here
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching data:", {error})
        }
    };

    return (
        <KeyboardAvoidingView keyboardVerticalOffset={10} behavior="padding" style={tw`flex-1`}>
        <ScrollView contentContainerStyle={tw`flex-grow justify-center px-7`}>
            <View style={tw`w-full items-center mb-20`}>
                <Image
                  source={require('../assets/coffee-logo.png')}
                  style={tw`w-50 h-60`} // Adjust width and height as needed
                  resizeMode="contain"
                />
            </View>
            
            <TextInput
                value={text}
                onChangeText={setText}
                style={tw`bg-white w-full p-2 rounded-lg border border-gray-300 h-8`}
                placeholder="Search with a LinkedIn URL..."
                placeholderTextColor="gray"
            />
            <View style={tw`w-full items-center mt-4`}>
                <TouchableOpacity 
                  onPress={handleSearch}
                  style={tw`bg-blue-500 w-20 py-2 rounded-lg bg-darkbrown items-center`}
                >
                  <Text style={[tw`text-center`, { color: '#ffffff' }]}>Search</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
      );
}

export default Home;