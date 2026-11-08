CREATE TABLE IF NOT EXISTS support_queries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(32) NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(40) NULL,
  query_type VARCHAR(80) NULL,
  message TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'new',
  email_sent TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_support_queries_type (type),
  KEY idx_support_queries_status (status),
  KEY idx_support_queries_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
