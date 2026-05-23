import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apikey: process.env.GOOGLE_APi_KEY ,
})

export default ai;