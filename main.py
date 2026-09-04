from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import pandas as pd
import json
import os

app = FastAPI(
    title="FRA Decision Support System (DSS) Map API",
    description="State-level FRA implementation risk and anomaly tracking API",
    version="1.0.0"
)

@app.middleware("http")
async def add_no_cache_header(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

os.makedirs("static", exist_ok=True)
os.makedirs(os.path.join("static", "documents"), exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/documents", StaticFiles(directory=os.path.join("static", "documents")), name="documents")

CSV_PATH = "processed_fra_predictions.csv"
GEOJSON_PATH = "india_states.geojson"

if not os.path.exists(CSV_PATH):
    raise FileNotFoundError(f"Missing prediction data file: {CSV_PATH}")

df = pd.read_csv(CSV_PATH)
df["Month"] = df["Month"].astype(str)

num_cols = [
    "Total_Claims_Received", "Approved_Claims", "Pending_Claims", "Rejected_Claims",
    "Pending_Rate", "Rejection_Rate", "Workflow_Bottleneck_Rate", "Pending_Backlog_Growth",
    "Risk_Score", "ML_Risk_Score"
]
for col in num_cols:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

@app.get("/api/fra/months")
def get_available_months():
    """Returns sorted list of available months in dataset."""
    months = sorted(list(df["Month"].unique()))
    return {"months": months, "total_months": len(months)}

@app.get("/api/fra/states")
def get_state_dss_data(month: str = Query(..., description="Selected month in format YYYY-MM")):
    """
    GET /api/fra/states?month=YYYY-MM
    Returns state-wise Decision Support System (DSS) fields for the selected month.
    """
    month_df = df[df["Month"] == month]
    if month_df.empty:
        raise HTTPException(status_code=404, detail=f"No data found for month '{month}'")
    
    states_dict = {}
    for _, row in month_df.iterrows():
        st_name = row["State"]
        states_dict[st_name] = {
            "State": st_name,
            "Month": row["Month"],
            "Total_Claims_Received": int(row["Total_Claims_Received"]),
            "Approved_Claims": int(row["Approved_Claims"]),
            "Pending_Claims": int(row["Pending_Claims"]),
            "Rejected_Claims": int(row["Rejected_Claims"]),
            "ML_Risk_Score": float(row["Risk_Score"]),
            "ML_Risk_Level": str(row["Risk_Level"]),
            "Anomaly_Type": str(row["Anomaly_Type"]),
            "Pending_Rate": float(row["Pending_Rate"]),
            "Rejection_Rate": float(row["Rejection_Rate"]),
            "Workflow_Bottleneck_Rate": float(row["Workflow_Bottleneck_Rate"]),
            "Pending_Backlog_Growth": int(row["Pending_Backlog_Growth"]),
            "AI_Explanation": str(row["AI_Explanation"])
        }
    
    risk_counts = month_df["Risk_Level"].value_counts().to_dict()
    
    return {
        "month": month,
        "total_states": len(states_dict),
        "summary": {
            "Total_Claims_Received": int(month_df["Total_Claims_Received"].sum()),
            "Approved_Claims": int(month_df["Approved_Claims"].sum()),
            "Pending_Claims": int(month_df["Pending_Claims"].sum()),
            "Normal_Count": risk_counts.get("Normal", 0),
            "Attention_Count": risk_counts.get("Attention", 0),
            "High_Risk_Count": risk_counts.get("High Risk", 0)
        },
        "states": states_dict
    }

@app.get("/api/fra/geojson")
def get_india_geojson():
    """Serves the local India States GeoJSON file."""
    if not os.path.exists(GEOJSON_PATH):
        raise HTTPException(status_code=404, detail="GeoJSON file not found")
    with open(GEOJSON_PATH, "r") as f:
        data = json.load(f)
    return JSONResponse(content=data)

VITE_DIST_PATH = os.path.join("vandhristi-2", "dist", "public")
ASSETS_PATH = os.path.join(VITE_DIST_PATH, "assets")

if os.path.exists(ASSETS_PATH):
    app.mount("/assets", StaticFiles(directory=ASSETS_PATH), name="assets")

@app.get("/legacy-landing", response_class=HTMLResponse)
def serve_legacy_landing():
    """Serves the standalone landing page HTML."""
    html_path = os.path.join("templates", "landing.html")
    if os.path.exists(html_path):
        with open(html_path, "r") as f:
            return f.read()
    return HTMLResponse(content="<h2>VanDrishti Landing Page loading...</h2>")

@app.get("/legacy-dashboard", response_class=HTMLResponse)
def serve_legacy_dashboard():
    """Serves the standalone legacy DSS dashboard HTML page."""
    html_path = os.path.join("templates", "index.html")
    if os.path.exists(html_path):
        with open(html_path, "r") as f:
            return f.read()
    return HTMLResponse(content="<h2>FRA Dashboard loading...</h2>")

@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    """
    Catch-all SPA router: Serves built VanDrishti React application from dist/public/index.html.
    Also serves static public assets if they exist in dist/public.
    """
    file_path = os.path.join(VITE_DIST_PATH, full_path)
    if full_path and os.path.isfile(file_path):
        return FileResponse(file_path)

    index_path = os.path.join(VITE_DIST_PATH, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    # Fallback to landing template if build doesn't exist
    html_path = os.path.join("templates", "landing.html")
    if os.path.exists(html_path):
        return FileResponse(html_path)
    return HTMLResponse(content="<h2>VanDrishti Platform Loading...</h2>")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
