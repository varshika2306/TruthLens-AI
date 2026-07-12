export interface ImageMetadata {
  resolution: string;
  fileSize: string;
  fileType: string;
  cameraModel: string;
  lensModel: string;
  software: string;
  gpsCoordinates: string;
  timestamp: string;
  colorSpace: string;
}


export interface VisualFinding {
  id: string;
  category:
    | "noise"
    | "compression"
    | "lighting"
    | "artifacts";

  title: string;
  description: string;

  severity:
    | "low"
    | "medium"
    | "high";

  confidence: number;
}


export interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  source: string;
  confidence: number;
  retrievedAt: string;

  category:
    | "metadata"
    | "compression"
    | "lighting"
    | "deepfake"
    | "artifacts";
}


export interface GraniteReasoning {
  summary: string;
  evidence: string[];
  confidenceExplanation: string;
  recommendations: string[];
}


/*
|--------------------------------------------------------------------------
| REAL BACKEND RESPONSE TYPES
|--------------------------------------------------------------------------
*/


export interface PipelineStages {

  metadata_extraction: string;

  visual_analysis: string;

  ai_report_generation: string;
}


export interface BackendVerdict {

  authenticity_score: number | null;

  risk_level: string | null;

  key_signals: string[];

  summary: string | null;
}



export interface InvestigationResponse {

  investigation_id: string;

  original_filename: string;

  platform: string;

  pipeline_version: string;

  deep_analysis: boolean;


  started_at: string;

  completed_at: string;


  pipeline_stages: PipelineStages;


  metadata: Record<string, any>;


  visual_analysis: Record<string, any>;


  ai_report: Record<string, any>;


  verdict: BackendVerdict;
}



/*
|--------------------------------------------------------------------------
| FRONTEND NORMALIZED INVESTIGATION TYPE
|--------------------------------------------------------------------------
|
| Used by existing components.
| App.tsx will convert backend response
| into this format.
|
*/


export interface Investigation {

  id: string;

  title: string;

  imageUrl: string;

  imageName: string;


  status:
    | "completed"
    | "processing"
    | "failed";


  riskScore: number;


  authenticityScore: number;


  confidence: number;


  createdAt: string;


  metadata: ImageMetadata;


  visualFindings: VisualFinding[];


  knowledgeBaseItems: KnowledgeItem[];


  graniteReasoning: GraniteReasoning;
}



export interface ChatMessage {

  id: string;

  sender:
    | "user"
    | "assistant";

  text: string;

  timestamp: string;
}



export type ActiveTab =
  | "dashboard"
  | "investigate"
  | "history"
  | "knowledge"
  | "reports"
  | "settings";