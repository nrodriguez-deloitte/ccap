# Jira Dashboard - Forge App

A comprehensive dashboard application for Jira built with Atlassian Forge platform.

## Overview

This Forge app provides a powerful dashboard interface for Jira that displays:
- Project metrics and KPIs
- Issue statistics and trends
- Team performance analytics
- Real-time data visualization
- Custom reports and insights

## Prerequisites

Before you can develop and deploy this app, you need:

1. **Atlassian Developer Account**: Sign up at [developer.atlassian.com](https://developer.atlassian.com)
2. **Forge CLI**: Already installed via `npm install -g @forge/cli`
3. **Jira Cloud Site**: Access to a Jira Cloud instance for testing
4. **API Token** (optional): Only needed for CI/CD or corporate environments - get from [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)

## Setup Instructions

### 1. Authenticate with Forge CLI

First, you need to log in to your Atlassian account:

```bash
# Login with your Atlassian account (opens browser for OAuth)
forge login
```

**Authentication Methods:**

**Option 1: Browser Login (Recommended)**
- Run `forge login` 
- Browser opens automatically for OAuth authentication
- No manual token management required

**Option 2: API Token (Corporate/CI environments)**
If you're behind a corporate firewall or in CI/CD, you can use environment variables:

```bash
# Set environment variables (get token from https://id.atlassian.com/manage-profile/security/api-tokens)
export FORGE_EMAIL=your-email@example.com
export FORGE_API_TOKEN=your-api-token

# Then run forge commands normally
forge deploy
```

**Where to get API Token:**
1. Go to [https://id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a name (e.g., "Forge Development")
4. Copy the generated token

### 2. Install Dependencies

```bash
npm install
```

### 3. Deploy the App

```bash
# Deploy to development environment
forge deploy

# Install the app on your Jira site
forge install
```

### 4. Development Mode

```bash
# Start development with live reloading
forge tunnel
```

## Project Structure

```
├── src/
│   ├── frontend/          # UI Kit components
│   │   ├── index.jsx      # Main dashboard component
│   │   ├── components/    # Reusable UI components
│   │   └── hooks/         # Custom React hooks
│   ├── backend/           # Forge functions
│   │   ├── index.js       # API handlers
│   │   └── resolvers/     # Data resolvers
│   └── static/            # Static assets
├── manifest.yml           # App configuration
├── package.json           # Dependencies
└── README.md              # This file
```

## Features

### Dashboard Components
- **Project Overview**: High-level project metrics
- **Issue Analytics**: Breakdown by status, priority, assignee
- **Sprint Progress**: Current sprint burndown and velocity
- **Team Performance**: Individual and team productivity metrics
- **Custom Charts**: Configurable data visualizations

### Technical Features
- **Real-time Updates**: Live data using Forge events
- **Responsive Design**: Works on desktop and mobile
- **Customizable**: User-configurable dashboard widgets
- **Secure**: Built on Atlassian's secure Forge platform

## Development

### Adding New Components

1. Create new UI components in `src/frontend/components/`
2. Add data fetching logic in `src/backend/resolvers/`
3. Update the manifest.yml if adding new permissions
4. Test with `forge tunnel`

### API Integration

The app uses Jira REST API to fetch data:
- Issues and projects
- Users and teams
- Custom fields
- Agile boards and sprints

## Deployment

### Development Environment
```bash
forge deploy --environment development
```

### Production Environment
```bash
forge deploy --environment production
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Ensure you're logged in with `forge login`
2. **Permission Errors**: Check your API token has appropriate scopes
3. **Build Errors**: Run `npm install` to ensure dependencies are installed
4. **Tunnel Issues**: Try `forge tunnel --verbose` for detailed logs

### Getting Help

- [Forge Documentation](https://developer.atlassian.com/platform/forge/)
- [UI Kit Components](https://developer.atlassian.com/platform/forge/ui-kit/)
- [Community Support](https://community.developer.atlassian.com/)

## License

This project is licensed under the MIT License.
