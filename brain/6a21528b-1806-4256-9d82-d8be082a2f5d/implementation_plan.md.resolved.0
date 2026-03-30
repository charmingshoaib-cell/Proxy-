# Implementation Plan - Stabilize the Agentic IDE

The goal of this plan is to resolve the massive performance and noise issue caused by a misplaced Git repository in your home directory and to fix the configuration errors in your MCP servers.

## User Review Required

> [!IMPORTANT]
> **Git Cleanup**: I will remove the `.git` folder from `C:\Users\shoaib`. This folder is mistakenly tracking 10,000+ files in your home profile, causing performance issues. Please confirm that you do NOT need a git repository at exactly `C:\Users\shoaib\.git` (usually dotfiles or home-directory-wide versioning).

> [!NOTE]
> **MCP Configuration**: The GitKraken MCP requires a Personal Access Token (PAT). I will provide instructions to generate and input this. For Cloud SQL, I'll need to run a Google Auth command.

## Proposed Changes

### [Git Cleanup]

#### [DELETE] [.git](file:///C:/Users/shoaib/.git)
Remove the `.git` folder from the home directory to stop VS Code from tracking your entire user profile.

---

### [MCP Server Configuration]

#### [Cloud SQL SQLServer Admin]
Run `gcloud auth application-default login` to resolve the "could not find default credentials" error.

#### [Figma Dev Mode]
Investigate the `ECONNREFUSED` error. This usually means the Figma API bridge or the dev server on port 3845 is not running. 
1. Check if the Figma Desktop app is open and connected to the dev-mode-mcp-server.
2. Verify its settings.

#### [GitKraken MCP]
1. [NEW] Go to GitHub Settings > Developer Settings > Personal Access Tokens.
2. Generate a new token with `repo` scope.
3. Paste the token into the prompt shown in the screenshot.

---

## Open Questions

> [!IMPORTANT]
> 1. Did you intentionally initialize a git repository in `C:\Users\shoaib`? If so, should I instead create a `.gitignore` that excludes everything except specific projects? (Recommendation: Delete it, as it's tracking too much system data).
> 2. For the Figma MCP, are you currently running the Figma dev server locally?

## Verification Plan

### Automated Tests
- `git status` should return "not a git repository" (or equivalent) in `C:\Users\shoaib`.
- MCP server logs should show successful connections.

### Manual Verification
- Confirm that the "10000+ changes" in the VS Code sidebar have disappeared.
- Confirm that the errors in the Agent panel (right side) are gone.
