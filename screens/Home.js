import {View, Text, TextInput, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView} from 'react-native';
import { useState, useRef, React, useEffect } from 'react';
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list'
import tw from '../tw';
import axios from 'axios';


// Root URL of API
const rootURL = 'http://10.103.103.221:8080';
// const rootURL = 'http://34.31.160.173';

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
        
        /* try {
            console.log('Searching for:', text);

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
                    api_key: '6616acfe42ba6d448f5def89',
                    type: 'profile',
                    linkId: userId
                }
            });
            const linkedinStringify = JSON.stringify(linkedinJSON);
            console.log({results: linkedinStringify});
            setLinkedinString(linkedinStringify);
            console.log({results: linkedinString});
        } catch (error) {
            console.error("Error fetching linkedin data:", {error});
            // add something to show the user that the linkedin profile was not found
            return;
        } */

        const exp = `ExperienceExperienceInstitute for Systems Biology (ISB) logoResearch InternResearch InternInstitute for Systems Biology · InternshipInstitute for Systems Biology · InternshipAug 2022 - Dec 2023 · 1 yr 5 mosAug 2022 - Dec 2023 · 1 yr 5 mosHybridHybridWrite a program to compute metrics and read mass spectra, then select mass spectra for further analysis and write new data files with selected information under the domain of proteomics and mass spectrometry.Write a program to compute metrics and read mass spectra, then select mass spectra for further analysis and write new data files with selected information under the domain of proteomics and mass spectrometry.Data Modeling, Python (Programming Language) and +1 skillWASHINGTON STATE YOUTH SOCCER ASSOCIATION logoSoccer RefereeSoccer RefereeWASHINGTON STATE YOUTH SOCCER ASSOCIATION · Part-timeWASHINGTON STATE YOUTH SOCCER ASSOCIATION · Part-time2019 - Dec 2023 · 5 yrs2019 - Dec 2023 · 5 yrsBellevue, Washington, United States · On-siteBellevue, Washington, United States · On-siteSoccer referee in the greater Seattle area for U10-U19.Soccer referee in the greater Seattle area for U10-U19.AiGoLearning: Non-Profit for Teens Teach Kids logoEvaluator and InstructorEvaluator and InstructorAiGoLearning: Non-Profit for Teens Teach Kids · Part-timeAiGoLearning: Non-Profit for Teens Teach Kids · Part-time2020 - Aug 2023 · 3 yrs 8 mos2020 - Aug 2023 · 3 yrs 8 mosRemoteRemoteEvaluate new interested teachers and teaches programming languages.Evaluate new interested teachers and teaches programming languages.Team Co-CaptainTeam Co-CaptainFTC Team 11138 RoboEclipse · Part-timeFTC Team 11138 RoboEclipse · Part-time2014 - Feb 2023 · 9 yrs 2 mos2014 - Feb 2023 · 9 yrs 2 mosOn-siteOn-siteDean's List Finalist; Team captain and outreach lead, successfully qualified for World/State 6x consecutively, attachment driver, key CAD/software developer for root modeling and creating custom-designed partsDean's List Finalist; Team captain and outreach lead, successfully qualified for World/State 6x consecutively, attachment driver, key CAD/software developer for root modeling and creating custom-designed partsUniversity of Washington logoSummer Research InternSummer Research InternUniversity of Washington · InternshipUniversity of Washington · InternshipJul 2022 - Aug 2022 · 2 mosJul 2022 - Aug 2022 · 2 mosOn-siteOn-siteAssisted in data collection using Instron machine, modeled designs and set-ups in CAD (Fusion 360), and printed HSAs and other designs using Carbon, Nylon, and Ender 3D Printers.Assisted in data collection using Instron machine, modeled designs and set-ups in CAD (Fusion 360), and printed HSAs and other designs using Carbon, Nylon, and Ender 3D Printers.Research, Computer-Aided Design (CAD) and +2 skills`;
        setLinkedinString(exp);

        setLoadingInsights(true);
        try {
            // Replace 'https://yourapi.com/search' with your actual API endpoint
            const response = await axios.post(`${rootURL}/insights`, {
                linkedin_profile: exp
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
            const combinedTopics = selectedTopics.join(',');
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