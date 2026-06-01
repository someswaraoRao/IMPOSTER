-- Create Database
CREATE DATABASE IF NOT EXISTS imposter_hunt;
USE imposter_hunt;

-- 1. users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. rooms table
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_code VARCHAR(10) NOT NULL UNIQUE,
    host_id INT NOT NULL,
    status ENUM('waiting', 'playing', 'finished') DEFAULT 'waiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. room_players table
CREATE TABLE room_players (
    room_id INT NOT NULL,
    user_id INT NOT NULL,
    is_ready BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (room_id, user_id),
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. games table
CREATE TABLE games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    imposter_id INT,
    winner ENUM('imposter', 'crewmates', 'draw') NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (imposter_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. rounds table
CREATE TABLE rounds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    round_number INT NOT NULL,
    word VARCHAR(100),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- 6. clues table
CREATE TABLE clues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    round_id INT NOT NULL,
    user_id INT NOT NULL,
    clue_text VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (round_id) REFERENCES rounds(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. votes table
CREATE TABLE votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    round_id INT NOT NULL,
    voter_id INT NOT NULL,
    voted_for_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (round_id) REFERENCES rounds(id) ON DELETE CASCADE,
    FOREIGN KEY (voter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (voted_for_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. chat_messages table
CREATE TABLE chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. achievements table
CREATE TABLE achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon_url VARCHAR(255)
);

-- Insert Default Achievements
INSERT INTO achievements (name, description) VALUES 
('First Win', 'Win your first game.'),
('Master Imposter', 'Win 10 games as an imposter.'),
('Sherlock', 'Successfully vote out the imposter 5 times.');

-- 10. user_achievements table
CREATE TABLE user_achievements (
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

-- 11. leaderboard table (updated by application logic)
CREATE TABLE leaderboard (
    user_id INT PRIMARY KEY,
    games_played INT DEFAULT 0,
    games_won INT DEFAULT 0,
    imposter_wins INT DEFAULT 0,
    crewmate_wins INT DEFAULT 0,
    score INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 12. game_history table
CREATE TABLE game_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    role ENUM('imposter', 'crewmate') NOT NULL,
    result ENUM('win', 'loss', 'draw') NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_room_code ON rooms(room_code);
CREATE INDEX idx_game_room ON games(room_id);
CREATE INDEX idx_round_game ON rounds(game_id);
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);

-- 13. word_pairs table
CREATE TABLE word_pairs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    innocent_word VARCHAR(100) NOT NULL,
    imposter_word VARCHAR(100) NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL
);

-- 14. cpu_clues table
CREATE TABLE cpu_clues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    clue VARCHAR(100) NOT NULL,
    INDEX idx_cpu_clues_word (word)
);
