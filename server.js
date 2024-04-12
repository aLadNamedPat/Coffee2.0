// These will need to be installed before it can be ran/tested locally!
// npm init
// npm install express
// npm install --save openai
const express = require('express');
const app = express();
const cors = require('cors');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(express.json());
const port = 8080;
const OpenAI = require("openai");



// How I found api stuff: https://platform.openai.com/docs/api-reference/streaming
// Will need to put this in .env for safety
const openai = new OpenAI({
  apiKey: "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", // This is the default and can be omitted
});


app.get('/', (req, res) => {
    // can change to home page
    res.send('<h1> Hello, Coffee?</h1>');
});


// This is a simple test route to see if it is correctly accessing the openai
app.get('/test', async (req, res) => {
    try {
        var messages = [
            // tells chat gpt how they should be acting
            {role: "system", content: "You are a helpful assistant."},
            // simple query to test if it works or not
            { role: "user", content: "Say 'Hello! I am coffee, your personal assistant.'" },
        ];
   
        // gets chat gpt's response
        const completion = await openai.chat.completions.create({
            messages: messages,
            model: 'gpt-3.5-turbo',
          });
   
        // returns chat gpt's response
        res.status(200).json({result: completion.choices[0].message.content});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// Route to get the insights
app.post('/insights', async (req, res) => {
    // pass in the html or whatever of the linkedin
    if (!req.body.linkedin_profile) {
        return res.status(500).json("No linkedin profile");
    }
    var linkedinProfile = req.body.linkedin_profile;


    try {
        var messages = [
            // tells chat gpt how they should be acting
            {role: "system", content: "You are to act like a recruiter/interviewer."},
            // gives chat gpt the profile information
            { role: "user", content: `Here is json of the linkedin profile: ${linkedinProfile}` },
            // asks gpt to return bullet points/key insights,
            { role: "user", content: "Give me some key insights for skills, experiences, and tasks in bullet points." },
            { role: "user", content: "I want the result to be given in the format with headings 'Skills:', 'Experiences:', and 'Tasks:'. Additionally, I want each key insight to be on a separate line." },
            { role: "user", content: "Just display the results, do not add any additional wording before the response." }
        ];
   
        // gets chat gpt's response
        const completion = await openai.chat.completions.create({
            messages: messages,
            model: 'gpt-3.5-turbo',
          });
   
        // returns chat gpt's response
        res.status(200).json({result: completion.choices[0].message.content});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
   
// route to see if the questions are being generated quickly
app.post('/questions', async (req, res) => {
    // pass in the html or whatever of the linkedin
    var linkedinProfile = req.body.linkedin_profile;
    // topic is so we can choose to generate questions about skills, experiences, awards, etc
    if (req.body.topic) {
        var topic = req.body.topic;
        console.log(topic);
        try {
            var messages = [
                // tells chat gpt how they should be acting
                {role: "system", content: "You are to act like a recruiter/interviewer."},
                // gives chat gpt the profile information
                { role: "user", content: `Here is the linkedin profile information: ${linkedinProfile}` },
                { role: "user", content: `Generate questions to ask the person in an interview or coffee chat about the profile about each of these topics: ${topic}.` },
                { role: "user", content: "I want the result to be given in the format with headings of each topic followed by a colon. Additionally, I want each question to be on a separate line." },
                { role: "user", content: "Some useful questions might ask about expanding on previous experiences or asking for examples of times certain skills are used." },
                { role: "user", content: "Just display the results, do not add any additional wording before the response." }
                //
            ];
    
            const completion = await openai.chat.completions.create({
                messages: messages,
                model: 'gpt-3.5-turbo',
            });
    
            res.status(200).json({result: completion.choices[0].message.content});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    } else {
        try {
            var messages = [
                // tells chat gpt how they should be acting
                {role: "system", content: "You are to act like a recruiter/interviewer."},
                // gives chat gpt the profile information
                { role: "user", content: `Here is the linkedin profile information: ${linkedinProfile}` },
                // Ask easy, medium, and hard questions if no topics are given
                { role: "user", content: `Generate 3 easy, medium, and hard questions to ask the person in an interview or coffee chat about the profile.` },
                { role: "user", content: "I want the result to be given in the format with headings 'Easy Questions:', 'Medium Questions:', and 'Hard Questions:'. Additionally, I want each question to be on a separate line." },
                { role: "user", content: "Some useful questions might ask about expanding on previous experiences or asking for examples of times certain skills are used." },
                { role: "user", content: "Just display the results, do not add any additional wording before the response." }
            ];
    
            const completion = await openai.chat.completions.create({
                messages: messages,
                model: 'gpt-3.5-turbo',
            });
    
            res.status(200).json({result: completion.choices[0].message.content});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
});

app.post('/topics', async (req, res) => {
    var linkedinProfile = req.body.linkedin_profile;

    try {
        var messages = [
            {role: "system", content: "You are to act like a recruiter/interviewer."},
            { role: "user", content: `Here is the linkedin profile information: ${linkedinProfile}` },
            { role: "user", content: `I want you to generate 3 topics about the linkedin profile given there is sufficient information. For example, topics may include but are not limited to 'experience', 'education', or 'skills'.` },
            { role: "user", content: `Please give your response with only the three topics separated by commas, no other text. The topics should be 1-2 words.` }
        ];
   
        const completion = await openai.chat.completions.create({
            messages: messages,
            model: 'gpt-3.5-turbo',
          });
   
        res.status(200).json({result: completion.choices[0].message.content});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
