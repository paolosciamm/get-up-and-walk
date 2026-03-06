# Get Up and Walk - Guida al Deployment

Questa guida descrive i passaggi per rilasciare l'applicazione "Get Up and Walk" (backend Quarkus + frontend React) su macchine **Linux**, **macOS** e **Windows**.

---

## Indice

1. [Prerequisiti](#1-prerequisiti)
2. [Installazione prerequisiti per piattaforma](#2-installazione-prerequisiti-per-piattaforma)
3. [Build del Backend (Quarkus)](#3-build-del-backend-quarkus)
4. [Build del Frontend (React)](#4-build-del-frontend-react)
5. [Setup Database PostgreSQL](#5-setup-database-postgresql)
6. [Configurazione Ambiente di Produzione](#6-configurazione-ambiente-di-produzione)
7. [Avvio dell'applicazione](#7-avvio-dellapplicazione)
8. [Configurazione Nginx (reverse proxy)](#8-configurazione-nginx-reverse-proxy)
9. [Deployment con Docker](#9-deployment-con-docker)
10. [Servizio Systemd (Linux)](#10-servizio-systemd-linux)
11. [Note sulla sicurezza](#11-note-sulla-sicurezza)

---

## 1. Prerequisiti

| Software     | Versione minima | Note                                    |
|-------------|----------------|-----------------------------------------|
| Java (JDK)  | 17+            | Consigliato: Eclipse Temurin o Amazon Corretto |
| Node.js     | 18+            | Necessario solo per la build del frontend |
| npm          | 9+             | Incluso con Node.js                     |
| PostgreSQL   | 15+            | Database di produzione                  |
| Nginx        | 1.24+          | Opzionale: reverse proxy                |
| Docker       | 24+            | Opzionale: deployment containerizzato   |

---

## 2. Installazione prerequisiti per piattaforma

### Linux (Ubuntu/Debian)

```bash
# Java 21
sudo apt update
sudo apt install -y openjdk-21-jdk

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Nginx
sudo apt install -y nginx

# Verifiche
java -version
node --version
npm --version
psql --version
nginx -v
```

### Linux (CentOS/RHEL/Fedora)

```bash
# Java 21
sudo dnf install -y java-21-openjdk java-21-openjdk-devel

# Node.js 20 LTS
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# PostgreSQL
sudo dnf install -y postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl enable --now postgresql

# Nginx
sudo dnf install -y nginx
```

### macOS

```bash
# Installa Homebrew (se non presente)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Java 21
brew install openjdk@21
# Aggiungi al PATH:
echo 'export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Node.js
brew install node

# PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Nginx
brew install nginx

# Verifiche
java -version
node --version
psql --version
```

### Windows

```powershell
# Opzione 1: Usando Chocolatey (eseguire PowerShell come Amministratore)
# Installa Chocolatey:
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

choco install temurin21 -y
choco install nodejs-lts -y
choco install postgresql15 -y
choco install nginx -y

# Opzione 2: Usando Scoop
scoop install temurin21-jdk
scoop install nodejs
scoop install postgresql

# Opzione 3: Download manuali
# Java: https://adoptium.net/
# Node.js: https://nodejs.org/
# PostgreSQL: https://www.postgresql.org/download/windows/
```

---

## 3. Build del Backend (Quarkus)

### Clona il repository

```bash
git clone https://github.com/paolosciamm/get-up-and-walk.git
cd get-up-and-walk
```

### Build del JAR di produzione

```bash
cd backend

# Linux/macOS
./mvnw package -DskipTests -Dquarkus.package.jar.type=uber-jar

# Windows
mvnw.cmd package -DskipTests -Dquarkus.package.jar.type=uber-jar
```

Il file JAR viene generato in:
```
backend/target/backend-1.0.0-runner.jar
```

### Generare nuove chiavi RSA per la produzione

> **IMPORTANTE**: Non usare le chiavi di sviluppo in produzione. Genera una nuova coppia di chiavi.

```bash
openssl genrsa -out privateKey.pem 2048
openssl rsa -in privateKey.pem -pubout -out publicKey.pem
```

Posiziona i file `privateKey.pem` e `publicKey.pem` nella stessa directory del JAR o nella directory `config/` accanto al JAR.

---

## 4. Build del Frontend (React)

```bash
cd frontend

# Installa dipendenze
npm install

# Build di produzione
npm run build
```

Il risultato viene generato nella cartella:
```
frontend/dist/
```

Questa cartella contiene file statici (HTML, JS, CSS) pronti per essere serviti da Nginx o da qualsiasi web server statico.

---

## 5. Setup Database PostgreSQL

### Crea utente e database

```bash
# Linux/macOS - accedi come utente postgres
sudo -u postgres psql

# Windows - apri psql dal menu Start o PowerShell
psql -U postgres
```

Esegui i seguenti comandi SQL:

```sql
CREATE USER getupandwalk WITH PASSWORD 'la_tua_password_sicura';
CREATE DATABASE getupandwalk OWNER getupandwalk;
GRANT ALL PRIVILEGES ON DATABASE getupandwalk TO getupandwalk;
\q
```

### Verifica la connessione

```bash
psql -h localhost -U getupandwalk -d getupandwalk
# Inserisci la password quando richiesto
```

---

## 6. Configurazione Ambiente di Produzione

### Variabili d'ambiente

Prima di avviare il backend, configura le seguenti variabili d'ambiente:

```bash
# Linux/macOS
export DB_PASSWORD="la_tua_password_sicura"
export QUARKUS_PROFILE=prod

# Windows (PowerShell)
$env:DB_PASSWORD = "la_tua_password_sicura"
$env:QUARKUS_PROFILE = "prod"

# Windows (CMD)
set DB_PASSWORD=la_tua_password_sicura
set QUARKUS_PROFILE=prod
```

### Configurazione CORS per produzione

Modifica `backend/src/main/resources/application.properties` e aggiorna l'origin CORS:

```properties
%prod.quarkus.http.cors.origins=https://tuodominio.com
```

Poi ricompila il JAR con `./mvnw package -DskipTests -Dquarkus.package.jar.type=uber-jar`.

---

## 7. Avvio dell'applicazione

### Struttura directory sul server

```
/opt/getupandwalk/                # o qualsiasi percorso preferito
├── backend-1.0.0-runner.jar      # JAR del backend
├── config/
│   ├── application.properties    # Override di configurazione (opzionale)
│   ├── privateKey.pem
│   └── publicKey.pem
└── frontend/                     # Contenuto di frontend/dist/
    ├── index.html
    ├── assets/
    └── ...
```

### Avvio del backend

```bash
# Linux/macOS
cd /opt/getupandwalk
export DB_PASSWORD="la_tua_password_sicura"
java -jar backend-1.0.0-runner.jar

# Windows
cd C:\getupandwalk
set DB_PASSWORD=la_tua_password_sicura
java -jar backend-1.0.0-runner.jar
```

Il backend si avvia su `http://localhost:8080`.

### Opzioni JVM consigliate per produzione

```bash
java -Xms256m -Xmx512m \
     -Dquarkus.http.host=0.0.0.0 \
     -jar backend-1.0.0-runner.jar
```

---

## 8. Configurazione Nginx (reverse proxy)

### Linux

Crea il file `/etc/nginx/sites-available/getupandwalk`:

```nginx
server {
    listen 80;
    server_name tuodominio.com;

    # Frontend - file statici
    location / {
        root /opt/getupandwalk/frontend;
        try_files $uri $uri/ /index.html;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Backend API - reverse proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Disabilita cache per index.html
    location = /index.html {
        root /opt/getupandwalk/frontend;
        add_header Cache-Control "no-cache";
    }
}
```

Attiva il sito:

```bash
sudo ln -s /etc/nginx/sites-available/getupandwalk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### macOS

Modifica `/opt/homebrew/etc/nginx/nginx.conf` aggiungendo il blocco `server` sopra (o include da una cartella `servers/`).

```bash
brew services restart nginx
```

### Windows

Modifica `C:\nginx\conf\nginx.conf` aggiungendo il blocco `server`. Poi:

```powershell
cd C:\nginx
.\nginx.exe -s reload
```

### HTTPS con Let's Encrypt (Linux)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tuodominio.com
```

---

## 9. Deployment con Docker

### Dockerfile per il Backend

Crea `backend/Dockerfile`:

```dockerfile
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
COPY target/backend-1.0.0-runner.jar app.jar
COPY src/main/resources/privateKey.pem config/privateKey.pem
COPY src/main/resources/publicKey.pem config/publicKey.pem

EXPOSE 8080
ENV QUARKUS_PROFILE=prod

ENTRYPOINT ["java", "-Xms256m", "-Xmx512m", "-jar", "app.jar"]
```

### Dockerfile per il Frontend

Crea `frontend/Dockerfile`:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### docker-compose.yml

Crea `docker-compose.yml` nella root del progetto:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: getupandwalk
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: getupandwalk
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DB_PASSWORD: ${DB_PASSWORD}
      QUARKUS_DATASOURCE_JDBC_URL: jdbc:postgresql://db:5432/getupandwalk
    ports:
      - "8080:8080"
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  pgdata:
```

### Avvio con Docker Compose

```bash
# Crea un file .env con la password
echo "DB_PASSWORD=la_tua_password_sicura" > .env

# Build e avvio
docker compose up -d --build

# Verifica lo stato
docker compose ps

# Visualizza i log
docker compose logs -f

# Spegnimento
docker compose down
```

---

## 10. Servizio Systemd (Linux)

Crea `/etc/systemd/system/getupandwalk.service`:

```ini
[Unit]
Description=Get Up and Walk - Backend
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=getupandwalk
WorkingDirectory=/opt/getupandwalk
Environment=DB_PASSWORD=la_tua_password_sicura
Environment=QUARKUS_PROFILE=prod
ExecStart=/usr/bin/java -Xms256m -Xmx512m -jar /opt/getupandwalk/backend-1.0.0-runner.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Attiva e avvia il servizio:

```bash
# Crea utente di sistema
sudo useradd -r -s /bin/false getupandwalk

# Imposta permessi
sudo chown -R getupandwalk:getupandwalk /opt/getupandwalk

# Attiva il servizio
sudo systemctl daemon-reload
sudo systemctl enable getupandwalk
sudo systemctl start getupandwalk

# Verifica stato
sudo systemctl status getupandwalk

# Visualizza log
sudo journalctl -u getupandwalk -f
```

---

## 11. Note sulla sicurezza

1. **Chiavi RSA**: Genera SEMPRE nuove chiavi per l'ambiente di produzione. Non committare le chiavi di produzione nel repository.

2. **Password database**: Usa una password forte e unica. Non hardcodarla nei file di configurazione; usa variabili d'ambiente.

3. **HTTPS**: Configura SEMPRE HTTPS in produzione con un certificato SSL valido (Let's Encrypt e gratuito).

4. **CORS**: In produzione, limita le origini CORS al solo dominio effettivo dell'applicazione.

5. **Firewall**: Consenti solo le porte necessarie (80, 443). Blocca l'accesso diretto alla porta 8080 dall'esterno.

```bash
# Linux (ufw)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 8080/tcp
sudo ufw enable
```

6. **Aggiornamenti**: Mantieni aggiornati Java, Node.js, PostgreSQL e tutte le dipendenze del progetto.

---

## Riepilogo comandi rapidi

| Operazione                 | Comando                                                                 |
|---------------------------|-------------------------------------------------------------------------|
| Build backend             | `cd backend && ./mvnw package -DskipTests -Dquarkus.package.jar.type=uber-jar` |
| Build frontend            | `cd frontend && npm install && npm run build`                           |
| Avvio backend (dev)       | `cd backend && ./mvnw quarkus:dev`                                     |
| Avvio frontend (dev)      | `cd frontend && npm run dev`                                            |
| Avvio backend (prod)      | `java -jar backend-1.0.0-runner.jar`                                    |
| Docker build + avvio      | `docker compose up -d --build`                                          |
| Docker spegnimento        | `docker compose down`                                                   |
