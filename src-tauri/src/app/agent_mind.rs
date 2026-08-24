use rusqlite::{Connection, Result};
use std::path::Path;

pub struct AgentMindStore {
    conn: Connection,
}

impl AgentMindStore {
    pub fn open<P: AsRef<Path>>(path: P) -> Result<Self> {
        let conn = Connection::open(path)?;
        // High-performance WAL mode
        conn.execute_batch(
            "PRAGMA journal_mode = WAL;
             PRAGMA foreign_keys = ON;
             PRAGMA synchronous = NORMAL;",
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS agent_mind (
                agent_id TEXT PRIMARY KEY,
                memory TEXT NOT NULL,
                user_context TEXT NOT NULL,
                updated_at INTEGER NOT NULL
            );",
            [],
        )?;

        Ok(Self { conn })
    }

    pub fn save_memory(&self, agent_id: &str, memory: &str, user_context: &str) -> Result<()> {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as i64;

        self.conn.execute(
            "INSERT INTO agent_mind (agent_id, memory, user_context, updated_at)
             VALUES (?1, ?2, ?3, ?4)
             ON CONFLICT(agent_id) DO UPDATE SET
                memory = excluded.memory,
                user_context = excluded.user_context,
                updated_at = excluded.updated_at;",
            (agent_id, memory, user_context, now),
        )?;
        Ok(())
    }
}
