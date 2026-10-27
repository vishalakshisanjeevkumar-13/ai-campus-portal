import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { Modal } from "../components/Modal";
import { Badge } from "../components/Badge";

export const CompetencyMap = () => {
  const { competencyTree, setActivePage } = useApp();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Interactive Competency Map</h1>
          <p className="page-subtitle">Hierarchical skill graph connecting core computer science domains to target Software Developer proficiency.</p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage("skill-gap")}
          >
            <Icon name="skill-gap" size={16} />
            Skill Gap Matrix
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage("assessments")}
          >
            <Icon name="assessments" size={16} />
            Diagnostic Assessments
          </button>
        </div>
      </div>

      <div className="competency-canvas-container">
        {/* Zoom Controls */}
        <div className="competency-map-controls">
          <button className="btn btn-secondary btn-sm" onClick={handleZoomIn} title="Zoom In">
            <Icon name="sparkles" size={14} /> +
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleZoomOut} title="Zoom Out">
            -
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleResetZoom} title="Reset View">
            <Icon name="refresh" size={14} /> {Math.round(zoomLevel * 100)}%
          </button>
        </div>

        {/* Status Legend */}
        <div className="competency-legend">
          <div className="legend-item">
            <span className="legend-dot strong" />
            <span>Strong (&gt;75%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot moderate" />
            <span>Moderate (50-74%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot weak" />
            <span>Weak (&lt;50%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot missing" />
            <span>Missing / Prerequisite</span>
          </div>
        </div>

        {/* Visual Map Canvas Container with Zoom Transform */}
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center center",
            transition: "transform 0.25s ease",
            width: "100%",
            maxWidth: "1100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          {/* Central Role Hub */}
          <div className="central-role-node" onClick={() => setActivePage("skill-gap")}>
            <div className="text-xs uppercase tracking-widest opacity-80 mb-1">Target Intelligence Node</div>
            <div className="central-role-title">🧠 {competencyTree.role}</div>
            <div className="central-role-readiness">
              Role Readiness: <strong>{competencyTree.readiness}%</strong> (Benchmark: {competencyTree.required}%)
            </div>
          </div>

          {/* 4 Branches Grid */}
          <div className="competency-branches-grid">
            {competencyTree.branches.map((branch) => (
              <div key={branch.id} className="competency-branch-card">
                <div className="branch-card-header">
                  <span>{branch.name}</span>
                  <Badge variant={branch.status}>{branch.score}%</Badge>
                </div>

                <div className="branch-nodes-list">
                  {branch.nodes.map((node) => (
                    <button
                      key={node.id}
                      className="branch-subnode-btn"
                      onClick={() => setSelectedNode({ ...node, branchName: branch.name })}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`node-status-badge ${node.status}`} />
                        <span>{node.name}</span>
                      </span>
                      <span className="text-xs text-muted font-mono">{node.score}%</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Node Detail Modal */}
      {selectedNode && (
        <Modal
          isOpen={!!selectedNode}
          onClose={() => setSelectedNode(null)}
          title={`Competency Node: ${selectedNode.name}`}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setSelectedNode(null)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedNode(null);
                  setActivePage("learning-path");
                }}
              >
                Go to Learning Path
                <Icon name="arrow-right" size={16} />
              </button>
            </>
          }
        >
          <div className="flex items-center justify-between mb-4 p-3 bg-alt border rounded">
            <div>
              <span className="text-xs text-muted uppercase font-bold">Domain Branch</span>
              <div className="text-sm font-bold text-primary">{selectedNode.branchName}</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted uppercase font-bold">Status</span>
              <div>
                <Badge variant={selectedNode.status}>{selectedNode.status.toUpperCase()}</Badge>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-xs text-muted uppercase font-bold">Curriculum Topics Covered</span>
            <p className="text-sm font-semibold text-primary mt-1">{selectedNode.desc}</p>
          </div>

          <div className="evidence-metric-box">
            <span className="text-xs text-muted uppercase font-bold">Current Node Mastery</span>
            <div className="text-2xl font-bold text-primary">{selectedNode.score}%</div>
            <div className="text-xs text-secondary">
              {selectedNode.status === "strong"
                ? "Demonstrated high test accuracy & coding fluency."
                : selectedNode.status === "moderate"
                ? "Foundational understanding present; refine edge cases."
                : "Needs focused micro-learning and diagnostic drills."}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
