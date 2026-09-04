import pandas as pd
import numpy as np
import os
import json
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import RobustScaler

# Set plot styling
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.size'] = 11
plt.rcParams['axes.titlesize'] = 14

print("=== TRAINING ISOLATION FOREST ON NEW FRA_Monthly_Progress_Dataset_2025_2026 (1).csv ===")

# 1. Primary input dataset
csv_input_path = "FRA_Monthly_Progress_Dataset_2025_2026 (1).csv"
if not os.path.exists(csv_input_path):
    csv_input_path = "fra_mpr_dataset.csv"

df_raw = pd.read_csv(csv_input_path)
print(f"Loaded dataset from '{csv_input_path}': {len(df_raw)} rows x {len(df_raw.columns)} columns")

# 2. Exact 20 ML Feature Columns
FEATURE_COLUMNS_20 = [
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

EXCLUDED_COLUMNS = ["State", "Month", "Risk_Score", "Risk_Level"]

# Export feature_config.json
feature_config = {
    "model_name": "IsolationForest_FRA_Anomaly_Detector",
    "dataset_source": csv_input_path,
    "version": "1.2.0",
    "input_features_count": len(FEATURE_COLUMNS_20),
    "feature_columns": FEATURE_COLUMNS_20,
    "excluded_columns": EXCLUDED_COLUMNS,
    "risk_level_thresholds": {
        "Normal": "< 40.0",
        "Attention": "40.0 to 64.99",
        "High Risk": ">= 65.0"
    },
    "scoring_normalization": "Robust Percentile Clipped Normalization [0.0, 1.0]",
    "scaling": "RobustScaler",
    "model_hyperparameters": {
        "n_estimators": 200,
        "contamination": 0.15,
        "random_state": 42,
        "n_jobs": -1
    }
}

config_json_path = "feature_config.json"
with open(config_json_path, "w") as f:
    json.dump(feature_config, f, indent=4)
print(f"Exported updated configuration to {config_json_path}")

# 3. Model Training & Scaling
X_raw = df_raw[FEATURE_COLUMNS_20].copy()

scaler = RobustScaler()
X_scaled = scaler.fit_transform(X_raw)

iso_forest = IsolationForest(
    n_estimators=200,
    contamination=0.15,
    random_state=42,
    n_jobs=-1
)
iso_forest.fit(X_scaled)

# 4. Anomaly Scoring & Robust Normalization
raw_decision_scores = iso_forest.score_samples(X_scaled)

train_min_score = float(np.percentile(raw_decision_scores, 1))
train_max_score = float(np.percentile(raw_decision_scores, 99))

def compute_robust_anomaly_score(raw_scores_arr, min_benchmark, max_benchmark):
    if max_benchmark > min_benchmark:
        scaled = (max_benchmark - raw_scores_arr) / (max_benchmark - min_benchmark)
    else:
        scaled = np.zeros_like(raw_scores_arr)
    return np.round(np.clip(scaled, 0.0, 1.0), 4)

anomaly_scores = compute_robust_anomaly_score(raw_decision_scores, train_min_score, train_max_score)
ml_risk_scores = np.round(anomaly_scores * 100, 2)

def map_risk_level(score):
    if score < 40.0:
        return "Normal"
    elif score < 65.0:
        return "Attention"
    else:
        return "High Risk"

ml_risk_levels = [map_risk_level(s) for s in ml_risk_scores]

# 5. Anomaly Taxonomy & Explanations Engine
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

# 6. Save processed predictions
df_processed = df_raw.copy()
df_processed["anomaly_score"] = anomaly_scores
df_processed["ML_Risk_Score"] = ml_risk_scores
df_processed["ML_Risk_Level"] = ml_risk_levels
df_processed["Anomaly_Type"] = anomaly_types
df_processed["AI_Explanation"] = ai_explanations

df_processed["Risk_Score"] = ml_risk_scores
df_processed["Risk_Level"] = ml_risk_levels

pred_csv_path = "processed_fra_predictions.csv"
pred_excel_path = "processed_fra_predictions.xlsx"

df_processed.to_csv(pred_csv_path, index=False)
df_processed.to_excel(pred_excel_path, index=False, engine="openpyxl")
print(f"Exported processed predictions to {pred_csv_path} and {pred_excel_path}")

# 7. Save isolation_forest_model.pkl
model_artifact = {
    "model": iso_forest,
    "scaler": scaler,
    "features": FEATURE_COLUMNS_20,
    "feature_medians": feature_medians,
    "feature_stds": feature_stds,
    "train_min_score": train_min_score,
    "train_max_score": train_max_score,
    "dataset_source": csv_input_path,
    "version": "1.2.0"
}

model_pkl_path = "isolation_forest_model.pkl"
joblib.dump(model_artifact, model_pkl_path)
print(f"Saved trained model artifact to {model_pkl_path}")

# 8. Export training_report.json
risk_counts = df_processed["ML_Risk_Level"].value_counts().to_dict()
anomaly_counts = df_processed["Anomaly_Type"].value_counts().to_dict()

training_report = {
    "status": "SUCCESS",
    "dataset_source": csv_input_path,
    "dataset_info": {
        "total_rows": len(df_processed),
        "months_count": int(df_processed["Month"].nunique()),
        "states_count": int(df_processed["State"].nunique()),
        "time_period": "Jan 2025 - June 2026",
        "total_features_trained": len(FEATURE_COLUMNS_20)
    },
    "scoring_parameters": {
        "train_min_score_benchmark": train_min_score,
        "train_max_score_benchmark": train_max_score,
        "scoring_function": "compute_robust_anomaly_score"
    },
    "risk_level_distribution": risk_counts,
    "anomaly_type_distribution": anomaly_counts,
    "model_metrics": {
        "mean_anomaly_score": float(df_processed["anomaly_score"].mean().round(4)),
        "max_anomaly_score": float(df_processed["anomaly_score"].max().round(4)),
        "min_anomaly_score": float(df_processed["anomaly_score"].min().round(4)),
        "mean_risk_score": float(df_processed["Risk_Score"].mean().round(2))
    },
    "evaluation_disclaimer": "Unsupervised anomaly detection model trained on unlabelled government data. Accuracy/Precision/Recall are not claimed without labeled ground-truth data."
}

report_json_path = "training_report.json"
with open(report_json_path, "w") as f:
    json.dump(training_report, f, indent=4)
print(f"Exported training report to {report_json_path}")

# 9. Plots
plots_dir = "."

plt.figure(figsize=(9, 5))
sns.histplot(df_processed["anomaly_score"], kde=True, bins=25, color="#1f77b4")
plt.axvline(x=0.40, color="orange", linestyle="--", linewidth=2, label="Attention Threshold (0.40)")
plt.axvline(x=0.65, color="red", linestyle="--", linewidth=2, label="High Risk Threshold (0.65)")
plt.title("Isolation Forest Anomaly Score Distribution (New Dataset)")
plt.xlabel("Anomaly Score (0.0 = Normal, 1.0 = Highly Anomalous)")
plt.ylabel("Record Count")
plt.legend()
plt.tight_layout()
plt.savefig(os.path.join(plots_dir, "anomaly_score_distribution.png"), dpi=300)
plt.close()

plt.figure(figsize=(7, 5))
palette = {"Normal": "#2ca02c", "Attention": "#ff7f0e", "High Risk": "#d62728"}
ax = sns.countplot(data=df_processed, x="ML_Risk_Level", order=["Normal", "Attention", "High Risk"], palette=palette)
plt.title("ML Risk Level Distribution (378 Records)")
plt.xlabel("Risk Level")
plt.ylabel("Record Count")
for p in ax.patches:
    ax.annotate(f'{int(p.get_height())}', (p.get_x() + p.get_width() / 2., p.get_height()),
                ha='center', va='bottom', fontsize=11, fontweight='bold', xytext=(0, 3),
                textcoords='offset points')
plt.tight_layout()
plt.savefig(os.path.join(plots_dir, "risk_level_breakdown.png"), dpi=300)
plt.close()

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
plt.title("ML Risk Score vs Workflow Bottleneck Rate")
plt.xlabel("Workflow Bottleneck Rate")
plt.ylabel("ML Risk Score (0 - 100)")
plt.tight_layout()
plt.savefig(os.path.join(plots_dir, "risk_vs_bottleneck_scatter.png"), dpi=300)
plt.close()

# 10. Reusable Prediction Function
def predict_fra_risk(input_data):
    artifact = joblib.load("isolation_forest_model.pkl")
    m = artifact["model"]
    sc = artifact["scaler"]
    feats = artifact["features"]
    min_bench = artifact["train_min_score"]
    max_bench = artifact["train_max_score"]
    
    if isinstance(input_data, dict):
        df_in = pd.DataFrame([input_data])
    else:
        df_in = input_data.copy()
        
    X_in = df_in[feats].copy()
    X_sc = sc.transform(X_in)
    raw_scores = m.score_samples(X_sc)
    
    anom_scores = compute_robust_anomaly_score(raw_scores, min_bench, max_bench)
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

# Sample test
print("\n--- Model Predictions Test (First 3 Rows of New Dataset) ---")
test_pred = predict_fra_risk(df_raw.head(3))
print(test_pred[["Month", "State", "anomaly_score", "Risk_Score", "Risk_Level", "Anomaly_Type"]].to_string())

print("\n=== NEW MODEL TRAINING COMPLETED SUCCESSFULLY ===")

