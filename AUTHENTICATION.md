# Forge Authentication Guide

## Quick Start (Recommended)

For most developers, use the browser-based authentication:

```bash
forge login
```

This opens your browser and uses OAuth - no manual token management needed!

## API Token Method (Advanced)

Use this method if:
- You're behind a corporate firewall
- Setting up CI/CD pipelines
- Browser authentication doesn't work

### Step 1: Generate API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a name: "Forge Development"
4. Copy the generated token

### Step 2: Set Environment Variables

**For current session:**
```bash
export FORGE_EMAIL=your-email@example.com
export FORGE_API_TOKEN=your-api-token-here
```

**For permanent setup (add to ~/.zshrc or ~/.bash_profile):**
```bash
echo 'export FORGE_EMAIL=your-email@example.com' >> ~/.zshrc
echo 'export FORGE_API_TOKEN=your-api-token-here' >> ~/.zshrc
source ~/.zshrc
```

### Step 3: Verify Authentication

```bash
forge whoami
```

## Troubleshooting

### "Not logged in" Error
```bash
# Try browser login first
forge login

# If that fails, check environment variables
echo $FORGE_EMAIL
echo $FORGE_API_TOKEN

# Re-login with verbose output
forge login --verbose
```

### Corporate Network Issues
```bash
# Set proxy if needed
export HTTP_PROXY=http://your-proxy:port
export HTTPS_PROXY=http://your-proxy:port

# Use API token method instead of browser
export FORGE_EMAIL=your-email@example.com
export FORGE_API_TOKEN=your-api-token
```

### Token Permissions
Make sure your API token has these scopes:
- **Jira platform REST API**
- **Forge platform**

## Security Best Practices

1. **Never commit tokens to version control**
2. **Use environment variables for tokens**
3. **Rotate tokens regularly**
4. **Use browser login for development**
5. **Use API tokens only for automation**

## CI/CD Setup

For GitHub Actions, Bitbucket Pipelines, or other CI systems:

```yaml
# Example for GitHub Actions
env:
  FORGE_EMAIL: ${{ secrets.FORGE_EMAIL }}
  FORGE_API_TOKEN: ${{ secrets.FORGE_API_TOKEN }}
```

Store the email and token as encrypted secrets in your CI platform.
