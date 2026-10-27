import React from "react";
import { Icon } from "./Icons";
import { Badge } from "./Badge";
import { useApp } from "../context/AppContext";

export const TaskCard = ({ task, showDay = false }) => {
  const { completeTask, skipTask } = useApp();

  return (
    <div className={`task-item-card ${task.completed ? "completed" : ""}`}>
      <div className="task-left-section">
        <button
          className={`task-checkbox-btn ${task.completed ? "checked" : ""}`}
          onClick={() => completeTask(task.id)}
          aria-label={task.completed ? "Completed" : "Mark complete"}
          disabled={task.completed}
        >
          {task.completed && <Icon name="check" size={14} />}
        </button>

        <div className="task-content-info">
          <span className={`task-title-text ${task.completed ? "strikethrough" : ""}`}>
            {task.title}
          </span>
          <div className="task-meta-row">
            {showDay && <span className="font-semibold text-primary">{task.day}</span>}
            <span>{task.duration}</span>
            <span>•</span>
            <span>{task.category}</span>
            <span>•</span>
            <Badge variant={task.priority} className="text-xs">{task.priority}</Badge>
          </div>
        </div>
      </div>

      <div className="task-action-btns">
        {!task.completed ? (
          <>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => completeTask(task.id)}
            >
              Complete
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => skipTask(task.id)}
              title="Skip & rebalance study plan"
            >
              Skip
            </button>
          </>
        ) : (
          <span className="badge badge-success">Done</span>
        )}
      </div>
    </div>
  );
};
