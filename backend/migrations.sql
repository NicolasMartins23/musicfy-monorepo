use musicfy;

-- 1. Criar a tabela de Artistas primeiro (independente)
CREATE TABLE `artist` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 2. Criar a tabela de Álbuns (depende de artist)
CREATE TABLE `album` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `artist_id` BIGINT NOT NULL,
    `release_date` DATE NOT NULL,
    CONSTRAINT `fk_album_artist` 
        FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 3. Criar a tabela de Músicas (depende de album)
CREATE TABLE `song` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `position` INT UNSIGNED NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `is_single` BOOLEAN NOT NULL,
    `duration_seconds` INT UNSIGNED NOT NULL, -- Recomendado: Duração em segundos
    `album_id` BIGINT NOT NULL,
    CONSTRAINT `fk_song_album` 
        FOREIGN KEY (`album_id`) REFERENCES `album` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `chk_song_position` CHECK (`position` >= 0)
) ENGINE=InnoDB;