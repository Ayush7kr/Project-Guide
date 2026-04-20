
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
  marketInsight: string; // New: Job market demand metric
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

export interface Skill {
  name: string;
  demand: string;
}

export interface TeamRole {
  title: string;
  focus: string;
  keyTasks: string[];
  skills: Skill[];
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

export interface TradeOff {
  toolName: string;
  reasonExcluded: string;
}

export interface ProjectStrategy {
  strategyName: string; 
  description: string;
  tools: Tool[];
  resourceAnalysis: ResourceAnalysis;
  budgetBreakdown: BudgetDetail[];
  teamRoles: TeamRole[]; 
  folderStructure: FileNode[];
  tradeOffs: TradeOff[];
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
  completed?: boolean;
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
  buildSteps: string[];
}

export interface CommonError {
  error: string;
  fix: string;
}

export interface StarterKit {
  installCommand: string;
  setupScript: string;
  readme: string;
  dependencies: string;
  dependencyFileName: string;
  envFile: string; // New: .env template
  commonErrors: CommonError[]; // New: Debugging tips
  files: CodeFile[];
}

// --- Deep Research ---

export interface DeepResearchReport {
  competitors: Array<{
    name: string;
    description: string;
  }>;
  technicalEdge: Array<{
    feature: string;
    whyItMatters: string;
  }>;
  monetizationStrategies: Array<{
    model: string;
    description: string;
  }>;
  summary: string;
}

export interface ProjectBlueprint {
  projectName: string;
  projectDomain: string;
  complexitySummary: string;
  estimatedDuration: string;
  resumeTip: string; 
  dataFlow: string[]; 
  risks: ProjectRisk[];
  strategies: {
    recommended: ProjectStrategy;
    alternative: ProjectStrategy;
  };
  successPath: RoadmapPhase[];
  simpleRoadmapFallback: RoadmapStep[];
  deepResearch?: DeepResearchReport; // Optional cached research
}

export interface SavedProject {
  id: string;
  created_at: string;
  name: string;
  description: string;
  blueprint_data: ProjectBlueprint;
  user_id: string;
}

export interface UserInput {
  description: string;
  projectType: string;
  customProjectType?: string; // New: For 'Other' input
  difficulty: string;
  timeConstraint: string;
  customTimeConstraint?: string; // New: For 'Other' input
  teamSize: number;       
  projectGoal: 'Deep Learning' | 'Rapid MVP'; 
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
