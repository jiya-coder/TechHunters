# VanDrishti: FRA Decision Support System (DSS)

VanDrishti is a comprehensive State-level Decision Support System (DSS) designed to track Forest Rights Act (FRA) implementation anomalies, risk levels, and workflow bottlenecks across India. It integrates a robust machine learning backend with an immersive, map-driven frontend.

## Key Features

*   **Geospatial Visualization:** Interactive map (powered by Leaflet) displaying state-wise FRA implementation metrics, risk levels, and anomalies.
*   **Machine Learning Insights:** Utilizes an Isolation Forest model to detect anomalies and predict risk levels based on historical Monthly Progress Report (MPR) data.
*   **Real-time KPI Monitoring:** Tracks crucial metrics including Total Claims Received, Pending Claims, and categorizes states into High Risk, Attention, or Normal statuses.
*   **Interactive Knowledge Hub:** Provides access to statutory documents, policy briefs, and implementation playbooks (e.g., FRA Act 2006, Gram Sabha guidelines).
*   **Immersive UI:** A modern, atmospheric dark-themed interface built with React, Vite, and Tailwind CSS, featuring smooth transitions and dynamic styling.

## Tech Stack

### Backend
*   **FastAPI:** High-performance REST API serving state-level data and spatial geometries.
*   **Python & Pandas:** Data processing and extraction pipelines.
*   **Scikit-Learn:** Machine learning pipelines (`isolation_forest_model.pkl`).

### Frontend (`vandhristi-2`)
*   **React + TypeScript:** Component-based UI architecture.
*   **Vite:** Fast frontend tooling and bundling.
*   **Tailwind CSS:** Utility-first styling for the dark forest aesthetic.
*   **React Leaflet:** Geospatial rendering and map interactions.
*   **Lucide React:** Modern iconography.

## Project Structure

```text
TechHunters/
├── main.py                               # FastAPI backend DSS server & API endpoints
├── processed_fra_predictions.csv         # ML predictions & state dataset (used by main.py)
├── india_states.geojson                  # GIS boundaries for India states
├── isolation_forest_model.pkl            # Trained ML Isolation Forest model
├── feature_config.json                   # ML feature configuration
├── training_report.json                  # Model metrics & evaluation report
├── build_fra_dataset.py                  # Core dataset builder
├── extract_master_18_months.py           # Data extraction engine
├── parse_all_mprs.py                     # MPR parsing module
├── parse_mpr_v2.py                       # MPR page parser v2
├── parse_page4_all.py                    # Page parsing logic
├── train_ml_pipeline.py                  # Pipeline trainer
├── train_model.py                        # Model trainer
├── static/                               # Statutory document PDFs, text files & UI assets
├── templates/                            # Index & landing HTML templates
├── vandhristi-2/                         # Full React + Vite + TypeScript web application
│   ├── client/                           # React frontend source code, components, & pages
│   ├── server/                           # Node server code
│   ├── shared/                           # Shared constants & types
│   ├── package.json                      # Dependencies configuration
│   └── vite.config.ts                    # Vite build config
```

## Running the Project Locally

### 1. Start the Backend (FastAPI)
Navigate to the root directory and start the Uvicorn server:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
The API will be available at `http://localhost:8000`.

### 2. Start the Frontend (Development)
Navigate to the frontend directory:
```bash
cd vandhristi-2
```
Install dependencies and run the development server:
```bash
npm install
npm run dev
```

### 3. Build for Production
To build the frontend assets for production (which will be served by the FastAPI server):
```bash
cd vandhristi-2
npm run build
```
Once built, the FastAPI server running on port 8000 will automatically serve the production frontend.

