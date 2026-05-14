#!/bin/bash
set -e

echo "Cleaning..."
rm -rf node_modules dist .next

echo "Installing..."
npm install --legacy-peer-deps

echo "Building..."
npm run build

echo "Done!"
