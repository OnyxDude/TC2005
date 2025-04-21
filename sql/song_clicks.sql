-- Table for tracking song clicks
CREATE TABLE IF NOT EXISTS song_clicks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    song_id INT NOT NULL,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (song_id) REFERENCES canciones(id) ON DELETE CASCADE
);

-- Add click_count column to canciones table if it doesn't exist
ALTER TABLE canciones ADD COLUMN IF NOT EXISTS click_count INT DEFAULT 0;

-- Trigger to update click count in canciones table
DELIMITER //
CREATE TRIGGER IF NOT EXISTS update_click_count
AFTER INSERT ON song_clicks
FOR EACH ROW
BEGIN
    UPDATE canciones SET click_count = click_count + 1 WHERE id = NEW.song_id;
END//
DELIMITER ;
