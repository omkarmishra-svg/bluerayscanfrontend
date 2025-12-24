# Full Stack Deployment Guide

Follow this step-by-step guide to deploy your **BlueRayScan** project.

## Phase 1: Deploy Backend (The Intelligence)

**Goal**: Get your FastAPI backend running on the cloud (Render) so it has a public URL (e.g., `https://bluerayscan-api.onrender.com`).

1.  **Prepare the Repo**:
    *   Create a **NEW GitHub Repository** (e.g., `bluerayscan-backend`).
    *   Copy **everything** inside the `backend/` folder to the **ROOT** of this new repo.
    *   Your repo structure should look like:
        ```
        repo/
        ├── app/
        ├── uploads/
        ├── requirements.txt
        ├── Procfile
        ├── runtime.txt
        └── main.py (etc)
        ```
    *   Push this code to GitHub.

2.  **Deploy to Render**:
    *   Go to [dashboard.render.com](https://dashboard.render.com/).
    *   Click **New +** -> **Web Service**.
    *   Connect your `bluerayscan-backend` repo.`
    *   **Runtime**: Python 3.
    *   **Build Command**: `pip install -r requirements.txt` (Render should auto-detect this).
    *   **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (Auto-detected from Procfile).
    *   Click **Deploy**.

3.  **Get URL**:
    *   Once deployed, copy the URL from the top left (e.g., `https://bluerayscan-backend-xyz.onrender.com`).
    *   **Save this URL.** You need it for Phase 2.

---

## Phase 2: Connect Frontend (The Interface)

**Goal**: Update your local frontend code to stop using "Mock Data" and start sending files to your real backend.

1.  **Open** `src/components/DeepfakeAnalyzer.tsx`.
2.  **Locate** the `handleAnalyze` function (approx line 24).
3.  **Replace** the entire `handleAnalyze` function with this code:

```typescript
  guide, assuming you have the file object. 
    // If not, you'll need to update the file input to store the file in state: 
    // const [file, const handleAnalyze = async () => {
    if (!selectedType || selectedType !== 'image') {
       alert("Currently only Image analysis is supported by the backend.");
       return;
    }
    
    // Get the file input element (You might need to add a ref or state for the file)
    // For this setFile] = useState<File | null>(null);
    
    // NOTE: Since the current UI doesn't explicitly store the file in a state variable shown in the mock,
    // You will need to add: const [file, setFile] = useState<File | null>(null);
    // And update the Upload area's input to: onChange={(e) => setFile(e.target.files?.[0] || null)}
    
    if (!file) {
        alert("Please upload a file first.");
        return;
    }

    setAnalyzing(true);

    try {
        const formData = new FormData();
        formData.append('file', file);

        // REPLACE THIS URL WITH YOUR RENDER BACKEND URL
        const API_URL = "https://your-backend-name.onrender.com/api/scan"; 

        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        // Transform Backend Response to Frontend Format
        const result: AnalysisResult = {
            confidence: data.confidence, // Backend sends 0-100
            verdict: data.prediction === 'REAL' ? 'authentic' : 'deepfake',
            indicators: [
                { 
                    name: 'AI Detection Model', 
                    status: data.prediction === 'REAL' ? 'pass' : 'fail', 
                    description: data.explanation 
                },
                {
                    name: 'Visual Heatmap',
                    status: 'pass',
                    description: 'Heatmap generated successfully'
                }
            ],
            metadata: [
                { label: 'File Type', value: file.type },
                { label: 'Size', value: `${(file.size / 1024 / 1024).toFixed(2)} MB` },
                { label: 'Heatmap', value: data.heatmap ? 'View Below' : 'N/A' }
            ]
        };
        
        // Show Heatmap (Optional: You can add an img tag to display result.heatmap if you want)
        if(data.heatmap && data.heatmap.startsWith("http")) {
             // You can console log it or add it to the UI
             console.log("Heatmap URL:", data.heatmap);
        }

        setResult(result);
    } catch (error) {
        console.error("Analysis failed:", error);
        alert("Server error. Check console.");
    } finally {
        setAnalyzing(false);
    }
  };
```

---

## Phase 3: Deploy Frontend (The Website)

**Goal**: Host your React App on Vercel so anyone can access it.

1.  **Prepare the Frontend Repo**:
    *   Create **another NEW GitHub Repository** (e.g., `bluerayscan-frontend`).
    *   Push your **entire project folder** (excluding `backend/` if you moved it) to this repo.
    *   Ensure `vite.config.ts`, `package.json`, and `index.html` are in the root.

2.  **Deploy to Vercel**:
    *   Go to [vercel.com](https://vercel.com/).
    *   **Add New...** -> **Project**.
    *   Select your `bluerayscan-frontend` repo.
    *   **Framework Preset**: Vite (Auto-detected).
    *   **Build Command**: `npm run build`.
    *   **Output Directory**: `dist`.
    *   Click **Deploy**.

## Phase 4: Verification

1.  Open your Vercel URL (e.g., `https://bluerayscan-frontend.vercel.app`).
2.  Upload an image.
3.  Click "Start Analysis".
4.  The Frontend calls your Render Backend.
5.  You see the **Real AI Result**!
