import { NextRequest, NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { db } from '@/configs/db';
import { historyTable } from '@/configs/schema';
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const resumeFile: File | null = formData.get('resumeFile') as File;
        const recordId = formData.get('recordId') as string || uuidv4();
        const user = await currentUser();

        if (!resumeFile) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        console.log("Processing resume file:", resumeFile.name, resumeFile.size);

        // Extract text from PDF using WebPDFLoader
        let pdfText = "";
        try {
            // Convert File to Blob for WebPDFLoader
            const arrayBuffer = await resumeFile.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
            const loader = new WebPDFLoader(blob);
            const docs = await loader.load();
            pdfText = docs[0]?.pageContent || "";
            
            if (!pdfText || pdfText.trim().length === 0) {
                console.warn("PDF text extraction returned empty content");
                pdfText = "Resume content extracted but may need manual review";
            }
        } catch (pdfError) {
            console.error("PDF extraction failed:", pdfError);
            pdfText = "Unable to extract text from PDF. Please ensure it's a valid PDF file.";
        }

        console.log("PDF text extracted, length:", pdfText.length);
        console.log("PDF content preview:", pdfText.substring(0, 200));

        // Import and use your AI agent directly
        const { AiResumeAnalyzerAgent } = await import('@/inngest/functions');
        
        // Process directly without Inngest
        console.log("Sending to AI agent...");
        const aiResumeReport = await AiResumeAnalyzerAgent.run(pdfText);
        
        console.log("AI Response received:", JSON.stringify(aiResumeReport, null, 2));

        // Parse the AI response - IMPROVED VERSION
        let parseJson;
        try {
            // @ts-ignore
            const rawContent = aiResumeReport.output[0].content;
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
            const rawContent = aiResumeReport.output[0].content;
            parseJson = {
                overall_score: 0,
                overall_feedback: "Analysis Failed",
                summary_comment: "Unable to parse AI response. Please try again.",
                sections: {
                    contact_info: { score: 0, comment: "Analysis failed" },
                    experience: { score: 0, comment: "Analysis failed" },
                    education: { score: 0, comment: "Analysis failed" },
                    skills: { score: 0, comment: "Analysis failed" }
                },
                tips_for_improvement: ["Please try uploading the resume again"],
                whats_good: ["Unable to analyze"],
                needs_improvement: ["Unable to analyze"],
                error: true,
                raw_response: rawContent.substring(0, 500) // Include first 500 chars for debugging
            };
        }

        // Save to database
        await db.insert(historyTable).values({
            recordId: recordId,
            content: parseJson,
            aiAgentType: '/ai-tools/ai-resume-analyzer',
            createdAt: (new Date()).toString(),
            userEmail: user?.primaryEmailAddress?.emailAddress,
            metaData: "Direct resume analysis completed",
        });

        return NextResponse.json({ 
            status: 'Completed', 
            output: parseJson,
            recordId: recordId
        });

    } catch (error: any) {
        console.error('Resume agent error:', error);
        return NextResponse.json({ 
            error: error.message || 'Internal Server Error' 
        }, { status: 500 });
    }
}