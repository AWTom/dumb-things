import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Enable CORS for API endpoints
app.use('/api/*', cors());

// Static message endpoint (keeping for compatibility)
app.get("/message", (c) => {
  return c.text("AI App Builder");
});

// Chat API endpoint
app.post("/api/chat", async (c) => {
  try {
    const body = await c.req.json();
    const { prompt } = body;

    if (!prompt) {
      return c.json({ error: "Prompt is required" }, 400);
    }

    // These are the fun loading steps we'll show to the user
    const buildingSteps = [
      "Combobulating the spacetime",
      "Initializing quantum processors",
      "Generating app molecules",
      "Assembling digital components",
      "Polishing user interface",
      "Optimizing code pathways",
      "Testing in parallel universes",
      "Preparing launch sequence"
    ];
    
    // Call Cloudflare AI
    const aiResponse = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'system', content: 'You are an app building assistant. Create a concise, helpful response about building the requested app.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 512,
    });

    return c.json({
      response: aiResponse.response,
      buildingSteps
    });
  } catch (error) {
    console.error("Error processing chat request:", error);
    return c.json({ error: "Failed to process request" }, 500);
  }
});

export default app;
