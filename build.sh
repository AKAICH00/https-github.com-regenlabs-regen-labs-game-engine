#!/bin/bash
echo "Building without TypeScript checks..."
NODE_ENV=production vite build
