# Colombo International Bookfair - Stall Reservation System

A microservice-based platform for managing stall reservations at the Colombo International Bookfair. The system allows vendors to reserve stalls and employees to monitor bookings.

## Architecture

The system consists of three backend microservices and two frontend applications:

**Backend Services:**
- Auth Service (Port 3001) - Handles user registration, login, and JWT token management
- Stall Service (Port 3002) - Manages stall data and availability status
- Reservation Service (Port 3003) - Processes reservations, generates QR codes, and sends confirmation emails

**Frontend Applications:**
- Public UI (Port 4001) - Vendor-facing interface for browsing and reserving stalls
- Employee UI (Port 4002) - Staff dashboard for viewing all stalls and reservations

All services share a single PostgreSQL database with three tables: users, stalls, and reservations.

## Prerequisites

- Docker and Docker Compose installed on your machine
- Node.js 18+ (only if running services individually without Docker)

## Quick Start

1. Create a root directory for the project and navigate into it.
2. Create the project structure with all files as documented in the implementation guide.
3. Start the entire system using Docker Compose:

This command builds all services and starts them in the correct order.

## Access Points

Once all services are running, access the applications at:

- Public UI (Vendors): http://localhost:4001
- Employee UI: http://localhost:4002

## Service Ports Reference

| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL | 5432 | Database |
| Auth Service | 3001 | Authentication API |
| Stall Service | 3002 | Stall management API |
| Reservation Service | 3003 | Reservation API |
| Public UI | 4001 | Vendor interface |
| Employee UI | 4002 | Staff interface |

## Features

- User registration and login with JWT authentication
- Visual stall grid map (green = available, gray = reserved)
- Maximum 3 stalls per vendor reservation limit
- Automatic QR code generation for each reservation
- Email confirmation sent upon successful booking
- Role-based access control (VENDOR/EMPLOYEE)
- Employee dashboard showing all stalls and reservations

## Technologies

- Backend: Node.js, TypeScript, Express, PostgreSQL
- Frontend: React, TypeScript, React Router
- Infrastructure: Docker, Docker Compose
- Utilities: JWT, QRCode, Nodemailer

## Development

Individual services can be developed and run independently. Each service has its own package.json with development scripts. The docker-compose file includes volume mounts for hot-reloading during development.
