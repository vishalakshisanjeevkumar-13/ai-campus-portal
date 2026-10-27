import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";

export const Documents = () => {
  const { documents, addDocument } = useApp();
  const [docType, setDocType] = useState("Resume");
  const [uploadStatus, setUploadStatus] = useState("idle"); // 'idle' | 'uploading' | 'processing' | 'completed'
  const [fileName, setFileName] = useState("");
  const [extractedInfo, setExtractedInfo] = useState(null);

  const handleSimulatedUpload = (e) => {
    e.preventDefault();
    const mockFileName = fileName.trim() || `Alex_Morgan_${docType}_${Date.now().toString().slice(-4)}.pdf`;
    
    setUploadStatus("uploading");
    setTimeout(() => {
      setUploadStatus("processing");
      setTimeout(() => {
        setUploadStatus("completed");
        const parsed = {
          name: mockFileName,
          type: docType,
          size: "420 KB",
          uploadDate: new Date().toISOString().split("T")[0],
          status: "Processed",
          extractedData: docType === "Resume"
            ? { matchScore: "72%", keySkillsFound: 16, projectsIdentified: 3, detectedRole: "Software Developer" }
            : docType === "Marksheet"
            ? { semester: "6th", sgpa: "8.1", creditsVerified: 24, backlogs: 0 }
            : { credentialTitle: "Verified Certificate", issuer: "Accredited Platform", score: "Top 10%" }
        };
        setExtractedInfo(parsed);
        addDocument(parsed);
      }, 1200);
    }, 1000);
  };

  const handleReset = () => {
    setUploadStatus("idle");
    setFileName("");
    setExtractedInfo(null);
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Document Intelligence</h1>
          <p className="page-subtitle">Upload resumes, transcripts, marks sheets, and certificates for automated knowledge synthesis.</p>
        </div>
      </div>

      <div className="grid grid-2 gap-6 mb-8">
        {/* Upload Zone Card */}
        <Card
          title="Upload Student Artifacts"
          subtitle="Supports PDF, DOCX, and JPG formats"
        >
          {uploadStatus === "idle" && (
            <form onSubmit={handleSimulatedUpload}>
              <div className="form-group mb-4">
                <label className="form-label">Document Classification</label>
                <select
                  className="form-input"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <option value="Resume">Resume / CV</option>
                  <option value="Marksheet">Semester Marksheet / Transcript</option>
                  <option value="Certificate">Technical Certification</option>
                  <option value="Project Document">Project SRS / Architecture Document</option>
                </select>
              </div>

              <div className="form-group mb-4">
                <label className="form-label">File Label (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex_Morgan_Software_Engineer_Resume.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>

              {/* Styled Drag & Drop Box */}
              <div
                className="p-8 text-center border rounded-lg mb-4"
                style={{
                  border: "2px dashed var(--primary)",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--background-alt)",
                  cursor: "pointer"
                }}
                onClick={handleSimulatedUpload}
              >
                <Icon name="upload" size={40} color="var(--primary)" className="mx-auto mb-2" />
                <div className="font-bold text-sm text-primary mb-1">Click to browse or drop file here</div>
                <div className="text-xs text-muted">Max file size: 15MB • Structured Parser Ready</div>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                <Icon name="upload" size={16} /> Process & Synthesize Document
              </button>
            </form>
          )}

          {uploadStatus === "uploading" && (
            <div className="p-8 text-center animate-fade-in">
              <Icon name="refresh" size={36} color="var(--primary)" className="mx-auto mb-3 animate-spin" />
              <h3 className="font-bold text-sm mb-1">Uploading document...</h3>
              <p className="text-xs text-muted">Securing document in encrypted campus data vault.</p>
            </div>
          )}

          {uploadStatus === "processing" && (
            <div className="p-8 text-center animate-fade-in">
              <Icon name="cpu" size={36} color="var(--secondary)" className="mx-auto mb-3 animate-spin" />
              <h3 className="font-bold text-sm mb-1">Synthesizing metadata & extracting skills...</h3>
              <p className="text-xs text-muted">Mapping keywords to Software Developer ontology...</p>
            </div>
          )}

          {uploadStatus === "completed" && extractedInfo && (
            <div className="p-4 bg-alt border rounded animate-fade-in">
              <div className="flex items-center gap-2 text-success font-bold text-sm mb-3">
                <Icon name="check-circle" size={18} />
                Document Processed Successfully!
              </div>

              <div className="p-3 bg-surface border rounded text-xs mb-4">
                <div className="font-semibold text-primary mb-1">{extractedInfo.name}</div>
                <div className="text-muted">Type: {extractedInfo.type} • Uploaded: {extractedInfo.uploadDate}</div>
              </div>

              <div className="p-3 bg-alt border rounded mb-4">
                <span className="text-xs font-bold text-muted uppercase">Extracted Intelligence Summary</span>
                <pre className="text-xs font-mono text-primary mt-1" style={{ whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(extractedInfo.extractedData, null, 2)}
                </pre>
              </div>

              <button className="btn btn-secondary btn-sm btn-block" onClick={handleReset}>
                Upload Another Document
              </button>
            </div>
          )}
        </Card>

        {/* Processed Documents List */}
        <Card
          title="Document Vault"
          subtitle="Indexed repository feeding your Digital Twin intelligence"
        >
          <div className="flex flex-col gap-3">
            {documents.map((doc) => (
              <div key={doc.id} className="p-3 bg-alt border rounded flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface border rounded text-primary">
                    <Icon name="documents" size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-primary">{doc.name}</div>
                    <div className="text-xs text-muted">
                      {doc.type} • {doc.size} • {doc.uploadDate}
                    </div>
                  </div>
                </div>

                <Badge variant="success">PROCESSED</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
