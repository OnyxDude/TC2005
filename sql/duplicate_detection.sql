-- Table for registering potential duplicates
CREATE TABLE IF NOT EXISTS potential_duplicates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_song_id INT NOT NULL,
    duplicate_song_id INT NOT NULL,
    similarity_score DECIMAL(5,2) DEFAULT 0,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    resolution_notes TEXT,
    FOREIGN KEY (original_song_id) REFERENCES canciones(id),
    FOREIGN KEY (duplicate_song_id) REFERENCES canciones(id)
);

-- Create admin_alerts table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    reference_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

-- Trigger for detecting duplicates
DELIMITER //
CREATE TRIGGER IF NOT EXISTS detect_duplicates
AFTER INSERT ON canciones
FOR EACH ROW
BEGIN
    -- Insert potential duplicates based on similarity
    INSERT INTO potential_duplicates (original_song_id, duplicate_song_id, similarity_score)
    SELECT id, NEW.id,
    -- Simple similarity calculation based on name and artist
    (CASE
        WHEN LOWER(titulo) = LOWER(NEW.titulo) THEN 70
        WHEN SOUNDEX(titulo) = SOUNDEX(NEW.titulo) THEN 50
        ELSE 30
    END +
    CASE
        WHEN LOWER(artista) = LOWER(NEW.artista) THEN 30
        ELSE 0
    END) AS similarity
    FROM canciones
    WHERE id != NEW.id
    AND (
        LOWER(titulo) = LOWER(NEW.titulo)
        OR SOUNDEX(titulo) = SOUNDEX(NEW.titulo)
    )
    HAVING similarity >= 70; -- Only report if similarity is high

    -- Create alert for high similarity matches
    IF EXISTS (
        SELECT 1 FROM potential_duplicates
        WHERE duplicate_song_id = NEW.id
        AND similarity_score >= 90
    ) THEN
        -- Insert an alert for administrators
        INSERT INTO admin_alerts (message, alert_type, reference_id)
        VALUES (
            CONCAT('Posible canción duplicada detectada: "', NEW.titulo, '"'),
            'DUPLICATE_CONTENT',
            NEW.id
        );
    END IF;
END//
DELIMITER ;
