-- Criação da tabela para guardar as denúncias/relatos anónimos
CREATE TABLE IF NOT EXISTS denuncias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) DEFAULT 'Anónimo',
    categoria VARCHAR(50) NOT NULL,
    faixa_etaria VARCHAR(20),
    descricao TEXT NOT NULL,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela para guardar a contagem dos votos da enquete
CREATE TABLE IF NOT EXISTS enquete_votos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(50) NOT NULL UNIQUE,
    votos INT DEFAULT 0
);

-- Inserção dos valores iniciais das categorias da enquete a 0
INSERT INTO enquete_votos (categoria, votos) VALUES
    ('racismo', 0),
    ('bullying', 0),
    ('cyberbullying', 0),
    ('exclusao', 0),
    ('nenhuma', 0)
ON DUPLICATE KEY UPDATE categoria=categoria;