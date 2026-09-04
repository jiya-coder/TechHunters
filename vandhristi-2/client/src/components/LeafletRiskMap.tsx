import { useEffect, useRef } from "react";

declare global {
  interface Window {
    L: any;
  }
}

export interface StateDSSData {
  State: string;
  Month: string;
  Total_Claims_Received: number;
  Approved_Claims: number;
  Pending_Claims: number;
  Rejected_Claims: number;
  ML_Risk_Score: number;
  ML_Risk_Level: string;
  Anomaly_Type: string;
  Pending_Rate: number;
  Rejection_Rate: number;
  Workflow_Bottleneck_Rate: number;
  Pending_Backlog_Growth: number;
  AI_Explanation: string;
}

interface LeafletRiskMapProps {
  statesData: Record<string, StateDSSData>;
  geoJsonData: any;
  selectedState: StateDSSData | null;
  onSelectState: (state: StateDSSData) => void;
  theme: "morning" | "dusk";
  statusFilter?: string;
}

export default function LeafletRiskMap({
  statesData,
  geoJsonData,
  selectedState,
  onSelectState,
  theme,
  statusFilter = "All statuses",
}: LeafletRiskMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const geoJsonLayerRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  // Helper for Risk Level Color Coding
  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case "Normal":
        return "#4E9C6D"; // Green
      case "Attention":
        return "#E5A93C"; // Yellow
      case "High Risk":
        return "#DA5A5A"; // Red
      default:
        return "#9EAEA5"; // Missing data gray
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || !window.L) return;

    if (!mapRef.current) {
      const L = window.L;
      const map = L.map(mapContainerRef.current, {
        center: [22.5937, 78.9629],
        zoom: 5,
        minZoom: 4,
        maxZoom: 8,
        zoomControl: true,
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer based on theme
  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    const L = window.L;

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      theme === "dusk"
        ? "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        : "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution: "&copy; Esri &mdash; Esri, DeLorme, NAVTEQ | VanDrishti System",
      maxZoom: 18,
    }).addTo(mapRef.current);
  }, [theme]);

  // Render / Update GeoJSON features
  useEffect(() => {
    if (!mapRef.current || !geoJsonData || !window.L) return;
    const L = window.L;

    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
    }

    const geoJsonLayer = L.geoJSON(geoJsonData, {
      style: (feature: any) => {
        const stateName = feature.properties.ST_NM || feature.properties.NAME_1 || feature.properties.state_name;
        const dss = statesData[stateName];
        const riskLevel = dss ? dss.ML_Risk_Level : "Missing";
        const color = getRiskColor(riskLevel);
        const isSelected = selectedState && selectedState.State === stateName;

        const matchesFilter =
          statusFilter === "All statuses" ||
          (dss && dss.ML_Risk_Level === statusFilter);

        return {
          fillColor: color,
          weight: isSelected ? 2.5 : 1,
          opacity: matchesFilter ? 1 : 0.25,
          color: isSelected ? "#FFFFFF" : theme === "dusk" ? "#273E36" : "#E2E7DB",
          dashArray: "",
          fillOpacity: matchesFilter ? (isSelected ? 0.85 : 0.65) : 0.15,
        };
      },
      onEachFeature: (feature: any, layer: any) => {
        const stateName = feature.properties.ST_NM || feature.properties.NAME_1 || feature.properties.state_name;
        const dss = statesData[stateName];

        // Hover State Name Tooltip (Non-permanent, shown on hover)
        if (stateName) {
          const tooltipContent = dss
            ? `<div style="font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700;">${stateName} <span style="font-weight: 500; opacity: 0.85; margin-left: 4px;">• ${dss.ML_Risk_Level}</span></div>`
            : `<div style="font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700;">${stateName}</div>`;

          layer.bindTooltip(tooltipContent, {
            permanent: false,
            sticky: true,
            direction: "top",
            className: "leaflet-state-hover-tooltip",
          });
        }

        // Hover effect
        layer.on({
          mouseover: (e: any) => {
            const l = e.target;
            l.setStyle({
              weight: 2.5,
              color: "#FFFFFF",
              fillOpacity: 0.85,
            });
            l.bringToFront();
          },
          mouseout: (e: any) => {
            geoJsonLayer.resetStyle(e.target);
          },
          click: () => {
            if (dss) {
              onSelectState(dss);
              
              // Show Popup
              const popupContent = `
                <div style="font-family: 'DM Sans', sans-serif; padding: 4px; max-width: 280px; color: #18221F;">
                  <h4 style="margin: 0 0 6px 0; font-size: 1rem; font-weight: 700; color: #173F35;">${dss.State}</h4>
                  <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                    <span style="background: ${getRiskColor(dss.ML_Risk_Level)}; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">
                      ${dss.ML_Risk_Level} (${dss.ML_Risk_Score.toFixed(0)})
                    </span>
                    <span style="font-size: 0.75rem; color: #5B6B65; font-weight: 600;">Outlier: ${dss.Anomaly_Type}</span>
                  </div>
                  <div style="font-size: 0.8rem; line-height: 1.4; color: #2A3632;">
                    <div><b>Pending Rate:</b> ${dss.Pending_Rate.toFixed(1)}%</div>
                    <div><b>Rejection Rate:</b> ${dss.Rejection_Rate.toFixed(1)}%</div>
                    <div><b>Bottleneck Rate:</b> ${dss.Workflow_Bottleneck_Rate.toFixed(1)}%</div>
                    <div><b>Backlog Growth:</b> ${dss.Pending_Backlog_Growth > 0 ? "+" : ""}${dss.Pending_Backlog_Growth.toLocaleString()}</div>
                  </div>
                  <p style="margin: 8px 0 0 0; font-size: 0.75rem; color: #5B6B65; font-style: italic; border-top: 1px solid #E2E7DB; padding-top: 6px;">
                    ${dss.AI_Explanation}
                  </p>
                </div>
              `;
              layer.bindPopup(popupContent, { maxWidth: 300 }).openPopup();
            }
          },
        });
      },
    }).addTo(mapRef.current);

    geoJsonLayerRef.current = geoJsonLayer;
  }, [geoJsonData, statesData, selectedState, theme, statusFilter]);

  return (
    <div className="relative w-full h-[540px] rounded-xl overflow-hidden border border-border/60 shadow-lg">
      <div ref={mapContainerRef} className="w-full h-full z-0 bg-[#e8ece9]" />
      {/* Floating Legend Pill matching reference screenshot */}
      <div className="absolute bottom-3 right-4 z-10 bg-[#0b170f]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#1b3122] shadow-xl flex items-center gap-4 text-[11px] font-semibold text-white">
        <span className="flex items-center gap-1.5">
          <i className="w-2.5 h-2.5 rounded-full bg-[#4E9C6D] inline-block" /> Normal
        </span>
        <span className="flex items-center gap-1.5">
          <i className="w-2.5 h-2.5 rounded-full bg-[#E5A93C] inline-block" /> Attention
        </span>
        <span className="flex items-center gap-1.5">
          <i className="w-2.5 h-2.5 rounded-full bg-[#DA5A5A] inline-block" /> High Risk
        </span>
      </div>
    </div>
  );
}
