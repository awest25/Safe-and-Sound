import { GoogleGenerativeAI } from "@google/generative-ai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const generateDangerList = async (reviewList: String[]) => {
    // Make the format Review 1: {review} Review 2: {review} etc.
    let reviewText = "";
    for (let i = 0; i < reviewList.length; i++) {
        reviewText += "Review " + (i + 1) + ": " + reviewList[i] + "\n";
    }

    console.log("String: " + reviewText);
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');
    const generativeAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = generativeAI.getGenerativeModel({ model: "gemini-1.0-pro-latest"});
    const prompt = "The following are reviews about a vacation rental. For every potential health or safety hazard mentioned in a review, return a short description of the hazard that a guest should be aware of before booking the rental. Be very liberal with the hazard reporting and err on the side of caution. Any slightly negative statement is a hazard. Every hazard you list should be separated by a line break.\n THIS PART IS IMPORTANT: If there are more than 3 hazards, CHOOSE THE THREE MOST IMPORTANT ONES. If there are no hazards, return the phrase \"There are no reported hazards.\" Here are the reviews:";
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    let dangerList = responseText.split('\n');

    return dangerList;
}
