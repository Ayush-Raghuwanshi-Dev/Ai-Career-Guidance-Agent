import { NextRequest, NextResponse } from "next/server";
import { db } from '@/configs/db';
import { historyTable } from '@/configs/schema';
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const { roadmapId, userInput } = await req.json();
        const user = await currentUser();
        const recordId = roadmapId || uuidv4();

        if (!userInput) {
            return NextResponse.json({ error: 'No user input provided' }, { status: 400 });
        }

        console.log("Processing roadmap request:", userInput);

        // Import and use your AI agent directly
        const { AiRoadmapGeneratorAgent } = await import('@/inngest/functions');
        
        // Process directly without Inngest
        console.log("Sending to AI roadmap agent...");
        const roadmapResult = await AiRoadmapGeneratorAgent.run("UserInput:" + userInput);
        
        console.log("AI Roadmap Response received:", JSON.stringify(roadmapResult, null, 2));

        // Parse the AI response
        let parseJson;
        try {
            // @ts-ignore
            const rawContent = roadmapResult.output[0].content;
            console.log("Raw AI content:", rawContent);

            // Clean the response to extract JSON
            let jsonContent = rawContent.trim();
            
            // Remove markdown code blocks if present
            if (jsonContent.includes('```json')) {
                jsonContent = jsonContent.split('```json')[1].split('```')[0].trim();
            } else if (jsonContent.includes('```')) {
                jsonContent = jsonContent.split('```')[1].split('```')[0].trim();
            }
            
            // Remove any leading/trailing non-JSON text
            const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonContent = jsonMatch[0];
            }

            console.log("Cleaned JSON content:", jsonContent);
            parseJson = JSON.parse(jsonContent);
            
        } catch (parseError) {
            console.error("JSON parsing failed:", parseError);
            // If JSON parsing fails, create a structured error response
            // @ts-ignore
            const rawContent = roadmapResult.output[0].content;
            parseJson = {
                roadmapTitle: "Roadmap Generation Failed",
                description: "Unable to parse AI response. Please try again.",
                duration: "Unknown",
                initialNodes: [],
                initialEdges: [],
                error: true,
                raw_response: rawContent.substring(0, 500)
            };
        }

        // Save to database
        await db.insert(historyTable).values({
            recordId: recordId,
            content: parseJson,
            aiAgentType: "/ai-tools/ai-roadmap-agent",
            createdAt: (new Date()).toString(),
            userEmail: user?.primaryEmailAddress?.emailAddress,
            metaData: userInput,
        });

        return NextResponse.json({ 
            status: 'Completed', 
            output: parseJson,
            recordId: recordId
        });

    } catch (error: any) {
        console.error('Roadmap agent error:', error);
        return NextResponse.json({ 
            error: error.message || 'Internal Server Error' 
        }, { status: 500 });
    }
}