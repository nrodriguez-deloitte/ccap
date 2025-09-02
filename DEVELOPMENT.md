# Jira Dashboard Forge App - Development Guide

## 🚀 Quick Start

To get started with your Jira Dashboard Forge app, follow these steps:

### 1. Prerequisites
- Node.js 18+ installed
- Atlassian Developer Account
- Access to a Jira Cloud instance

### 2. Authentication
Before you can deploy or test your app, authenticate with Atlassian:

```bash
forge login
```

This will open a browser window where you can log in with your Atlassian account.

### 3. Development Workflow

#### Deploy and Install
```bash
# Deploy the app to Atlassian cloud
forge deploy

# Install the app on your Jira site
forge install
```

#### Development Mode
```bash
# Start development server with live reload
forge tunnel
```

This command starts a development server that allows you to make changes to your code and see them reflected immediately in your Jira instance.

### 4. Accessing Your Dashboard

Once installed, you can access your dashboard in Jira:
1. Navigate to your Jira Cloud instance
2. Go to "Apps" in the top navigation
3. Look for "Dashboard" in the apps menu

## 📊 Dashboard Features

Your Jira Dashboard includes:

- **Project Metrics**: Overview of project health and progress
- **Issue Analytics**: Breakdown by status, priority, and assignee
- **Sprint Progress**: Current sprint burndown and velocity tracking
- **Team Performance**: Individual and team productivity metrics
- **Real-time Updates**: Live data that refreshes automatically

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Deploy to Atlassian cloud
npm run deploy

# Install app on Jira site
npm run install-app

# Run linting
npm run lint

# Run tests
npm test
```

## 📁 Project Structure

```
src/
├── frontend/              # React UI components
│   ├── index.jsx         # Main dashboard component
│   └── components/       # Individual dashboard widgets
└── backend/              # Forge functions
    └── index.js         # API handlers and data fetching
```

## 🔧 Customization

### Adding New Widgets
1. Create a new component in `src/frontend/components/`
2. Import and use it in the main dashboard (`src/frontend/index.jsx`)
3. Add corresponding data fetching logic in `src/backend/index.js`

### Modifying Data Sources
- Edit `src/backend/index.js` to change how data is fetched from Jira
- The current implementation includes both mock data and real Jira API integration patterns

### Styling and Layout
- UI Kit components follow Atlassian Design System
- Use the Grid and Box components for responsive layouts
- StatusLozenge, Badge, and ProgressBar for visual indicators

## 🔑 Permissions and Scopes

Your app has the following permissions in `manifest.yml`:
- `read:jira-work` - Read Jira issues, projects, and work items
- `read:jira-user` - Read user information
- `storage:app` - Store app configuration and cache data

## 🐛 Troubleshooting

### Common Issues

1. **"Not logged in" error**
   ```bash
   forge login
   ```

2. **Permission denied**
   - Check your API token has appropriate scopes
   - Verify you have admin access to the Jira site

3. **App not appearing in Jira**
   - Ensure `forge install` completed successfully
   - Check that you're looking in the correct Jira site
   - Verify the app is enabled in Jira admin settings

4. **Tunnel connection issues**
   ```bash
   forge tunnel --verbose
   ```

### Getting Help
- [Forge Documentation](https://developer.atlassian.com/platform/forge/)
- [UI Kit Reference](https://developer.atlassian.com/platform/forge/ui-kit/)
- [Community Forum](https://community.developer.atlassian.com/)

## 📈 Next Steps

1. **Authenticate** with `forge login`
2. **Deploy** your app with `forge deploy`
3. **Install** on your Jira site with `forge install`
4. **Start developing** with `forge tunnel`

Your dashboard is ready to be customized and extended with additional features!
