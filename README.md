# 🗳️ Hyperledger Fabric Voting Network

This repository contains the full setup for a **blockchain-based digital voting network** built with **Hyperledger Fabric**. It supports secure, auditable voting for institutions such as universities, organizations, or government bodies.

---

## 📦 Project Structure


---

## ⚙️ How to Run the Network

### Prerequisites:
- Docker & Docker Compose
- Hyperledger Fabric binaries (`configtxgen`, `cryptogen`)
- Node.js (for chaincode if JS-based)

### 1. Generate Crypto Materials
```bash
cryptogen generate --config=crypto-config.yaml
