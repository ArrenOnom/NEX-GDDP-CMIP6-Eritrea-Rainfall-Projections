# Google Earth Engine (GEE) Extraction Pipeline

This folder contains the JavaScript API scripts used to process and extract precipitation data from the **NASA NEX-GDDP-CMIP6** and **CHIRPS v2.0** datasets.

## **Execution Sequence**
To replicate the dataset used in this study, the scripts should be viewed or executed in the following order:

| File | Description | Output |
| :--- | :--- | :--- |
| **Script 01** | Historical Baseline (1981-2014) | CSV (All 34 Models + CHIRPS) |
| **Script 02** | Spatial Export (Historical) | GeoTIFF (Individual Model Maps) |
| **Script 03** | Ensemble Synthesis | GeoTIFF (MME Mean & Anomaly Maps) |
| **Script 04** | Refined Historical (Top 10) | CSV (CRI-Ranked Models Only) |
| **Script 05** | Future SSP2-4.5 (Top 10) | CSV (2015-2100 Projections) |
| **Script 06** | Future SSP5-8.5 (Top 10) | CSV (2015-2100 Projections) |

## **Technical Specifications**
* **Projection:** EPSG:4326 (WGS 84)
* **Scale:** 25,000 meters (approx. 0.25°) to match NEX-GDDP native resolution.
* **Unit Conversion:** All scripts include internal logic to convert precipitation flux ($kg/m^2/s$) to cumulative monthly/annual totals ($mm$).

## **User Requirements**
To run these scripts, you must have a [Google Earth Engine](https://earthengine.google.com/) account. You will need to upload your own Study Area (ROI) as a `FeatureCollection` and update the `studyArea` variable path in each script.
