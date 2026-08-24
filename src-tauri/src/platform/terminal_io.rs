// Windows ConPTY terminal I/O module
pub struct ConPtySession {
    pub session_id: String,
    pub cols: u16,
    pub rows: u16,
}

impl ConPtySession {
    pub fn new(session_id: String, cols: u16, rows: u16) -> Self {
        Self { session_id, cols, rows }
    }

    pub fn resize(&mut self, cols: u16, rows: u16) {
        self.cols = cols;
        self.rows = rows;
    }
}
