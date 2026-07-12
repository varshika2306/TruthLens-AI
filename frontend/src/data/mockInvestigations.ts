import { Investigation } from "../types";

export const MOCK_INVESTIGATIONS: Investigation[] = [
  {
    id: "TL-8204",
    title: "Synthetic Politician Statement (Deepfake)",
    imageName: "presidential_briefing_leak.jpg",
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=800", // Official look
    status: "completed",
    riskScore: 92,
    authenticityScore: 8,
    confidence: 96,
    createdAt: "2026-07-06T14:22:15-07:00",
    metadata: {
      resolution: "3840 x 2160 (4K UHD)",
      fileSize: "1.42 MB",
      fileType: "JPEG",
      cameraModel: "Unknown (Missing Metadata)",
      lensModel: "Unknown (Missing Metadata)",
      software: "Inferred: Stable Diffusion XL / Roop Face Swap",
      gpsCoordinates: "None (Stripped)",
      timestamp: "2026-07-06 21:05:11 UTC (Stripped)",
      colorSpace: "sRGB (Standard Red Green Blue)"
    },
    visualFindings: [
      {
        id: "VF-1",
        category: "noise",
        title: "High-Frequency GAN Noise Pattern",
        description: "Fourier transform analysis reveals periodic checkerboard artifacts characteristic of Generative Adversarial Networks (GAN) upscaling.",
        severity: "high",
        confidence: 98
      },
      {
        id: "VF-2",
        category: "lighting",
        title: "Facial Landmark Lighting Discrepancy",
        description: "Illumination angle on the nasal bridge (120°) is mathematically inconsistent with the ambient background light source (45°).",
        severity: "high",
        confidence: 95
      },
      {
        id: "VF-3",
        category: "artifacts",
        title: "Pupil Asymmetry & Irregular Refraction",
        description: "Microscopic iris analysis indicates non-concentric pupil boundaries and symmetrical corneal light reflections, a common error in synthetic eye rendering.",
        severity: "medium",
        confidence: 88
      },
      {
        id: "VF-4",
        category: "compression",
        title: "Localized Compression Anomalies",
        description: "Error Level Analysis (ELA) exhibits highly concentrated error layers specifically around the mouth and eyes, suggesting post-process overlay.",
        severity: "high",
        confidence: 94
      }
    ],
    knowledgeBaseItems: [
      {
        id: "KB-101",
        title: "Facial Synthetics & GAN Signature Analysis",
        description: "Generative models produce systematic grid patterns in deep convolutional layers. These footprints show up as spectral peaks in the 2D Fourier power spectrum.",
        source: "IBM watsonx.ai Security Research Group (Ref: SD-2025-X)",
        confidence: 99,
        retrievedAt: "2026-07-06T14:22:16-07:00",
        category: "deepfake"
      },
      {
        id: "KB-102",
        title: "JPEG Quantization Discrepancy (Double Compression)",
        description: "When a fake segment is pasted onto an existing JPEG, it goes through a double-compression cycle. The secondary quantization table differs from the base matrix, creating detectable ELA peaks.",
        source: "Granite Forensics RAG Index / IEEE Signal Processing Library",
        confidence: 94,
        retrievedAt: "2026-07-06T14:22:16-07:00",
        category: "compression"
      },
      {
        id: "KB-103",
        title: "Biometric Inconsistencies in Deep Generative Media",
        description: "Synthetic media generators do not model detailed physiological optics correctly. Inconsistencies include lack of pulse-induced skin micro-color shifts and pupillary non-reactivity.",
        source: "DARPA MediFor Project Documentation Archive",
        confidence: 91,
        retrievedAt: "2026-07-06T14:22:17-07:00",
        category: "lighting"
      }
    ],
    graniteReasoning: {
      summary: "Comprehensive spectral and biometric analysis confirms that this image is a highly advanced synthetic manipulation. The face of the subject has been generated or swapped onto a standard briefing room backdrop using diffusion models. 92% risk assessment is driven by severe facial landmark light vector misalignment combined with telltale high-frequency synthetic noise structures.",
      evidence: [
        "Fourier spectral analysis peak at f_s = 0.34 indicating GAN lattice structure.",
        "Facial light vectors deviate by 75 degrees from background scene illumination.",
        "Total absence of standard camera metadata (EXIF/JFIF header blocks).",
        "Concentric eye-reflection analysis shows physically impossible light refraction paths."
      ],
      confidenceExplanation: "High confidence (96%) is established due to multi-spectral alignment. Both the geometric lighting vectors and the signal-processing compression analyses point to the exact same localized coordinates of manipulation (bounding box coordinates [x1: 420, y1: 180, x2: 680, y2: 440]).",
      recommendations: [
        "Flag file as highly synthetic/manipulated across media distribution protocols.",
        "Issue warning: Facial audio alignment should be cross-examined with physical acoustic signatures.",
        "Isolate face coordinates for deep facial-geometry reconstruction models."
      ]
    }
  },
  {
    id: "TL-7491",
    title: "Altered Wire Transfer Receipt",
    imageName: "swift_transaction_49811.png",
    imageUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=800", // Document look
    status: "completed",
    riskScore: 58,
    authenticityScore: 42,
    confidence: 89,
    createdAt: "2026-07-05T09:11:43-07:00",
    metadata: {
      resolution: "1920 x 1080 (Full HD)",
      fileSize: "482 KB",
      fileType: "PNG",
      cameraModel: "Software Renderer",
      lensModel: "N/A",
      software: "Adobe Photoshop 27.2 (Macintosh)",
      gpsCoordinates: "None",
      timestamp: "2026-07-05 16:08:12 UTC",
      colorSpace: "sRGB"
    },
    visualFindings: [
      {
        id: "VF-5",
        category: "compression",
        title: "Quantization Noise Mismatch",
        description: "The text block containing the amount '$10,400,000' shows a completely different compression density compared to the surrounding transaction fields.",
        severity: "high",
        confidence: 92
      },
      {
        id: "VF-6",
        category: "artifacts",
        title: "Font Boundary Anti-Aliasing Discrepancy",
        description: "Sub-pixel analysis reveals the modified numeric characters were rendered with Adobe Helvetica anti-aliasing, whereas the rest of the document uses standard terminal-mono rasterization.",
        severity: "medium",
        confidence: 85
      },
      {
        id: "VF-7",
        category: "noise",
        title: "Cloned Texture Patch Detected",
        description: "Background grain pattern matching (copy-paste search) reveals an exact 120x40 pixel clone from the empty header used to mask out the original transfer sum.",
        severity: "high",
        confidence: 90
      }
    ],
    knowledgeBaseItems: [
      {
        id: "KB-104",
        title: "Metadata Inconsistencies in Financial Instruments",
        description: "Original transaction logs are generated directly by automated backends as PDF/PNG with pristine metadata signatures. Software flags like 'Adobe Photoshop' are immediate anomalies.",
        source: "IBM Watson Financial Forensics Toolkit",
        confidence: 98,
        retrievedAt: "2026-07-05T09:11:44-07:00",
        category: "metadata"
      },
      {
        id: "KB-105",
        title: "Copy-Move Forgery Detection (CMFD)",
        description: "CMFD algorithms identify cloned regions within the same image by computing local keypoint descriptors (SIFT or SURF) and searching for close spatial correlation with matching vectors.",
        source: "Granite Forensics RAG / Journal of Forensic Sciences",
        confidence: 93,
        retrievedAt: "2026-07-05T09:11:45-07:00",
        category: "artifacts"
      }
    ],
    graniteReasoning: {
      summary: "This image contains localized manipulation designed to inflate the financial transaction amount. The original transaction numbers were masked using a clone-stamping process, and new numbers ($10,400,000) were overlayed using graphic software. This is confirmed by the 'Adobe Photoshop' metadata trace and sub-pixel alignment errors.",
      evidence: [
        "EXIF metadata explicitly contains edit trace: 'Adobe Photoshop 27.2 (Macintosh)'.",
        "Copy-move detector isolated matched noise patches in the document background.",
        "Sub-pixel edge alignment on the transaction value deviates from standard raster grids."
      ],
      confidenceExplanation: "Moderate-to-high confidence (89%) is validated because the metadata signature contains exact timestamps of the edit session matching the creation delay of the SWIFT receipt print.",
      recommendations: [
        "Request the original transaction payload directly in JSON or XML formats.",
        "Check ledger system for transaction reference number 'SWIFT-9821-49811' to verify actual records.",
        "Do not authorize payout or routing based on this document."
      ]
    }
  },
  {
    id: "TL-9011",
    title: "Drone Border Security Reconnaissance",
    imageName: "grid_sector_9b_recon.jpg",
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=800", // Landscape drone shot
    status: "completed",
    riskScore: 4,
    authenticityScore: 96,
    confidence: 98,
    createdAt: "2026-07-04T07:45:00-07:00",
    metadata: {
      resolution: "5280 x 3956",
      fileSize: "6.87 MB",
      fileType: "JPEG",
      cameraModel: "Hasselblad L2D-20c",
      lensModel: "DJI 24mm f/2.8",
      software: "Firmware v01.00.0400",
      gpsCoordinates: "48° 51' 24\" N, 2° 17' 41\" E (Valid Sector)",
      timestamp: "2026-07-04 14:41:22 UTC",
      colorSpace: "DCI-P3"
    },
    visualFindings: [
      {
        id: "VF-8",
        category: "noise",
        title: "Uniform Sensor Noise Floor",
        description: "The photo exhibits a highly uniform, unbroken sensor noise floor matching the Hasselblad L2D sensor profile at ISO 100.",
        severity: "low",
        confidence: 99
      },
      {
        id: "VF-9",
        category: "compression",
        title: "Single JPEG Compression Curve",
        description: "Viterbi distribution of DCT coefficients adheres exactly to a single quantization wave. No double-saving anomalies found.",
        severity: "low",
        confidence: 97
      },
      {
        id: "VF-10",
        category: "lighting",
        title: "Coherent Radiometric Gradient",
        description: "Shadow geometry and sky radiance map perfectly onto a sun position calculator based on the GPS coordinates and GMT timestamp.",
        severity: "low",
        confidence: 98
      }
    ],
    knowledgeBaseItems: [
      {
        id: "KB-106",
        title: "Camera Sensor Noise Fingerprints (PRNU)",
        description: "Photo-Response Non-Uniformity (PRNU) acts as an invisible physical sensor fingerprint. Authentic pictures show an unbroken PRNU coat that matches the lens and sensor specifications exactly.",
        source: "IEEE Transactions on Information Forensics and Security",
        confidence: 98,
        retrievedAt: "2026-07-04T07:45:02-07:00",
        category: "metadata"
      }
    ],
    graniteReasoning: {
      summary: "This image passes all digital forensics indicators with pristine markings. The sensor noise signature is perfectly uniform, lighting physics coordinate flawlessly with the recorded GPS and GMT time block, and there is no trace of double JPEG quantization or software layer manipulation. Authenticity is validated at 96%.",
      evidence: [
        "Unbroken Hasselblad sensor PRNU signature across all color channels.",
        "Perfect radiometric lighting vector correlation with solar elevation coordinates (34.2° elevation, 122.4° azimuth).",
        "Hardware-level EXIF tags and firmware markers are intact and unsigned."
      ],
      confidenceExplanation: "Very high confidence (98%) because all signal-processing, geometric, and metadata checks are perfectly aligned with natural photography indicators.",
      recommendations: [
        "Approved for ingestion into intelligence databases.",
        "No further forensics processing required.",
        "Log GPS and sensor hash as trust baseline."
      ]
    }
  }
];
