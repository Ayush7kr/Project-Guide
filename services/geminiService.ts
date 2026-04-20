
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, ProjectBlueprint, StarterKit, ProjectStrategy, ChatMessage, DeepResearchReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Schemas ---

const leafNodeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    type: { type: Type.STRING, enum: ["file", "folder"] },
  },
  required: ["name", "type"]
};

const innerNodeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    type: { type: Type.STRING, enum: ["file", "folder"] },
    children: {
      type: Type.ARRAY,
      items: leafNodeSchema
    }
  },
  required: ["name", "type"]
};

const fileNodeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    type: { type: Type.STRING, enum: ["file", "folder"] },
    children: {
      type: Type.ARRAY,
      items: innerNodeSchema
    }
  },
  required: ["name", "type"]
};

const strategySchemaProperties = {
  strategyName: { type: Type.STRING, description: "e.g., 'Industry Standard' or 'Rapid MVP'" },
  description: { type: Type.STRING, description: "Short description of this approach" },
  tools: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        category: { type: Type.STRING },
        reason: { type: Type.STRING },
        difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
        isStudentFriendly: { type: Type.BOOLEAN },
        marketInsight: { type: Type.STRING, description: "A short, punchy job market stat. E.g., '🔥 High Demand: 20k+ Jobs'" },
        docsUrl: { type: Type.STRING, description: "REQUIRED FORMAT: 'https://www.google.com/search?q=[Tool Name]+official+documentation'. DO NOT use direct links." },
        tutorialUrl: { type: Type.STRING, description: "REQUIRED FORMAT: 'https://www.youtube.com/results?search_query=[Tool Name]+tutorial+2025'. DO NOT use direct video links." },
      },
      required: ["name", "category", "reason", "difficulty", "isStudentFriendly", "marketInsight", "docsUrl", "tutorialUrl"],
    },
  },
  resourceAnalysis: {
    type: Type.OBJECT,
    properties: {
      cpuLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
      ramEstimate: { type: Type.STRING },
      diskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
      resourceIntensity: { type: Type.INTEGER },
      summary: { type: Type.STRING },
      cloudTip: { type: Type.STRING },
    },
    required: ["cpuLevel", "ramEstimate", "diskLevel", "resourceIntensity", "summary"],
  },
  budgetBreakdown: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        toolName: { type: Type.STRING },
        freeTierInfo: { type: Type.STRING },
        inStudentPack: { type: Type.BOOLEAN },
      },
      required: ["toolName", "freeTierInfo", "inStudentPack"],
    },
  },
  teamRoles: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        focus: { type: Type.STRING },
        keyTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
        skills: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              demand: { type: Type.STRING, description: "Market demand level e.g., 'High', 'Critical', 'Niche', 'Rising'" }
            },
            required: ["name", "demand"]
          } 
        },
        ownedFiles: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["title", "focus", "keyTasks", "skills", "ownedFiles"],
    },
  },
  folderStructure: {
    type: Type.ARRAY,
    items: fileNodeSchema,
    description: "Root level files/folders representing the architecture (up to 3 levels deep)"
  },
  tradeOffs: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        toolName: { type: Type.STRING, description: "A popular tool that was NOT chosen." },
        reasonExcluded: { type: Type.STRING, description: "Why it was avoided for this specific context." }
      },
      required: ["toolName", "reasonExcluded"]
    },
    description: "List 1-2 popular tools purposely excluded from this stack (The Cutting Room Floor)."
  }
};

const successPathSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      phaseName: { type: Type.STRING, description: "e.g. Phase 1: Knowledge Foundation" },
      nodes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            concepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            resources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING, description: "Search Query URL. Video: 'https://www.youtube.com/results?search_query=[Topic]+tutorial+2025'. Doc: 'https://www.google.com/search?q=[Topic]+guide'" },
                  type: { type: Type.STRING, enum: ["video", "doc"] },
                },
                required: ["title", "url", "type"],
              }
            },
            estimatedEffort: { type: Type.STRING },
          },
          required: ["id", "title", "description", "concepts", "resources", "estimatedEffort"],
        }
      }
    },
    required: ["phaseName", "nodes"],
  }
};

const blueprintSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING },
    projectDomain: { type: Type.STRING },
    complexitySummary: { type: Type.STRING },
    estimatedDuration: { type: Type.STRING },
    resumeTip: { type: Type.STRING },
    dataFlow: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Ordered list of system nodes for data flow (e.g. 'User', 'React', 'API')" },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["Medium", "High"] },
          mitigation: { type: Type.STRING },
        },
        required: ["title", "description", "severity", "mitigation"],
      },
    },
    strategies: {
      type: Type.OBJECT,
      properties: {
        recommended: { type: Type.OBJECT, properties: strategySchemaProperties, required: ["strategyName", "tools", "resourceAnalysis", "budgetBreakdown", "teamRoles", "folderStructure", "tradeOffs"] },
        alternative: { type: Type.OBJECT, properties: strategySchemaProperties, required: ["strategyName", "tools", "resourceAnalysis", "budgetBreakdown", "teamRoles", "folderStructure", "tradeOffs"] },
      },
      required: ["recommended", "alternative"],
    },
    successPath: successPathSchema,
    simpleRoadmapFallback: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["stepNumber", "title", "description"],
      },
    },
  },
  required: ["projectName", "projectDomain", "complexitySummary", "estimatedDuration", "resumeTip", "dataFlow", "risks", "strategies", "successPath", "simpleRoadmapFallback"],
};

const starterKitSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    installCommand: { type: Type.STRING, description: "Command to install dependencies (e.g., 'npm install react axios' or 'pip install fastapi')" },
    setupScript: { type: Type.STRING, description: "A bash/shell script to create the folder structure and touch files." },
    readme: { type: Type.STRING, description: "Markdown content for a basic README.md" },
    dependencies: { type: Type.STRING, description: "Content of the dependency file (e.g. package.json or requirements.txt)" },
    dependencyFileName: { type: Type.STRING, description: "Name of the dependency file (e.g. package.json)" },
    envFile: { type: Type.STRING, description: "Content for .env.local file with placeholder keys" },
    commonErrors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          error: { type: Type.STRING },
          fix: { type: Type.STRING },
        },
        required: ["error", "fix"],
      },
      description: "2 common setup errors for this stack and 1-sentence fixes.",
    },
    files: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          fileName: { type: Type.STRING },
          language: { type: Type.STRING },
          content: { type: Type.STRING, description: "The actual code/content." },
          description: { type: Type.STRING },
          buildSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 short bullet points on how to implement this file." },
        },
        required: ["fileName", "language", "content", "description", "buildSteps"],
      }
    }
  },
  required: ["installCommand", "setupScript", "files", "readme", "dependencies", "dependencyFileName", "envFile", "commonErrors"]
};

const deepResearchSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    competitors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["name", "description"]
      }
    },
    technicalEdge: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          feature: { type: Type.STRING },
          whyItMatters: { type: Type.STRING },
        },
        required: ["feature", "whyItMatters"]
      }
    },
    monetizationStrategies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          model: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["model", "description"]
      }
    },
    summary: { type: Type.STRING }
  },
  required: ["competitors", "technicalEdge", "monetizationStrategies", "summary"]
};

const projectNameSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING, description: "A creative, catchy project name." }
  },
  required: ["projectName"]
};

// --- API Calls ---

export const generateBlueprint = async (input: UserInput): Promise<ProjectBlueprint> => {
  // Logic to handle custom inputs
  const finalProjectType = input.projectType === 'Other' && input.customProjectType 
    ? input.customProjectType 
    : input.projectType;

  const finalTimeConstraint = input.timeConstraint === 'Other' && input.customTimeConstraint 
    ? input.customTimeConstraint 
    : input.timeConstraint;

  const prompt = `
    Act as a Senior Technical Architect for students.
    Create a detailed project blueprint for: "${input.description}".
    
    Inputs:
    - Type: ${finalProjectType}
    - Level: ${input.difficulty}
    - Time: ${finalTimeConstraint}
    - Team Size: ${input.teamSize} person(s)
    - Goal: ${input.projectGoal} (Deep Learning vs Rapid MVP)

    Requirements:
    1. **Dual Strategy**: Generate TWO strategies.
    
    2. **Tools & Market Insight**: For EVERY tool, provide:
       - 'marketInsight': A short, punchy metric about job market demand for this tool.
       - 'docsUrl': **MUST** use this exact Google Search Query format: "https://www.google.com/search?q=[Tool Name]+official+documentation"
       - 'tutorialUrl': **MUST** use this exact YouTube Search Query format: "https://www.youtube.com/results?search_query=[Tool Name]+tutorial+2025"
       *CRITICAL: DO NOT generate specific 'youtube.com/watch?v=...' URLs. They are often broken. ALWAYS use the search query format.*
    
    3. **Folder Structure**: Realistic VS-Code style file tree.
    
    4. **Success Path**: 4 Phases, nodes with concepts and resources.
       - For resources 'url': You MUST use the search query strategy:
         - Video Template: "https://www.youtube.com/results?search_query=[Topic]+tutorial+2025"
         - Doc Template: "https://www.google.com/search?q=[Topic]+guide"
    
    5. **Data Flow**: A simple ordered list of strings representing the data journey (e.g. "User Input", "React Client", "Node API", "Postgres").

    6. **Resume Tip**: A strong one-liner.
    
    7. **Skills**: For team roles, list specific skills and their market demand (e.g. 'High', 'Rising').

    8. **Trade-offs**: Identify 1-2 popular tools excluded and explain why.

    Output JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: blueprintSchema,
        systemInstruction: "You are ToolWise, an advanced project architect. You prioritize working links by using Search Query URLs instead of direct links.",
        // Removed thinkingConfig to prevent potential fetch errors if model/key support is limited
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as ProjectBlueprint;
  } catch (error) {
    console.error("Error generating blueprint:", error);
    throw error;
  }
};

export const generateStarterKit = async (blueprint: ProjectBlueprint, strategy: ProjectStrategy): Promise<StarterKit> => {
  const prompt = `
    Generate a "Step-by-Step Code Guide" (Starter Kit) for:
    Name: ${blueprint.projectName}
    Stack: ${strategy.tools.map(t => t.name).join(', ')}

    Requirements:
    1. **Install Command**: The exact terminal command to install all needed deps.
       - MUST be a single line.
       - MUST use the correct package manager (npm for Node, pip for Python, etc.).
       - Do not include newlines or comments.
       
    2. **Setup Script**: A bash/shell script to 'mkdir' folders and 'touch' files matching the project structure.
       - IMPORTANT: The script MUST include 'git init'.
       - IMPORTANT: If the stack involves Node.js, include 'npm init -y'.
       
    3. **README**: A simple markdown README with Project Name and Setup steps.
    
    4. **Dependencies**: The content for package.json or requirements.txt (whichever is appropriate).
    
    5. **Dependency File Name**: The name of the file in step 4.
    
    6. **Environment Variables**: Create a template for a .env.local or .env file with necessary keys (e.g., API keys, DB URLs) left empty.
    
    7. **Common Pitfalls**: List 2 common error messages/issues specific to this stack and how to fix them in 1 sentence.
    
    8. **Critical Files**: 5 most important files.
       - Provide **FUNCTIONAL BOILERPLATE CODE**. Do not just list comments.
       - Include imports (e.g., 'import React from "react"', 'from fastapi import FastAPI').
       - Include basic setup (e.g., 'const app = express()', 'ReactDOM.createRoot...').
       - Provide 'buildSteps': 3 specific sub-steps to explain the code logic.

    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: starterKitSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as StarterKit;
  } catch (error) {
    console.error("Error generating starter kit:", error);
    throw error;
  }
};

export const generateDeepResearch = async (projectName: string, projectDomain: string): Promise<DeepResearchReport> => {
  const prompt = `
    Conduct a "Deep Research" technical report for a project titled "${projectName}".
    Domain: "${projectDomain}"
    
    Act as a Startup Consultant and Technical CTO. Provide:
    1. **Market Competitors**: 3 real-world companies/apps building this.
    2. **Technical Edge**: 3 advanced features that would make this student project standout from competitors.
    3. **Monetization Ideas**: 3 ways to turn this into a business.
    4. **Summary**: An encouraging executive summary.
    
    Return strict JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: deepResearchSchema,
      },
    });
    
    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as DeepResearchReport;

  } catch (err) {
    console.error("Error in deep research:", err);
    throw err;
  }
}

export const regenerateProjectName = async (description: string, currentName: string): Promise<string> => {
  const prompt = `
    Generate a NEW, creative, and professional project name for this idea: "${description}".
    The current name is "${currentName}". Give me something different but catchy.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: projectNameSchema,
      },
    });

    const text = response.text;
    if (!text) return currentName;
    return (JSON.parse(text) as { projectName: string }).projectName;
  } catch (error) {
    console.error("Error generating project name:", error);
    return currentName;
  }
};

export const getArchitectChatResponse = async (history: ChatMessage[], blueprint: ProjectBlueprint, currentStrategyName: string, message: string): Promise<string> => {
  const context = `
    You are the 'Architect Assistant' for the project: "${blueprint.projectName}".
    The user is following the "${currentStrategyName}" strategy.
    
    Project Context:
    - Domain: ${blueprint.projectDomain}
    - Tools: ${blueprint.strategies.recommended.strategyName === currentStrategyName 
        ? blueprint.strategies.recommended.tools.map(t => t.name).join(', ') 
        : blueprint.strategies.alternative.tools.map(t => t.name).join(', ')}
    
    Answer the user's technical question based on this context. Keep answers concise, encouraging, and technically accurate.
  `;

  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: context,
    },
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    })),
  });

  const response = await chat.sendMessage({ message });
  return response.text || "I couldn't generate a response.";
};
