import {View, Text, TextInput, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView} from 'react-native';
import { useState, useRef, React, useEffect } from 'react';
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list'
import tw from '../tw';
import axios from 'axios';


// Root URL of API
const rootURL = 'http://34.31.160.173';

function Home() {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');
    const [questions, setQuestions] = useState('');
    const [linkedinString, setLinkedinString] = useState('');
    const [insightsVisible, setInsightsVisible] = useState(false);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState(false);
    const [generatedTopics, setGeneratedTopics] = useState('');
    const scrollViewRef = useRef(null);

    const handleSearch = async () => {
        setQuestions('');
        setSelectedTopics([]);
        
        var linkedinStringify = "";
        try {
            console.log('Searching for:', text);
            setLoadingInsights(true);

            var userId = text;
            if (text.charAt(text.length - 1) === '/') {
                userId = text.slice(0, -1);
            }
            if (userId.includes('/')) {
                userId = userId.slice(userId.lastIndexOf('/') + 1, userId.length);
            }

            // change it to get the linkedId from url
            const linkedinJSON = await axios.get(`http://api.scrapingdog.com/linkedin/`, {
                params: {
                    api_key: '6619034e42ba6d448f5df425',
                    type: 'profile',
                    linkId: userId
                }
            });
            linkedinStringify = JSON.stringify(linkedinJSON);
            console.log({results: linkedinStringify});
            setLinkedinString(linkedinStringify);
        } catch (error) {
            console.error("Error fetching linkedin data:", {error});
            // add something to show the user that the linkedin profile was not found
            return;
        }

        try {
            const response = await axios.post(`${rootURL}/insights`, {
                linkedin_profile: linkedinStringify
            });
            // Process your response data here

            console.log(response.data);
            const fullText = response.data.result;
            const startIndex = fullText.indexOf('Skills'); // Find the index of "Skills"
            const relevantText = startIndex > -1 ? fullText.substring(startIndex) : 'No insights found'; // Slice from that index
            setResult(relevantText);
            setInsightsVisible(true);
            setLoadingInsights(false);
            generateTopics();
        } catch (error) {
            console.error("Error fetching data:", {error});
            setInsightsVisible(false);
            setLoadingInsights(false);
        }
    };

    const generateQuestions = async () => {
        setLoadingQuestions(true);  // Start loading
        scrollViewRef.current.scrollToEnd({ animated: true });
        try {
            // Replace 'https://yourapi.com/search' with your actual API endpoint
            const combinedTopics = selectedTopics.join(',').trim();
            console.log(combinedTopics);
            const response = await axios.post(`${rootURL}/questions`, {
                linkedin_profile: linkedinString,
                topic: combinedTopics
            });
            // Process your response data here
            console.log(response.data);
            setLoadingQuestions(false);
            const fullText = response.data.result;
            // const startIndex = fullText.indexOf(':'); // Find the index of "Easy Questions"
            // const relevantText = startIndex > -1 ? fullText.substring(startIndex) : 'No questions found'; // Slice from that index
            // setQuestions(relevantText);
            setQuestions(fullText);
        } catch (error) {
            console.error("Error fetching data:", {error});
            setLoadingQuestions(false);
        }
    };

    const generateTopics = async () => {
        const topics = await axios.post(`${rootURL}/topics`, {
            linkedin_profile: linkedinString
        });
        console.log(topics)

        setGeneratedTopics(topics.data.result);
    }

    // Format insights
    const formattedResult = result.split('\n').filter(line => line.trim() !== '').map((line, index) => {
        if (line.includes('Skills:') || line.includes('Experiences:') || line.includes('Tasks:')) {
            const cleanedLine = line.replace(/[*#-]/g, '').trim();
            return <Text key={index} style={tw`text-xl font-bold my-2`}>{cleanedLine}</Text>;
        } else {
            return <Text key={index} style={tw`text-base my-1`}>{line}</Text>;
        }
        
    });

    // Format questions
    const formattedQuestion = questions.split('\n').filter(line => line.trim() !== '').map((line, index) => {
        if (line.includes('Easy Questions:') || line.includes('Medium Questions:') || line.includes('Hard Questions:')) {
            const cleanedLine = line.replace(/[*#-]/g, '').trim();
            return <Text key={index} style={tw`text-xl font-bold my-2`}>{cleanedLine}</Text>;
        } else if (line.includes(':')) {
            const cleanedLine = line.replace(/[*#-]/g, '').trim();
            return <Text key={index} style={tw`text-xl font-bold my-2`}>{cleanedLine}</Text>;
        } else {
            // For non-title lines, prepend a bullet point
            const cleanedLine = line.replace(/- /g, '').trim();
            return <Text key={index} style={tw`text-base my-1`}>{cleanedLine}</Text>;
        }x
        
    });

    const DropDown = ({ setSelectedTopics, generatedTopics }) => {
        const [selected, setSelected] = useState("");
        const [data, setData] = useState([]);
    
            const allTopics = generatedTopics;
            console.log(generatedTopics);
            const topicsArray = allTopics.split(',');
            const topicsMap = topicsArray.map(topic => ({
                key: topic,
                value: topic
            }));

        return(
            <MultipleSelectList 
                setSelected={(val) => {
                    setSelected(val)
                }}
                data={topicsMap} 
                save="value"
                search="false"
                maxHeight={120}
                searchPlaceholder="Select topics"
                label="Categories"
                placeholder = {selectedTopics.toString()}
                onSelect={() => setSelectedTopics(selected)}
                boxStyles={{marginTop:25}}
            />
        )
      };

    return (
        <KeyboardAvoidingView keyboardVerticalOffset={10} behavior="padding" style={tw`flex-1`}>
        <ScrollView ref={scrollViewRef} contentContainerStyle={tw`flex-grow justify-center px-7`} style={{ backgroundColor: '#f5f3f0'}}>
            <View style={tw`w-full items-center mt-20 mb-20`}>
                <Image
                  source={require('../assets/coffee-logo.png')}
                  style={tw`w-50 h-60`} // Adjust width and height as needed
                  resizeMode="contain"
                />
            </View>
            
            <TextInput
                value={text}
                onChangeText={setText}
                style={tw`w-full p-2 rounded-lg border border-gray h-8`}
                placeholder="Search with a LinkedIn URL..."
                placeholderTextColor="gray"
            />
            <View style={tw`w-full items-center mt-4`}>
                <TouchableOpacity 
                  onPress={handleSearch}
                  style={tw`w-20 mb-4 py-2 rounded-lg bg-darkbrown items-center`}
                >
                  <Text style={[tw`text-center`, { color: '#ffffff' }]}>Search</Text>
                </TouchableOpacity>
            </View>
            
            <View style={tw`w-full px-4`}>
                {loadingInsights ? (
                    <Text style={tw`text-center text-lg my-4`}>Generating insights...</Text>
                ) : (
                    formattedResult
                )}
            </View>

            {insightsVisible && (
                <View style={tw`w-full items-center mt-4 mb-5s`}>
                    <TouchableOpacity 
                        onPress={generateQuestions}
                        style={tw`bg-darkbrown w-38 mb-1 mt-5 py-2 rounded-lg items-center`}
                    >
                        <Text style={[tw`text-center`, { color: '#ffffff' }]}>Generate Questions</Text>
                    </TouchableOpacity>
                    <DropDown setSelectedTopics={setSelectedTopics} generatedTopics={generatedTopics} />
                </View>
            )}  
            {loadingQuestions && (
                <Text style={tw`text-center text-lg my-4`}>Generating questions...</Text>
            )}

            <View style={tw`w-full px-4 mb-10`}>
                {!loadingQuestions && formattedQuestion}
            </View>

        </ScrollView>
        </KeyboardAvoidingView>
      );
}

export default Home;