// src/services/api.ts

const API_BASE_URL = "http://localhost:8000/api/v1";


export interface InvestigationResponse {
  investigation_id: string;
  original_filename: string;
  platform: string;
  pipeline_version: string;
  deep_analysis: boolean;

  started_at: string;
  completed_at: string;

  pipeline_stages: {
    metadata_extraction: string;
    visual_analysis: string;
    ai_report_generation: string;
  };

  metadata: Record<string, any>;

  visual_analysis: Record<string, any>;

  ai_report: Record<string, any>;

  verdict: {
    authenticity_score: number | null;
    risk_level: string | null;
    key_signals: string[];
    summary: string | null;
  };
}


/**
 * Upload image and run TruthLens investigation
 */
export async function investigateImage(
  file: File,
  deepAnalysis: boolean = false
): Promise<InvestigationResponse> {

  const formData = new FormData();

  formData.append("file", file);


  const response = await fetch(
    `${API_BASE_URL}/investigate?deep_analysis=${deepAnalysis}`,
    {
      method: "POST",
      body: formData,
    }
  );


  if (!response.ok) {

    let message = "Investigation failed";

    try {
      const error = await response.json();

      message =
        error.detail ||
        message;

    } catch {
      // ignore JSON parse errors
    }


    throw new Error(message);
  }


  return await response.json();
}


/**
 * Fetch previous report by ID
 */
export async function getReport(
  investigationId: string
) {

  const response = await fetch(
    `${API_BASE_URL}/report/${investigationId}`
  );


  if (!response.ok) {
    throw new Error(
      "Unable to fetch report"
    );
  }


  return response.json();
}


/**
 * Get all investigations
 */
export async function getReports() {

  const response = await fetch(
    `${API_BASE_URL}/reports`
  );


  if (!response.ok) {
    throw new Error(
      "Unable to fetch reports"
    );
  }


  return response.json();
}