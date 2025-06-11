
--- User table
CREATE TABLE user (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "role" INTEGER NOT NULL CHECK ( role IN ('admin', 'user')) DEFAULT 'user',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--- Monitoring servers
CREATE TABLE server (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    timeout INTEGER NOT NULL DEFAULT 10, --- seconds
    interval INTEGER NOT NULL DEFAULT 60, --- seconds
    
    last_seen_status_code INTEGER,
    last_seen_reason INTEGER,

    is_turned_on INTEGER NOT NULL CHECK (is_turned_on IN (1, 0)) DEFAULT 0, --- 0 for off
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES user ("id") ON DELETE CASCADE
);

--- Notifiers
CREATE TABLE notifier (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    server_id INTEGER NOT NULL,
    "provider" TEXT NOT NULL, --- notifier provider, e.g telegram, discord, bitrix24, etc.
    credentials TEXT NOT NULL, --- notifier credentials in JSON, e.g bot token for telegram, discord webhook url, etc.
    format TEXT NOT NULL, --- format in hjs to format the log line
    active INTEGER NOT NULL CHECK(active IN (1, 0)) DEFAULT 1, --- 0 for off 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY("user_id") REFERENCES user ("id") ON DELETE CASCADE,
    FOREIGN KEY ("server_id") REFERENCES server ("id") ON DELETE CASCADE
);

--- Server request logs, could be useful for the user itself
CREATE TABLE server_log (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER NOT NULL,
    failed INTEGER NOT NULL CHECK (failed IN (1, 0)) DEFAULT 0, --- if this log represents failed request, 0 for failed, 1 for success
    status_code INTEGER NOT NULL,
    body TEXT, --- Body of the sent request, if any
    reason TEXT, --- Reason of failure, if any
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, --- no updated_at, we don't need to update log lines :)
    FOREIGN KEY ("server_id") REFERENCES server ("id") ON DELETE CASCADE
);

--- User actions log, could be useful when multiple people using the same user, or for admin :)
CREATE TABLE user_action_log (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    "action" TEXT NOT NULL, --- Type of the action performed by user. Not made with CHECK to not alter the table on action add
    action_entity INTEGER, --- Database ID of the entity action performed on, if any
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES user ("id") ON DELETE CASCADE
)