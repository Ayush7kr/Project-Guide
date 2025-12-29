export enum DifficultyLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export interface Tool {
  name: string;
  category: string;
  reason: string;
  difficulty: DifficultyLevel;
  isStudentFriendly: boolean;
  docsUrl?: string;     
  tutorialUrl?: string; 
}

export interface ResourceAnalysis {
  cpuLevel: 'Low' | 'Medium' | 'High';
  ramEstimate: string;
  diskLevel: 'Low' | 'Medium' | 'High';
  resourceIntensity: number;
  summary: string;
  cloudTip?: string;
}

export interface BudgetDetail {
  toolName: string;
  freeTierInfo: string;
  inStudentPack: boolean;
}

export interface TeamRole {
  title: string;
  focus: string;
  keyTasks: string[];
  skills: string[];
  ownedFiles: string[]; 
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

export interface ProjectRisk {
  title: string;
  description: string;
  severity: 'Medium' | 'High';
  mitigation: string;
}

export interface ProjectStrategy {
  strategyName: string; 
  description: string;
  tools: Tool[];
  resourceAnalysis: ResourceAnalysis;
  budgetBreakdown: BudgetDetail[];
  teamRoles: TeamRole[]; 
  folderStructure: FileNode[];
}

// --- Success Path ---

export interface RoadmapStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface LearningResource {
  title: string;
  url: string;
  type: 'video' | 'doc';
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  concepts: string[];
  resources: LearningResource[];
  estimatedEffort: string;
}

export interface RoadmapPhase {
  phaseName: string;
  nodes: RoadmapNode[];
}

// --- Implementation Blueprint ---

export interface CodeFile {
  fileName: string;
  language: string;
  content: string;
  description: string;
  buildSteps: string[]; // New: "How to Build This" steps
}

export interface StarterKit {
  installCommand: string; // New: e.g. "npm install react"
  setupScript: string;    // New: shell script to create folders
  files: CodeFile[];
}

export interface ProjectBlueprint {
  projectName: string;
  projectDomain: string;
  complexitySummary: string;
  estimatedDuration: string;
  resumeTip: string; 
  dataFlow: string[]; // New: ["User", "React", "API"]
  risks: ProjectRisk[];
  strategies: {
    recommended: ProjectStrategy;
    alternative: ProjectStrategy;
  };
  successPath: RoadmapPhase[];
  simpleRoadmapFallback: RoadmapStep[];
}

export interface UserInput {
  description: string;
  projectType: string;
  difficulty: string;
  timeConstraint: string;
  teamSize: number;       
  projectGoal: 'Deep Learning' | 'Rapid MVP'; 
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}