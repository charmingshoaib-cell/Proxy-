# Multi-Drive Agentic IDE Plan

This plan expands the [Agentic IDE Transformation](file:///C:/Users/shoaib/.gemini/antigravity/brain/351af12b-c82a-40bc-ba4c-500c38970059/implementation_plan.md) to include multi-drive support as requested by the user.

## User Review Required

> [!IMPORTANT]
> This plan will change how the backend resolves file paths. It moves from a single `WORKSPACE_ROOT` to a **Multi-Root** system that supports multiple drives (C:, G:, H:) and cloud storage (OneDrive).

## Proposed Changes

### 1. Backend: Multi-Root Support
#### [MODIFY] [server.js](file:///c:/Users/shoaib/.gemini/antigravity/scratch/gemini-devtool-suite/server.js)
- Maintain a list of registered `Roots`:
  - `project`: Current project directory
  - `c-drive`: `C:\`
  - `g-drive`: `G:\`
  - `h-drive`: `H:\`
  - `onedrive`: `C:\Users\shoaib\OneDrive`
  - `home`: `C:\Users\shoaib` (Tentative "hp")
- Update `/api/files/list`, `/api/files/read`, and `/api/files/write` to accept a `rootId` parameter.
- Ensure the `path.resolve` logic uses the selected root.

### 2. Frontend: Drive Switcher
#### [MODIFY] [WorkspaceExplorer.tsx](file:///c:/Users/shoaib/.gemini/antigravity/scratch/gemini-devtool-suite/components/WorkspaceExplorer.tsx)
- Add a "Drive Bar" or Dropdown to select the active Root.
- Clear file list when switching roots.
- Update `fetchFiles` to send the `selectedRootId`.

### 3. Unified Editor Integration
#### [MODIFY] [FileEditor.tsx](file:///c:/Users/shoaib/.gemini/antigravity/scratch/gemini-devtool-suite/components/FileEditor.tsx)
- Pass `rootId` to the editor so it can save files back to the correct drive.

## Open Questions

> [!IMPORTANT]
> 1. Does "hp" refer to your whole home folder (`C:\Users\shoaib`) or a specific folder named `hp`?
> 2. Should we automatically detect all available drives on startup, or stick to this specific list (C, G, H)?

## Verification Plan

### Manual Verification
1. **Drive Switching**: Switch to G: drive -> verify file list -> switch back to Project -> verify file list.
2. **OneDrive Access**: Open a file from OneDrive in the editor -> edit -> save -> verify it updated on disk.
3. **Security Check**: Ensure paths don't "escape" their assigned root incorrectly if passed a relative path.
