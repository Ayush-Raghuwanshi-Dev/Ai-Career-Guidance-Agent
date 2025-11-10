import { createAgent, gemini, openai } from '@inngest/agent-kit';
import { inngest } from "./client";
import ImageKit from "imagekit";
import { historyTable } from '@/configs/schema';
import { db } from '@/configs/db';

// ✅ AI CHAT - UNCHANGED (WORKING PERFECTLY)
export const AiCareerChatAgent = createAgent({
    name:'AiCareerChatAgent',
    description: 'An AI agent that helps with Career related questions',
    system:`You are an expert career coach with deep knowledge of job markets across all industries and professions worldwide.
Your role is to provide practical, customized, and supportive guidance on topics like career planning, resume and cover letter writing, interview preparation, networking, job searching, skill development, and career transitions.
Your advice should be clear, encouraging, and actionable, tailored to the user's unique situation and background.
Avoid generic responses and do not provide legal, medical, or financial advice.
Stay positive and constructive in tone, helping users build confidence in their career journey.`,
    model:gemini({
        model:"gemini-2.0-flash-lite",
        apiKey: process.env.GEMINI_API_KEY
    })
})

// ✅ AI CHAT - UNCHANGED (WORKING PERFECTLY)
export const AiCareerAgent=inngest.createFunction(
    {id:'AiCareerAgent'},
    {event: 'AiCareerAgent'},
    async({ event,step})=>{
        const{userInput}=await event?.data;
        const result=await AiCareerChatAgent.run(userInput);
        return result;
    }
)

// ✅ RESUME ANALYZER AGENT - FIXED (Complete system prompt)
export const AiResumeAnalyzerAgent = createAgent({
    name:'AiResumeAnalyzerAgent',
    description:'An AI Agent that helps with Resume Analysis',
    system:`You are an advanced AI Resume Analyzer Agent.

Your task is to evaluate a candidate's resume and return a detailed analysis in the following structured JSON schema format.

The schema must match the layout and structure of a visual UI that includes overall score, section scores, summary feedback, improvement tips, strengths, and weaknesses.

📤 INPUT: I will provide a plain text resume.

🎯 GOAL: Output a JSON report as per the schema below. The report should reflect:

overall_score (0–100)
overall_feedback (short message e.g., "Excellent", "Needs improvement")
summary_comment (1–2 sentence evaluation summary)

Section scores for:
- Contact Info
- Experience  
- Education
- Skills

Each section should include:
- score (as percentage)
- Optional comment about that section

Plus:
- Tips for improvement (3–5 tips)
- What's Good (1–3 strengths)
- Needs Improvement (1–3 weaknesses)

🧠 Output JSON Schema:
{
  "overall_score": 85,
  "overall_feedback": "Excellent!",
  "summary_comment": "Your resume is strong, but there are areas to refine.",
  "sections": {
    "contact_info": {
      "score": 95,
      "comment": "Perfectly structured and complete."
    },
    "experience": {
      "score": 88,
      "comment": "Strong bullet points and impact."
    },
    "education": {
      "score": 70,
      "comment": "Consider adding relevant coursework."
    },
    "skills": {
      "score": 60,
      "comment": "Expand on specific skill proficiencies."
    }
  },
  "tips_for_improvement": [
    "Add more numbers and metrics to your experience section to show impact.",
    "Integrate more industry-specific keywords relevant to your target roles.",
    "Start bullet points with strong action verbs to make your achievements stand out."
  ],
  "whats_good": [
    "Clean and professional formatting.",
    "Clear and concise contact information.",
    "Relevant work experience."
  ],
  "needs_improvement": [
    "Skills section lacks detail.",
    "Some experience bullet points could be stronger.",
    "Missing a professional summary/objective."
  ]
}

IMPORTANT: Return ONLY valid JSON format, no additional text or explanations. Start with { and end with }.`,
    model:gemini({
        model:"gemini-2.0-flash-lite",
        apiKey: process.env.GEMINI_API_KEY
    })
})

var imagekit = new ImageKit({
    //@ts-ignore
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    //@ts-ignore
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    //@ts-ignore
    urlEndpoint : process.env.IMAGEKIT_ENDPOINT_URL
});
if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  throw new Error("IMAGEKIT_PUBLIC_KEY is missing in environment variables");
}

// 🔧 RESUME AGENT - FIXED (Only uses pdfText, no large files)
export const AiResumeAgent=inngest.createFunction(
    {id:'AiResumeAgent'},
    {event:'AiResumeAgent'},
    async({event,step})=>{
        const{recordId, pdfText, aiAgentType, userEmail}=await event.data;

        // Use only the extracted text - no file upload to avoid size limits
        const aiResumeReport=await AiResumeAnalyzerAgent.run(pdfText);
        //@ts-ignore
        const rawContent = aiResumeReport.output[0].content;
        const rawContentJson=rawContent.replace('```json','').replace('```','');
        const parseJson=JSON.parse(rawContentJson);

        const saveToDb=await step.run('saveToDb', async()=>{
            const result=await db.insert(historyTable).values({
                recordId:recordId,
                content:parseJson,
                aiAgentType:aiAgentType,
                createdAt:(new Date()).toString(),
                userEmail:userEmail,
                metaData: "Resume text analysis completed",
            });
            console.log(result);
            return parseJson;
        })
        
    }   
)

// ✅ ROADMAP AGENT - UNCHANGED
export const AiRoadmapGeneratorAgent=createAgent({
    name:'AiRoadmapGeneratorAgent',
   description:'Generates Detailed with a Tree Like Flow Roadmap',
    system:`Generate a valid JSON output for React Flow representing a tree-structured learning roadmap for a given user input position or skills.

Requirements:

The layout must resemble roadmap.sh, following a clear vertical tree structure.

The roadmap should start from fundamentals at the top and progress to advanced topics at the bottom.

Include branching for different specializations if applicable.

Node positioning (important for visibility):

All nodes must have unique, non-overlapping x/y positions so that the entire roadmap is clearly visible within the React Flow canvas and minimap.

Minimum horizontal spacing between sibling branches: 300px

Minimum vertical spacing between levels: 200px

Nodes at the same level should be horizontally aligned.

Each node must include:

"id": Unique string ID (e.g., "node-1")

"type": "turbo"

"position": { "x": <value>, "y": <value> } — follow the spacing rules strictly

"data":

"title": Short title of the step

"description": Two-line explanation of what the step covers

"link": Helpful resource URL

Define edges connecting nodes:

Each edge must have a unique "id" (e.g., "e1-2")

Specify "source" and "target" node IDs

Output format (must be valid JSON with no extra text or comments):
{
"roadmapTitle": "Example Roadmap",
"description": "A 3-5 line description summarizing the learning journey from fundamentals to specialization.",
"duration": "Estimated duration to complete the roadmap",
"initialNodes": [
{
"id": "node-1",
"type": "turbo",
"position": { "x": 0, "y": 0 },
"data": {
"title": "Step Title",
"description": "Short two-line explanation of what the step covers.",
"link": "https://example.com"
}
}
...
],
"initialEdges": [
{
"id": "e1-2",
"source": "node-1",
"target": "node-2"
}
...
]
}

Important:

Ensure that all nodes are visible in the React Flow viewport and minimap — no node should be placed outside the visible range (x between -1000 to +1000, y positive, no excessive negative x).

Ensure nodes and edges have unique IDs.

Space nodes so the layout is clean, easy to follow, and does not overlap at any point.

Output must be valid JSON only — no extra explanations, text, or comments.`,
    model:gemini({
        model:"gemini-2.0-flash-lite",
        apiKey: process.env.GEMINI_API_KEY

})
})

// ✅ ROADMAP AGENT - UNCHANGED
export const AiRoadmapAgent=inngest.createFunction(
    {id:'AiRoadmapAgent'},
    {event:'AiRoadmapAgent'},
    async({event,step})=>{
        const {roadmapId,userInput,userEmail }=await event.data;

        const roadmapResult= await AiRoadmapGeneratorAgent.run("UserInput:"+userInput)
        // return roadmapResult
        
        //@ts-ignore
        const rawContent = roadmapResult.output[0].content;
        const rawContentJson=rawContent.replace('```json','').replace('```','');
        const parseJson=JSON.parse(rawContentJson);
        
        
        //Save to DB
        const saveToDb=await step.run('saveToDb', async()=>{
            if (!userEmail) {
                throw new Error("userEmail is missing in event data");
            }

            const result=await db.insert(historyTable).values({
                recordId:roadmapId,
                content:parseJson,
                aiAgentType:"/ai-tools/ai-roadmap-agent",
                createdAt:(new Date()).toString(),
                userEmail:userEmail,
                metaData: userInput,
            });
            console.log(result);
            return parseJson;
        })
        
    }    
)