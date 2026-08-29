use rusqlite::Connection;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::LazyLock;
use parking_lot::Mutex;
use sha2::{Digest, Sha256};

pub static DB: LazyLock<Mutex<StorageEngine>> = LazyLock::new(|| {
    Mutex::new(StorageEngine::init())
});

pub struct StorageEngine {
    pub conn: Connection,
    pub base_dir: PathBuf,
}

impl StorageEngine {
    pub fn init() -> Self {
        let appdata = std::env::var("APPDATA")
            .unwrap_or_else(|_| ".".to_string());
        let base_dir = Path::new(&appdata).join("BridgeMind One");
        let _ = fs::create_dir_all(&base_dir);

        let db_path = base_dir.join("bridgemind-one.sqlite3");
        let conn = Connection::open(&db_path).unwrap_or_else(|_| Connection::open_in_memory().unwrap());

        let engine = Self { conn, base_dir };
        engine.init_tables();
        engine
    }

    fn init_tables(&self) {
        let _ = self.conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS schema_migrations (
                version INTEGER PRIMARY KEY NOT NULL,
                applied_at_unix_ms INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS documents (
                key TEXT PRIMARY KEY NOT NULL,
                schema_version INTEGER NOT NULL CHECK (schema_version > 0),
                document_json TEXT NOT NULL,
                updated_at_unix_ms INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS agents (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                engine_json TEXT NOT NULL,
                purpose TEXT NOT NULL,
                created_at_unix_ms INTEGER NOT NULL,
                profile_schema_version INTEGER DEFAULT 1,
                profile_json TEXT DEFAULT '{}'
            );
            CREATE TABLE IF NOT EXISTS workspaces (
                id TEXT PRIMARY KEY NOT NULL,
                display_name TEXT NOT NULL,
                canonical_root TEXT NOT NULL UNIQUE,
                created_at_unix_ms INTEGER NOT NULL,
                last_opened_at_unix_ms INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS chat_threads (
                id TEXT PRIMARY KEY NOT NULL,
                profile_id TEXT,
                updated_at_unix_ms INTEGER NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS agent_routines (
                id TEXT PRIMARY KEY NOT NULL,
                agent_id TEXT NOT NULL,
                schema_version INTEGER NOT NULL,
                created_at_unix_ms INTEGER NOT NULL,
                next_run_at_unix_ms INTEGER NOT NULL,
                enabled INTEGER NOT NULL,
                payload TEXT NOT NULL
            );"
        );
    }

    pub fn compute_sha256(text: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(text.as_bytes());
        format!("{:x}", hasher.finalize())
    }

    pub fn get_agent_dir(&self, agent_id: &str) -> PathBuf {
        let dir = self.base_dir.join("agents").join(agent_id);
        let _ = fs::create_dir_all(&dir);
        let _ = fs::create_dir_all(dir.join("skills"));
        dir
    }

    pub fn read_agent_memory(&self, agent_id: &str) -> (String, String) {
        let dir = self.get_agent_dir(agent_id);
        let mem_path = dir.join("MEMORY.md");
        let content = if mem_path.exists() {
            fs::read_to_string(&mem_path).unwrap_or_else(|_| "You are BridgeMind One, an autonomous engineering intelligence.".to_string())
        } else {
            let default_mem = "You are BridgeMind One, an autonomous engineering intelligence.".to_string();
            let _ = fs::write(&mem_path, &default_mem);
            default_mem
        };
        let hash = Self::compute_sha256(&content);
        (content, hash)
    }

    pub fn read_user_notes(&self, agent_id: &str) -> (String, String) {
        let dir = self.get_agent_dir(agent_id);
        let user_path = dir.join("USER.md");
        let content = if user_path.exists() {
            fs::read_to_string(&user_path).unwrap_or_else(|_| "Lead Engineer\nPreferences: clean Rust, modern React, rigorous testing.".to_string())
        } else {
            let default_user = "Lead Engineer\nPreferences: clean Rust, modern React, rigorous testing.".to_string();
            let _ = fs::write(&user_path, &default_user);
            default_user
        };
        let hash = Self::compute_sha256(&content);
        (content, hash)
    }

    pub fn write_agent_memory(&self, agent_id: &str, text: &str) -> (String, String) {
        let dir = self.get_agent_dir(agent_id);
        let mem_path = dir.join("MEMORY.md");
        let _ = fs::write(&mem_path, text);
        let hash = Self::compute_sha256(text);
        (text.to_string(), hash)
    }

    pub fn write_user_notes(&self, agent_id: &str, text: &str) -> (String, String) {
        let dir = self.get_agent_dir(agent_id);
        let user_path = dir.join("USER.md");
        let _ = fs::write(&user_path, text);
        let hash = Self::compute_sha256(text);
        (text.to_string(), hash)
    }
}
