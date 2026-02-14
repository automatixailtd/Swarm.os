
export enum AgentStatus {
  IDLE = 'IDLE',
  WORKING = 'WORKING',
  DELEGATING = 'DELEGATING',
  LEARNING = 'LEARNING',
  ERROR = 'ERROR'
}

export interface ExternalEndpoint {
  url: string;
  model: string;
  apiKey?: string;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

export interface MCPResource {
  uri: string;
  name: string;
  mimeType?: string;
}

export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: any[];
}

export interface MCPServer {
  id: string;
  name: string;
  url: string;
  type: 'LOCAL' | 'REMOTE' | 'SSE';
  status: 'CONNECTED' | 'DISCONNECTED' | 'INITIALIZING';
  tools: MCPTool[];
  resources: MCPResource[];
  prompts: MCPPrompt[];
  version: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  version: string;
}

export interface WorkflowStep {
  id: string;
  agentRole: string;
  action: string;
  order: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED';
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  capabilities: string[];
  memory: string[];
  tasksAssigned: number;
  lastActive: string;
  intelligenceScore: number;
  learningRate: number;
  protocols: ('ACP' | 'MCP' | 'A2A' | 'ADK' | 'A2UI' | 'OPENAI')[];
  endpointConfig?: ExternalEndpoint;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  progress: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  protocol: 'ACP' | 'MCP' | 'A2A' | 'OPENAI';
}

export interface LogEntry {
  timestamp: string;
  source: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'A2A' | 'ACP' | 'ADK' | 'A2UI' | 'OPENAI';
}
