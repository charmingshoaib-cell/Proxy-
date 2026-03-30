const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3005;
const WORKSPACE_ROOT = path.resolve(__dirname, '..'); 
const HISTORY_FILE = path.resolve(__dirname, 'chat_history.json');
const GAMBLER_DATA = path.join(process.env.APPDATA || '', 'Gambler.Bot');

const ROOTS = {
    'project': path.resolve(__dirname, '..'),
    'c': 'C:/',
    'g': 'G:/',
    'h': 'H:/',
    'onedrive': path.join(process.env.USERPROFILE || 'C:/Users/shoaib', 'OneDrive').replace(/\\/g, '/'),
    'hp': (process.env.USERPROFILE || 'C:/Users/shoaib').replace(/\\/g, '/')
};

const runningProcesses = new Map();

console.log(`[AGENT SERVER] Roots Configured:`, Object.keys(ROOTS));

// --- Gambler.Bot API ---
app.post('/api/gambler/deploy', async (req, res) => {
    const { language, content } = req.body;
    const extensions = { 'lua': 'lua', 'javascript': 'js', 'python': 'py', 'csharp': 'cs' };
    const ext = extensions[language.toLowerCase()] || 'lua';
    const targetPath = path.join(GAMBLER_DATA, `default.${ext}`);

    try {
        await fs.promises.mkdir(GAMBLER_DATA, { recursive: true });
        await fs.promises.writeFile(targetPath, content, 'utf8');
        console.log(`[AGENT] Strategy deployed to Gambler.Bot: ${targetPath}`);
        res.json({ success: true, path: targetPath });
    } catch (err) {
        res.status(500).json({ error: `Failed to deploy strategy: ${err.message}` });
    }
});

// --- Terminal API ---
app.post('/api/terminal', (req, res) => {
    const { command, cwd } = req.body;
    if (!command) return res.status(400).json({ error: 'No command provided' });

    console.log(`[AGENT] Executing: ${command}`);
    const processId = Math.random().toString(36).substring(7);
    
    const child = exec(command, { cwd: cwd || WORKSPACE_ROOT }, (error, stdout, stderr) => {
        runningProcesses.delete(processId);
        res.json({
            stdout: stdout || '',
            stderr: stderr || '',
            error: error ? error.message : null,
            processId
        });
    });

    runningProcesses.set(processId, child);
});

app.post('/api/terminal/kill', (req, res) => {
    const { processId } = req.body;
    const child = runningProcesses.get(processId);
    if (child) {
        child.kill();
        runningProcesses.delete(processId);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Process not found' });
    }
});

// --- File Automation API ---
app.get('/api/roots', (req, res) => {
    res.json(Object.keys(ROOTS).map(id => ({ id, path: ROOTS[id] })));
});

app.post('/api/files/write', async (req, res) => {
    const { path: filePath, content, rootId } = req.body;
    if (!filePath) return res.status(400).json({ error: 'No path provided' });
    
    const rootPath = ROOTS[rootId || 'project'] || ROOTS.project;
    try {
        const fullPath = path.resolve(rootPath, filePath);
        // Safety check (can be bypassed for C:/ but we block sensitive stuff generally)
        if (!fullPath.startsWith(rootPath) && rootId === 'project') {
             return res.status(403).json({ error: 'Access denied: path outside workspace' });
        }

        await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.promises.writeFile(fullPath, content || '');
        console.log(`[AGENT] File written: ${fullPath}`);
        res.json({ success: true, path: filePath });
    } catch (err) {
        res.status(500).json({ error: `Failed to write file: ${err.message}` });
    }
});

app.get('/api/files/read', async (req, res) => {
    const { path: filePath, rootId } = req.query;
    if (!filePath) return res.status(400).json({ error: 'No path provided' });

    const rootPath = ROOTS[rootId || 'project'] || ROOTS.project;
    try {
        const fullPath = path.resolve(rootPath, filePath);
        if (!fs.existsSync(fullPath)) return res.status(404).json({ error: 'File not found' });
        
        const content = await fs.promises.readFile(fullPath, 'utf-8');
        res.json({ content });
    } catch (err) {
        res.status(500).json({ error: `Failed to read file: ${err.message}` });
    }
});

app.get('/api/files/list', async (req, res) => {
    const { path: dirPath, rootId } = req.query;
    const rootPath = ROOTS[rootId || 'project'] || ROOTS.project;
    const targetDir = dirPath ? path.resolve(rootPath, dirPath) : rootPath;

    try {
        if (!fs.existsSync(targetDir)) return res.json([]);
        const files = await fs.promises.readdir(targetDir, { withFileTypes: true });
        const result = files
            .filter(file => !['node_modules', '.git', 'dist', '.next'].includes(file.name))
            .map(file => ({
                name: file.name,
                isDir: file.isDirectory(),
                path: path.relative(rootPath, path.join(targetDir, file.name)).replace(/\\/g, '/')
            }));
        res.json(result);
    } catch (err) {
        console.error(`[AGENT] Failed to list directory: ${err.message}`);
        res.status(500).json({ error: `Failed to list directory: ${err.message}` });
    }
});

// --- Chat History API ---
app.get('/api/history', async (req, res) => {
    try {
        if (fs.existsSync(HISTORY_FILE)) {
            const data = await fs.promises.readFile(HISTORY_FILE, 'utf8');
            res.json(JSON.parse(data));
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to load chat history' });
    }
});

app.post('/api/history', async (req, res) => {
    try {
        await fs.promises.writeFile(HISTORY_FILE, JSON.stringify(req.body, null, 2), 'utf8');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save chat history' });
    }
});

app.listen(PORT, () => {
    console.log(`[AGENT SERVER] Running at http://localhost:${PORT}`);
    console.log(`- Terminal: /api/terminal`);
    console.log(`- Files: /api/files/write, /api/files/read, /api/files/list`);
    console.log(`- History: /api/history`);
});
