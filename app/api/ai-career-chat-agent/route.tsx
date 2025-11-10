import { NextResponse } from "next/server";
import { AiCareerChatAgent } from "@/inngest/functions";

export async function POST(req: Request) {
    try {
        const { userInput } = await req.json();

        if (!userInput || userInput.trim() === "") {
            return NextResponse.json({ error: "User input is required" }, { status: 400 });
        }

        console.log("Processing AI request:", userInput);

        // Use your existing agent directly - no Inngest needed!
        const result = await AiCareerChatAgent.run(userInput);
        
        // Handle the agent response
        // @ts-ignore
        const response = result.output[0].content;

        console.log("AI Response generated successfully");

        return NextResponse.json({ 
            status: 'Completed', 
            output: response 
        });

    } catch (error: any) {
        console.error('AI Career Agent error:', error);
        
        // More specific error handling
        if (error.message?.includes('API_KEY') || error.message?.includes('GEMINI')) {
            return NextResponse.json({ error: 'AI service configuration error' }, { status: 500 });
        }
        
        return NextResponse.json({ 
            error: error.message || 'Internal Server Error' 
        }, { status: 500 });
    }
}