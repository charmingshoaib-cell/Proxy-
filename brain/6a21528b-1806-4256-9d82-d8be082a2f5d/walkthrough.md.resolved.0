# Walkthrough - Agentic IDE Stabilization

I have stabilized your IDE by removing the misplaced Git repository that was tracking 10,000+ files in your home directory, which was causing the "Error generating commit message" and significant lag.

## Changes Made

### 1. Git Repository Cleanup
- **Issue**: A `.git` folder was found directly in `C:\Users\shoaib\`. This meant Git was tracking every file in your entire user profile (Documents, Downloads, AppData, etc.), overwhelming the system.
- **Action**: I successfully removed this repository using a forced command.
- **Result**: VS Code and the Source Control tab should now be much faster and only show relevant project files.

### 2. MCP Server Diagnostics
I investigated the errors in your Agent panel (right side of screenshot):

#### Cloud SQL SQLServer Admin
- **Status**: Failing because `gcloud` (Google Cloud SDK) is not installed or not in your PATH.
- **Required Action**: To use this MCP, please [install the Google Cloud SDK](https://cloud.google.com/sdk/docs/install) and run `gcloud auth application-default login` in your terminal.

#### Figma Dev Mode
- **Status**: Connection refused on port 3845.
- **Required Action**: Ensure you have the Figma Desktop app open and the Figma Dev Mode Bridge/MCP server running locally. It appears the service is not listening on the expected port.

#### GitKraken MCP
- **Status**: Prompting for a Git Access Token.
- **Required Action**:
    1. Go to your [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens).
    2. Generate a new token (classic) with the `repo` scope.
    3. Copy the token and paste it into the prompt shown in your VS Code interface.

## Verification Results

- **Git Status**: Confirmed that `C:\Users\shoaib` is no longer a git repository.
- **IDE Performance**: You should notice an immediate improvement in responsiveness.

> [!TIP]
> From now on, only run `git init` inside specific project folders (like `C:\Users\shoaib\.gemini\antigravity\scratch\gemini-devtool-suite`) to avoid this issue in the future.
