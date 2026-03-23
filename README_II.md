# Evaluating NEX-GDDP-CMIP6 Rainfall Projections in Eritrea’s Agricultural Heartlands

**Authors:** * **Tesfalem W. Ghebretnsae** (RUDN University, Russia / Hamelmalo Agricultural College, Eritrea)
* **Elsayed S. Mohamed** (RUDN University, Russia / NARSS, Egypt)
* **Umar Joseph James** (Niger State Hydrocarbon and Solid Mineral Development Agency, Nigeria)

---

## 📌 Project Overview
This repository provides the computational framework for evaluating 34 **NEX-GDDP-CMIP6** Global Climate Models (GCMs) across Eritrea's diverse agroecological zones (Moist Highlands, Moist Lowlands, and Arid Lowlands). 

Using a **Comprehensive Ranking Index (CRI)** based on nine statistical metrics, this project identifies top-performing models to project future precipitation trends, seasonal concentration (PCI), and reliability (CV) under SSP2-4.5 and SSP5-8.5 scenarios.

## 🚀 Interactive Analysis
The Python analysis and visualization suite can be executed interactively in Google Colab:

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](INSERT_YOUR_COLAB_LINK_HERE)

## 🛠 Methodology
* **Dataset:** NASA NEX-GDDP-CMIP6 (0.25° spatial resolution).
* **Reference Period:** Historical simulations (1981–2014) validated against CHIRPS observational data.
* **Projections:** Near-term (2026-2050), Mid-term (2051-2075), and Far-term (2076-2100).
* **Top-10 Multi-Model Ensemble (MME):** TaiESM1, GFDL-ESM4, FGOALS-g3, EC-Earth3, NESM3, MIROC6, MIROC-ES2L, MRI-ESM2-0, GFDL-CM4, and BCC-CSM2-MR.

## 📊 Key Research Findings
* **The Wetting Paradox:** Projections indicate a substantial increase in mean annual rainfall (rising from ~320 mm to ~520 mm by 2100 under SSP5-8.5).
* **Intensification:** Rainfall increases are driven primarily by the intensification of the **Kiremti (JJAS)** season.
* **Vulnerability:** The Precipitation Concentration Index (PCI) rises from 22.04 to 24.55, suggesting that "wetting" will manifest as more erratic and concentrated events, escalating risks for flash floods and soil erosion.
* **Reliability:** Interannual reliability is projected to decrease as the Coefficient of Variation (CV) rises from 10.5% to 12.8%.

## 📂 Repository Structure
* `/data`: Processed CSV results and model rankings.
* `/notebooks`: Interactive Jupyter/Colab notebooks for trend analysis and PDF plotting.
* `/gee_scripts`: Google Earth Engine (JavaScript) code for spatial SPI mapping.
* `/outputs`: High-resolution maps and statistical charts.

## ⚖️ License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact
For academic inquiries regarding the CRI methodology or data specifics, please contact: **tesfaweld333@gmail.com**
