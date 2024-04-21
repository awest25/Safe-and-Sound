// app/routes/danger.ts
import { json } from '@remix-run/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const action = async ({ request, }) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    let reviewList = await request.json(); // Assuming you're sending the reviews as JSON
    reviewList = reviewList.reviews;
    let reviewText = "";
    for (let i = 0; i < reviewList.length; i++) {
        reviewText += "Review " + (i + 1) + ": " + reviewList[i] + "\n";
    }
    // console.log("Review text: " + reviewText);

    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');
    const generativeAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = generativeAI.getGenerativeModel({ model: "gemini-1.0-pro-latest"});
    const prompt = "The following are reviews about a vacation rental. For every potential health or safety hazard mentioned in a review, return a description of the hazard as if you were speaking to a guest about problems they should be aware of before booking. Every hazard should be separated by a line break. If there are more than 3 hazards, choose the three most important ones. If there are no hazards or no reviews, return the phrase \"There are no reported hazards. \" Here are the reviews: \n\n" + reviewText;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    let dangerList = responseText.split('\n');
    console.log("Danger list: " + dangerList);
    return json({ 'dangerList': dangerList });
};
