#!/bin/bash

# MSP ID for your org
export CORE_PEER_LOCALMSPID="Org1MSP"

# Path to your admin MSP (adjust if your user is different)
export CORE_PEER_MSPCONFIGPATH="/home/benricky/fabric-dev/voting-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp"

# Peer address (use the peer container's hostname + port, not localhost)
export CORE_PEER_ADDRESS="peer0.org1.example.com:7051"

# Enable TLS (since your Fabric network uses TLS)
export CORE_PEER_TLS_ENABLED=true

# Path to your peer TLS root cert (the CA cert used to sign peer TLS cert)
export CORE_PEER_TLS_ROOTCERT_FILE="/home/benricky/fabric-dev/voting-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"

# Fabric config path (where core.yaml or config files are located)
export FABRIC_CFG_PATH="/home/benricky/fabric-dev/voting-network/config"

# Optional: Docker host (make sure it’s correct; usually you don’t need to set this)
# export DOCKER_HOST=unix:///var/run/docker.sock

