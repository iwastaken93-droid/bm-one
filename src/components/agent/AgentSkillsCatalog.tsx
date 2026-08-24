import React from "react";
import type { AgentSkill } from "@/types";
import { Wrench, CheckCircle, Plus, Trash2 } from "lucide-react";

export interface AgentSkillsCatalogProps {
  skills: AgentSkill[];
  loading: boolean;
  onInstallSkill: (skill: AgentSkill) => Promise<void>;
  onRemoveSkill: (skillId: string) => Promise<void>;
}

const STARTER_SKILLS: AgentSkill[] = [
  {
    id: "web-search",
    name: "Web Search & Fetch",
    description: "Search the live web and download external documentation or API schemas.",
    installed: false
  },
  {
    id: "git-tools",
    name: "Git Repository Operations",
    description: "Inspect branches, unstaged diffs, commits, and resolve merge conflicts.",
    installed: false
  },
  {
    id: "ast-grep",
    name: "AST Structural Code Search",
    description: "Perform syntax-aware structural pattern matching across TypeScript and Rust files.",
    installed: false
  }
];

export function AgentSkillsCatalog({ skills, loading, onInstallSkill, onRemoveSkill }: AgentSkillsCatalogProps) {
  const installedIds = new Set(skills.map(s => s.id));

  return (
    <div className="agent-skills">
      <div className="agent-skills__header">
        <h3>Installed Capabilities ({skills.length})</h3>
      </div>

      {skills.length === 0 ? (
        <div className="agent-skills__empty">No custom skills currently attached to this agent.</div>
      ) : (
        <div className="agent-skills__list">
          {skills.map((skill) => (
            <div key={skill.id} className="agent-skills__item">
              <div className="agent-skills__item-info">
                <div className="agent-skills__item-name">
                  <Wrench size={14} />
                  <span>{skill.name}</span>
                </div>
                <p className="agent-skills__item-desc">{skill.description}</p>
              </div>
              <button
                className="chrome-button chrome-button--danger"
                disabled={loading}
                onClick={() => onRemoveSkill(skill.id)}
                title="Remove skill"
                type="button"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="agent-skills__header" style={{ marginTop: 24 }}>
        <h3>Available Starter Packs</h3>
      </div>
      <div className="agent-skills__grid">
        {STARTER_SKILLS.map((starter) => {
          const isInstalled = installedIds.has(starter.id);
          return (
            <div key={starter.id} className="agent-skills__card">
              <div className="agent-skills__card-title">
                <span>{starter.name}</span>
                {isInstalled && <CheckCircle size={14} className="text-green" />}
              </div>
              <p className="agent-skills__card-desc">{starter.description}</p>
              <button
                className={isInstalled ? "secondary-button" : "primary-button"}
                disabled={isInstalled || loading}
                onClick={() => onInstallSkill({ ...starter, installed: true })}
                type="button"
              >
                {isInstalled ? "Installed" : <><Plus size={13} /> Install</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
