CREATE TABLE IF NOT EXISTS qualia_packets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  anchor_ref TEXT NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  qualia_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'provisional',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  qualia_packet_id INTEGER NOT NULL,
  target_id TEXT NOT NULL,
  result TEXT NOT NULL,
  observation_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (qualia_packet_id) REFERENCES qualia_packets(id)
);

CREATE INDEX IF NOT EXISTS idx_qualia_anchor ON qualia_packets(anchor_ref);
CREATE INDEX IF NOT EXISTS idx_qualia_status ON qualia_packets(status);
