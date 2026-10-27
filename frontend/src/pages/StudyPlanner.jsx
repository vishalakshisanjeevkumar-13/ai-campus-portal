import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Modal } from "../components/Modal";

export const StudyPlanner = () => {
  const { weeklyTasks, completeTask, skipTask, rescheduleTask, setActivePage } = useApp();
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [reschedulingTask, setReschedulingTask] = useState(null);
  const [targetDay, setTargetDay] = useState("Tuesday");

  const handleOpenReschedule = (task) => {
    setReschedulingTask(task);
    setTargetDay(daysOfWeek.find(d => d !== task.day) || "Tuesday");
  };

  const handleConfirmReschedule = () => {
    if (reschedulingTask && targetDay) {
      rescheduleTask(reschedulingTask.id, targetDay);
      setReschedulingTask(null);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Adaptive Study Planner</h1>
          <p className="page-subtitle">Dynamic weekly schedule that auto-rebalances whenever you skip or complete study blocks.</p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage("dashboard")}
          >
            <Icon name="dashboard" size={16} />
            Dashboard
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

      {/* Day Selector Tabs */}
      <div className="filter-tabs-row mb-6">
        {daysOfWeek.map((day) => {
          const tasksForDay = weeklyTasks.filter(t => t.day === day);
          const hasPending = tasksForDay.some(t => !t.completed);
          return (
            <button
              key={day}
              className={`filter-tab-btn ${selectedDay === day ? "active" : ""}`}
              onClick={() => setSelectedDay(day)}
            >
              {day} ({tasksForDay.length}) {hasPending && "•"}
            </button>
          );
        })}
      </div>

      {/* 7-Day Grid Overview or Selected Day View */}
      <div className="grid grid-2 gap-4">
        {/* Selected Day's Focus Card */}
        <Card
          title={`Focus Schedule: ${selectedDay}`}
          subtitle="Execute tasks or skip to allow autonomous rebalancing"
        >
          <div className="flex flex-col gap-3">
            {weeklyTasks.filter(t => t.day === selectedDay).length === 0 ? (
              <div className="p-8 text-center text-muted bg-alt border rounded">
                <Icon name="check-circle" size={32} color="var(--success)" className="mx-auto mb-2" />
                <p className="font-semibold text-primary">No tasks scheduled for {selectedDay}!</p>
                <p className="text-xs text-muted">Enjoy your rest day or rebalance tasks from another day.</p>
              </div>
            ) : (
              weeklyTasks
                .filter(t => t.day === selectedDay)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`task-item-card ${task.completed ? "completed" : ""}`}
                  >
                    <div className="task-left-section">
                      <button
                        className={`task-checkbox-btn ${task.completed ? "checked" : ""}`}
                        onClick={() => completeTask(task.id)}
                        disabled={task.completed}
                      >
                        {task.completed && <Icon name="check" size={14} />}
                      </button>

                      <div className="task-content-info">
                        <span className={`task-title-text ${task.completed ? "strikethrough" : ""}`}>
                          {task.title}
                        </span>
                        <div className="task-meta-row">
                          <span>{task.duration}</span>
                          <span>•</span>
                          <span>{task.category}</span>
                          <span>•</span>
                          <Badge variant={task.priority} className="text-xs">{task.priority}</Badge>
                          {task.status.includes("Rescheduled") && (
                            <span className="text-xs text-warning font-semibold">(Adapted)</span>
                          )}
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
                            title="Skip and auto-reschedule to keep balance"
                          >
                            Skip
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenReschedule(task)}
                            title="Manually move task"
                          >
                            Move
                          </button>
                        </>
                      ) : (
                        <span className="badge badge-success">Done</span>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </Card>

        {/* Weekly Full Digest */}
        <Card
          title="7-Day Micro-Task Distribution"
          subtitle="Adaptive intelligence rebalances loads evenly across your available 18 hrs/week"
        >
          <div className="flex flex-col gap-2">
            {daysOfWeek.map((day) => {
              const dayTasks = weeklyTasks.filter(t => t.day === day);
              const doneTasks = dayTasks.filter(t => t.completed);
              return (
                <div
                  key={day}
                  className={`p-3 border rounded flex items-center justify-between cursor-pointer ${selectedDay === day ? "bg-primary-light border-primary" : "bg-alt"}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <div>
                    <span className="text-sm font-bold text-primary">{day}</span>
                    <div className="text-xs text-muted">
                      {dayTasks.length === 0
                        ? "Rest day"
                        : `${doneTasks.length} / ${dayTasks.length} Completed`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {dayTasks.map(t => (
                      <span
                        key={t.id}
                        className={`w-2.5 h-2.5 rounded-full ${t.completed ? "bg-success" : "bg-primary"}`}
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: t.completed ? "var(--success)" : "var(--primary)"
                        }}
                        title={`${t.title} (${t.duration})`}
                      />
                    ))}
                    <Icon name="chevron-right" size={14} color="var(--text-muted)" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Manual Reschedule Modal */}
      {reschedulingTask && (
        <Modal
          isOpen={!!reschedulingTask}
          onClose={() => setReschedulingTask(null)}
          title={`Reschedule: ${reschedulingTask.title}`}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setReschedulingTask(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmReschedule}>
                Confirm Move
              </button>
            </>
          }
        >
          <p className="text-sm text-secondary mb-4">
            Currently scheduled for <strong>{reschedulingTask.day}</strong>. Select the new day for this {reschedulingTask.duration} session:
          </p>

          <div className="form-group">
            <label className="form-label">Move To Day</label>
            <select
              className="form-input"
              value={targetDay}
              onChange={(e) => setTargetDay(e.target.value)}
            >
              {daysOfWeek.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
};
