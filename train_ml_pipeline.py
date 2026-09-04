import pandas as pd
import numpy as np
import os
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import RobustScaler

# Set styling for plots
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.size'] = 11
plt.rcParams['axes.titlesize'] = 14
plt.rcParams['axes.labelsize'] = 12

print("=== RETRAINING ISOLATION FOREST WITH EXACT 20 FEATURE COLUMNS ===")

csv_input_path = "fra_mpr_dataset.csv"
if not os.path.exists(csv_input_path):
    raise FileNotFoundError(f"Could not find {csv_input_path}!")

df_raw = pd.read_csv(csv_input_path)
print(f"Loaded master dataset: Shape = {df_raw.shape}")

# Exact 20 features specified by user
ML_FEATURES_20 = [
    "Total_Claims_Received",
    "Individual_Claims",
    "Community_Claims",
    "Claims_Recommended_SDLC",
    "Claims_Recommended_DLC",
    "Approved_Claims",
    "Pending_Claims",
    "Rejected_Claims",
    "Titles_Distributed",
    "Pending_Rate",
    "Approval_Rate",
    "Rejection_Rate",
    "Disposal_Rate",
    "Workflow_Bottleneck_Rate",
    "SDLC_Dropoff_Rate",
    "DLC_Dropoff_Rate",
    "Rejection_Anomaly_Score",
    "Pending_Backlog_Growth",
    "Individual_vs_Community_Imbalance",
    "Data_Inconsistency_Flag"
]

print(f"\nML Input Features Count: {len(ML_FEATURES_20)}")

X_raw = df_raw[ML_FEATURES_20].copy()

# Scaling & Model Training
scaler = RobustScaler()
X_scaled = scaler.fit_transform(X_raw)

iso_forest = IsolationForest(
    n_estimators=200,
    contamination=0.15,
    random_state=42,
    n_jobs=-1
)
iso_forest.fit(X_scaled)

# Score Computation & Normalization
raw_decision_scores = iso_forest.score_samples(X_scaled)

min_score = raw_decision_scores.min()
max_score = raw_decision_scores.max()

if max_score > min_score:
    normalized_anomaly_scores = (max_score - raw_decision_scores) / (max_score - min_score)
else:
    normalized_anomaly_scores = np.zeros(len(df_raw))

normalized_anomaly_scores = np.round(normalized_anomaly_scores, 4)
ml_risk_scores = np.round(normalized_anomaly_scores * 100, 2)

def map_risk_level(score):
    if score < 40.0:
        return "Normal"
    elif score < 65.0:
        return "Attention"
    else:
        return "High Risk"

ml_risk_levels = [map_risk_level(s) for s in ml_risk_scores]

# Anomaly Taxonomy & Explanations
feature_medians = X_raw.median()
feature_stds = X_raw.std().replace(0, 1)

def generate_anomaly_details(row, risk_level, score):
    if risk_level == "Normal":
        return "Normal Workflow", f"Normal administrative progression (Risk Score: {score:.1f}). Features align with standard state baselines."
    
    if row["Data_Inconsistency_Flag"] == 1:
        return "Data Discrepancy", f"{risk_level} (Score: {score:.1f}): Operational data contradiction flagged. Official counts show mathematical inconsistency across claims received vs approved/rejected totals."
    elif row["Workflow_Bottleneck_Rate"] > 0.25 or row["DLC_Dropoff_Rate"] > 0.30:
        return "Administrative Bottleneck", f"{risk_level} (Score: {score:.1f}): High administrative bottleneck in processing pipeline (Workflow Bottleneck Rate: {row['Workflow_Bottleneck_Rate']:.1%})."
    elif row["Rejection_Anomaly_Score"] > 1.5 or row["Rejection_Rate"] > 0.30:
        return "Rejection Spike", f"{risk_level} (Score: {score:.1f}): High claim rejection rate ({row['Rejection_Rate']:.1%}) deviating from national monthly baseline."
    elif row["Pending_Backlog_Growth"] > 5000 or row["Pending_Rate"] > 0.40:
        return "Backlog Accumulation", f"{risk_level} (Score: {score:.1f}): Expanding unresolved backlog (Pending Rate: {row['Pending_Rate']:.1%}, MoM Growth: +{row['Pending_Backlog_Growth']:,} claims)."
    elif row["Individual_vs_Community_Imbalance"] > 0.90:
        return "Imbalanced Filing", f"{risk_level} (Score: {score:.1f}): High structural imbalance between individual and community claim processing."
    else:
        return "Volume Anomaly", f"{risk_level} (Score: {score:.1f}): Outlier pattern detected in overall claim volume or disposition rates."

anomaly_types = []
ai_explanations = []

for i, row in df_raw.iterrows():
    at, exp = generate_anomaly_details(row, ml_risk_levels[i], ml_risk_scores[i])
    anomaly_types.append(at)
    ai_explanations.append(exp)

# Append ML Output Columns
df_processed = df_raw.copy()
df_processed["anomaly_score"] = normalized_anomaly_scores
df_processed["ML_Risk_Score"] = ml_risk_scores
df_processed["ML_Risk_Level"] = ml_risk_levels
df_processed["Anomaly_Type"] = anomaly_types
df_processed["AI_Explanation"] = ai_explanations

df_processed["Risk_Score"] = ml_risk_scores
df_processed["Risk_Level"] = ml_risk_levels

# Save Processed Dataset
processed_csv_path = "fra_mpr_ml_processed.csv"
processed_excel_path = "fra_mpr_ml_processed.xlsx"

df_processed.to_csv(processed_csv_path, index=False)
df_processed.to_excel(processed_excel_path, index=False, engine="openpyxl")

print(f"\nSaved updated dataset to {processed_csv_path} and {processed_excel_path}")

# Save Model Artifact
model_dict = {
    "model": iso_forest,
    "scaler": scaler,
    "features": ML_FEATURES_20,
    "feature_medians": feature_medians,
    "feature_stds": feature_stds,
    "min_score": min_score,
    "max_score": max_score
}
model_pkl_path = "isolation_forest_model.pkl"
joblib.dump(model_dict, model_pkl_path)
print(f"Saved trained 20-feature model artifact to {model_pkl_path}")

# Generate Updated Plots
plots_dir = "."

# Plot 1: Anomaly Score Distribution
plt.figure(figsize=(9, 5))
sns.histplot(df_processed["anomaly_score"], kde=True, bins=25, color="#1f77b4")
plt.axvline(x=0.40, color="orange", linestyle="--", linewidth=2, label="Attention Threshold (0.40)")
plt.axvline(x=0.65, color="red", linestyle="--", linewidth=2, label="High Risk Threshold (0.65)")
plt.title("Isolation Forest Anomaly Score Distribution (20-Feature Model)")
plt.xlabel("Anomaly Score (0.0 = Normal, 1.0 = Highly Anomalous)")
plt.ylabel("Record Count")
plt.legend()
plt.tight_layout()
plt.savefig(os.path.join(plots_dir, "anomaly_score_distribution.png"), dpi=300)
plt.close()

# Plot 2: Risk Level Breakdown
plt.figure(figsize=(7, 5))
palette = {"Normal": "#2ca02c", "Attention": "#ff7f0e", "High Risk": "#d62728"}
ax = sns.countplot(data=df_processed, x="ML_Risk_Level", order=["Normal", "Attention", "High Risk"], palette=palette)
plt.title("ML Risk Level Distribution (20-Feature Model)")
plt.xlabel("Risk Level")
plt.ylabel("Record Count")
for p in ax.patches:
    ax.annotate(f'{int(p.get_height())}', (p.get_x() + p.get_width() / 2., p.get_height()),
                ha='center', va='bottom', fontsize=11, fontweight='bold', xytext=(0, 3),
                textcoords='offset points')
plt.tight_layout()
plt.savefig(os.path.join(plots_dir, "risk_level_breakdown.png"), dpi=300)
plt.close()

# Plot 3: 20-Feature Dispersion / Importance
feature_vars = X_raw.var()
sorted_vars = feature_vars.sort_values(ascending=True)
plt.figure(figsize=(10, 7))
sorted_vars.plot(kind="barh", color="#2b5c8f")
plt.title("Variance Profile Across All 20 Input Features")
plt.xlabel("Feature Variance")
plt.ylabel("20 Input Features")
plt.tight_layout()
plt.savefig(os.path.join(plots_dir, "feature_importance_contributions.png"), dpi=300)
plt.close()

# Plot 4: Scatter Plot (Risk Score vs Workflow Bottleneck Rate)
plt.figure(figsize=(9, 6))
sns.scatterplot(
    data=df_processed,
    x="Workflow_Bottleneck_Rate",
    y="ML_Risk_Score",
    hue="ML_Risk_Level",
    palette=palette,
    style="ML_Risk_Level",
    s=70,
    alpha=0.8
)
plt.title("ML Risk Score vs Workflow Bottleneck Rate (20-Feature Model)")
plt.xlabel("Workflow Bottleneck Rate")
plt.ylabel("ML Risk Score (0 - 100)")
plt.tight_layout()
plt.savefig(os.path.join(plots_dir, "risk_vs_bottleneck_scatter.png"), dpi=300)
plt.close()

print("Regenerated all 4 diagnostic plots.")

# Reusable Prediction API Function
def predict_fra_risk(input_data):
    """
    Prediction API accepting DataFrame or dict containing the 20 features.
    """
    model_artifact = joblib.load("isolation_forest_model.pkl")
    m = model_artifact["model"]
    sc = model_artifact["scaler"]
    feats = model_artifact["features"]
    mn = model_artifact["min_score"]
    mx = model_artifact["max_score"]
    
    if isinstance(input_data, dict):
        df_in = pd.DataFrame([input_data])
    else:
        df_in = input_data.copy()
        
    X_in = df_in[feats].copy()
    X_sc = sc.transform(X_in)
    raw_scores = m.score_samples(X_sc)
    
    anom_scores = (mx - raw_scores) / (mx - mn) if mx > mn else np.zeros(len(df_in))
    anom_scores = np.round(np.clip(anom_scores, 0, 1), 4)
    r_scores = np.round(anom_scores * 100, 2)
    
    r_levels = [map_risk_level(s) for s in r_scores]
    a_types = []
    a_expls = []
    
    for i, r in X_in.iterrows():
        at, exp = generate_anomaly_details(r, r_levels[i], r_scores[i])
        a_types.append(at)
        a_expls.append(exp)
        
    res_df = df_in.copy()
    res_df["anomaly_score"] = anom_scores
    res_df["Risk_Score"] = r_scores
    res_df["Risk_Level"] = r_levels
    res_df["Anomaly_Type"] = a_types
    res_df["AI_Explanation"] = a_expls
    return res_df

# Test prediction function
test_pred = predict_fra_risk(df_raw.head(3))
print("\nPrediction Function Test (20 Features, First 3 Rows):")
print(test_pred[["State", "anomaly_score", "Risk_Score", "Risk_Level", "Anomaly_Type"]].to_string())

print("\n=== FINAL ML SUMMARY (20-FEATURE MODEL) ===")
print("Risk Level Breakdown:")
print(df_processed["ML_Risk_Level"].value_counts().to_string())
print("\nAnomaly Type Breakdown:")
print(df_processed["Anomaly_Type"].value_counts().to_string())

