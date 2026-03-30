# SETUP GUIDE: Gemini DevTool Suite

To get this developer toolkit fully operational, you need a Google Gemini API Key.

## 1. Obtain Your API Key
1. Go to the [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click on **"Get API key"** in the sidebar.
4. Click **"Create API key in new project"**.
5. Copy your new API key.

## 2. Configure the Project
1. Open the `.env` file in the root directory.
2. Update the `VITE_GEMINI_API_KEY` with your key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_key_here
   ```

## 3. Run the Development Server
If you have Node.js installed, run:
```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## Features Included:
- **Dev Assistant**: Senior Engineer AI for code and architecture help (Pro & Flash modes).
- **Asset Gen**: Generate UI design descriptions and placeholder assets.
- **Regex Lab**: Component-by-component breakdown of regular expressions.
