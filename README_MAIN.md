# Evaluating NEX-GDDP-CMIP6 rainfall projections in Eritrea’s agricultural heartlands

This repository contains the full analytical pipeline, geospatial data, and multi-model ensemble results for assessing rainfall projections in Eritrea using CMIP6 NEX-GDDP data.

## **How to Run the Analysis**

To replicate the findings, spatial maps, and statistical validations presented in the study, follow these steps:

### **1. Open the Notebook**
* Locate the **`Eritrea_Precipitation_Dynamics_CMIP6_Evaluation_1981_2100.ipynb`** file in this repository.
* Click the **"Open in Colab"** badge at the top of the notebook or download the file and upload it to [Google Colab](https://colab.research.google.com/).

### **2. Execute the Master Setup**
* Run the **first cell (Master Setup & Data Path Configuration)**. 
* This cell will automatically:
    * Clone this GitHub repository into the Colab environment.
    * Map all necessary paths for CSVs, Shapefiles, and GeoTIFFs.
    * Install required libraries if they are missing.

### **3. Run Sequential Scripts**
* **Script 8:** Generates Annual, Seasonal, and Monthly Climatology plots with heavy trendlines.
* **Script 9:** Synthesizes the Spatial Ensemble Masterpiece (1200 DPI) using the provided GeoTIFFs and Shapefiles.
* **Script 10:** Performs Advanced Validation, including PDF Shifts, PCI trends, and Rainfall Reliability (CV%).

### **4. Accessing Outputs**
* All generated high-resolution figures (.png) will be saved automatically in the `/outputs` folder within the Colab file browser.

---

## **Software Requirements**
The analysis is performed using **Python 3.x**. The following libraries are required (automatically handled by the Master Setup cell):
* `pandas` & `numpy` (Data Processing)
* `matplotlib` & `seaborn` (Visualization)
* `geopandas` & `rasterio` (Geospatial Analysis)
* `scipy` (Statistical Trends)

---

## **How to Cite This Work**

If you use this code, data, or the methodology described in this repository for your research, please cite the original study:

**APA Style:**
> Ghebretnsae, T. W., Mohamed, E. S., & Umar, J. J. (2026). *Evaluating NEX-GDDP-CMIP6 rainfall projections in Eritrea’s agricultural heartlands*. [Journal Name/In Press].

**BibTeX:**
```bibtex
@article{Ghebretnsae2026Eritrea,
  title={Evaluating NEX-GDDP-CMIP6 rainfall projections in Eritrea’s agricultural heartlands},
  author={Tesfalem W. Ghebretnsae and Elsayed S. Mohamed and Umar Joseph James},
  journal={Environmental Monitoring and Assessment},
  year={2026},
  publisher={Springer}
}
