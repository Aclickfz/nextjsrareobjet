ALTER TABLE users
  ADD COLUMN email_verified_at DATETIME NULL,
  ADD COLUMN session_version INT NOT NULL DEFAULT 0;

-- Email verification is required. Versioned sessions invalidate old sessions.
CREATE TABLE IF NOT EXISTS auth_tokens (
  token_hash CHAR(64) PRIMARY KEY,
  user_id INT NOT NULL,
  purpose ENUM('verify', 'reset') NOT NULL,
  expires_at DATETIME NOT NULL,
  INDEX idx_auth_tokens_user (user_id, purpose),
  INDEX idx_auth_tokens_expiry (expires_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS auth_rate_limits (
  bucket_key CHAR(64) PRIMARY KEY,
  attempts INT NOT NULL DEFAULT 1,
  expires_at DATETIME NOT NULL,
  INDEX idx_auth_rate_expiry (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
