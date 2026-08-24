import React from "react";
import type { AgentSkill } from "@/types";
import { Plus, Trash2, Check } from "lucide-react";

export interface AgentSkillsCatalogProps {
  skills: AgentSkill[];
  loading: boolean;
  onInstallSkill: (skill: AgentSkill) => Promise<void>;
  onRemoveSkill: (skillId: string) => Promise<void>;
}

const STARTER_RECIPES: AgentSkill[] = [
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
    <div className="agent-face agent-skills">
      <div className="agent-skills__scroll">
        <div className="agent-skills__column">
          <section className="agent-skills__section">
            <header className="agent-skills__section-head">
              <h3 className="agent-skills__title">Skills</h3>
              <p className="agent-skills__hint">
                Tools and instructions the agent can use.
              </p>
            </header>

            {skills.length === 0 ? (
              <div className="agent-skills__empty">
                No custom skills currently attached to this agent.
              </div>
            ) : (
              <div className="agent-skills__list">
                {skills.map((skill) => (
                  <div key={skill.id} className="agent-skills__row">
                    <div className="agent-skills__row-copy">
                      <strong>{skill.name}</strong>
                      <small>{skill.description}</small>
                    </div>
                    <button
                      className="chrome-button chrome-button--danger"
                      disabled={loading}
                      onClick={() => onRemoveSkill(skill.id)}
                      title="Remove skill"
                      type="button"
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="agent-skills__section">
            <header className="agent-skills__section-head">
              <h3 className="agent-skills__title">Available starter recipes</h3>
            </header>

            <div className="starter-grid">
              {STARTER_RECIPES.map((recipe) => {
                const isInstalled = installedIds.has(recipe.id);
                return (
                  <div key={recipe.id} className="starter-card">
                    <div className="starter-card__info">
                      <h4>{recipe.name}</h4>
                      <p>{recipe.description}</p>
                    </div>
                    <button
                      className={isInstalled ? "secondary-button" : "primary-button"}
                      disabled={isInstalled || loading}
                      onClick={() => onInstallSkill({ ...recipe, installed: true })}
                      type="button"
                    >
                      {isInstalled ? <><Check size={12} /> Installed</> : <><Plus size={12} /> Install</>}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
