import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, ProjectBlueprint, StarterKit, ProjectStrategy, ChatMessage } from "../types";

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
        docsUrl: { type: Type.STRING, description: "Valid URL to official docs (e.g., https://react.dev)" },
        tutorialUrl: { type: Type.STRING, description: "Valid URL to a high-quality YouTube tutorial" },
      },
      required: ["name", "category", "reason", "difficulty", "isStudentFriendly", "docsUrl", "tutorialUrl"],
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
        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        ownedFiles: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["title", "focus", "keyTasks", "skills", "ownedFiles"],
    },
  },
  folderStructure: {
    type: Type.ARRAY,
    items: fileNodeSchema,
    description: "Root level files/folders representing the architecture (up to 3 levels deep)"
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
                  url: { type: Type.STRING },
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
        recommended: { type: Type.OBJECT, properties: strategySchemaProperties, required: ["strategyName", "tools", "resourceAnalysis", "budgetBreakdown", "teamRoles", "folderStructure"] },
        alternative: { type: Type.OBJECT, properties: strategySchemaProperties, required: ["strategyName", "tools", "resourceAnalysis", "budgetBreakdown", "teamRoles", "folderStructure"] },
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
  required: ["installCommand", "setupScript", "files"]
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
  const prompt = `
    Act as a Senior Technical Architect for students.
    Create a detailed project blueprint for: "${input.description}".
    
    Inputs:
    - Type: ${input.projectType}
    - Level: ${input.difficulty}
    - Time: ${input.timeConstraint}
    - Team Size: ${input.teamSize} person(s)
    - Goal: ${input.projectGoal} (Deep Learning vs Rapid MVP)

    Requirements:
    1. **Dual Strategy**: Generate TWO strategies.
    
    2. **Tools**: For EVERY tool, provide a 'docsUrl' (Official Documentation) AND a 'tutorialUrl' (YouTube). 
       - Prioritize official docs and reputable channels like Traversy Media, Fireship, or FreeCodeCamp.
    
    3. **Folder Structure**: Realistic VS-Code style file tree.
    
    4. **Success Path**: 4 Phases, nodes with concepts and resources (Video + Doc).
    
    5. **Data Flow**: A simple ordered list of strings representing the data journey (e.g. "User Input", "React Client", "Node API", "Postgres").

    6. **Resume Tip**: A strong one-liner.

    Output JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: blueprintSchema,
        systemInstruction: "You are ToolWise, an advanced project architect.",
        thinkingConfig: { thinkingBudget: 2048 }
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
    2. **Setup Script**: A bash/shell script to 'mkdir' folders and 'touch' files matches the project structure.
    3. **Critical Files**: 5 most important files.
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