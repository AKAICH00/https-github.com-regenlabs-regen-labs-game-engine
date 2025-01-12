# Development Setup

## Environment
- Node.js: v23.6.0 (Note: Project requires Node.js 18.x)
- npm: 10.2.4

## Services

### Game Server (Vite)
- Port: 5173
- Network URLs:
  - Local: http://localhost:5173/
  - Network: http://192.168.4.151:5173/
  - Network: http://192.168.4.148:5173/
  - Network: http://10.211.55.2:5173/
  - Network: http://10.37.129.2:5173/

### Ngrok Configuration
- Permanent URL: probable-electric-redfish.ngrok-free.app
- Status: Configured in Doppler as LOCAL_GAME_URL

### Backend Server
- Port: 8080
- Environment: Using Doppler for configuration
- Local Mode: Started with --local flag to use ngrok URL

## Current Issues
1. Node Version Mismatch
   - Current: v23.6.0
   - Required: v18.x
   - Impact: Warnings but functional

2. Ngrok Connection
   - ERR_NGROK_3200: Tunnel not found
   - ERR_NGROK_108: Limited to 1 simultaneous session
   - Solution: Need to use permanent URL configuration

3. Vite Configuration
   - Warning: Could not auto-determine entry point
   - Network Exposure: Requires --host flag

## Development Flow
1. Start Game Server:
   ```bash
   cd games/soltap/game
   npm run dev -- --host
   ```

2. Start Backend:
   ```bash
   cd backend
   doppler run -- node server.js --local
   ```

## Environment Variables
- LOCAL_GAME_URL: probable-electric-redfish.ngrok-free.app
- Other variables managed through Doppler

## Notes
- Free ngrok account limitations: 1 simultaneous session
- Game requires proper network exposure for Telegram integration
- Backend uses MongoDB for data storage
