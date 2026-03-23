/**
 * SCRIPT 03: ENSEMBLE SYNTHESIS & SPATIAL ANOMALY MAPPING
 * -------------------------------------------------------------------------
 * Purpose: Generate Multi-Model Ensemble (MME) means for the Top 10 ranked 
 * GCMs and calculate future precipitation anomalies (SSP2-4.5 and SSP5-8.5).
 * Authors: Tesfalem W. Ghebretnsae, Elsayed S. Mohamed, Umar Joseph James
 * -------------------------------------------------------------------------
 */

// --- 1. CONFIGURATION & STUDY AREA ---
var studyArea = ee.FeatureCollection("projects/YOUR_PROJECT/assets/SELECTED_ZONES_WGS1984"); 
Map.centerObject(studyArea, 7);

// --- 2. TOP 10 MODELS (As identified by Comprehensive Rating Index - CRI) ---
var top10Models = [
  'CanESM5', 'KACE-1-0-G', 'EC-Earth3', 'FGOALS-g3', 'NESM3',
  'EC-Earth3-Veg-LR', 'MRI-ESM2-0', 'CNRM-ESM2-1', 'MPI-ESM1-2-LR', 'MIROC-ES2L'
];

// --- 3. ENSEMBLE MEAN FUNCTION ---
// Converts daily flux (kg/m2/s) to mean annual rainfall (mm/year) for the ensemble
var getEnsembleMap = function(scenario, startYear, endYear) {
  var dataset = ee.ImageCollection("NASA/GDDP-CMIP6")
    .filter(ee.Filter.inList('model', top10Models))
    .filter(ee.Filter.eq('scenario', scenario))
    .filter(ee.Filter.calendarRange(startYear, endYear, 'year'))
    .select('pr');

  return dataset.mean()
    .multiply(86400) // Seconds to Day
    .multiply(365.25) // Days to Year
    .clip(studyArea);
};

// --- 4. GENERATE PRIMARY ENSEMBLE LAYERS ---
// Baseline (1981-2014) vs Future Projections (2015-2100)
var historicalEnsemble = getEnsembleMap('historical', 1981, 2014);
var ssp245Ensemble = getEnsembleMap('ssp245', 2015, 2100);
var ssp585Ensemble = getEnsembleMap('ssp585', 2015, 2100);

// --- 5. GENERATE PRECIPITATION ANOMALY (CHANGE) MAPS ---
// Formula: Future Mean - Historical Mean
var anomalySSP245 = ssp245Ensemble.subtract(historicalEnsemble);
var anomalySSP585 = ssp585Ensemble.subtract(historicalEnsemble);

// --- 6. VISUALIZATION SETTINGS ---
var rainfallVis = {min: 100, max: 800, palette: ['#f7fbff','#9ecae1','#084594']};
var anomalyVis = {
  min: -100, 
  max: 300, 
  palette: ['#d73027','#fc8d59','#fee090','#e0f3f8','#91bfdb','#4575b4']
};

// Layer display for immediate inspection
Map.addLayer(historicalEnsemble, rainfallVis, '1. Top 10 MME: Historical Baseline');
Map.addLayer(anomalySSP585, anomalyVis, '2. Top 10 MME: Anomaly (SSP5-8.5)');

// --- 7. EXPORT ENSEMBLE MAPS FOR EXTERNAL CARTOGRAPHY ---
// These files drive the 1200 DPI maps generated in the Python environment
var exportConfig = [
  {img: historicalEnsemble, name: 'Top10_Hist_1981_2014_NEW'},
  {img: ssp245Ensemble, name: 'Top10_SSP245_Full_NEW'},
  {img: ssp585Ensemble, name: 'Top10_SSP585_Full_NEW'},
  {img: anomalySSP245, name: 'Top10_Change_SSP245_NEW'},
  {img: anomalySSP585, name: 'Top10_Change_SSP585_NEW'}
];

exportConfig.forEach(function(item) {
  Export.image.toDrive({
    image: item.img,
    description: item.name,
    scale: 25000, // Balanced scale for regional ensemble mapping
    region: studyArea.geometry().bounds(),
    fileFormat: 'GeoTIFF',
    maxPixels: 1e13,
    crs: 'EPSG:4326'
  });
});

print('Ensemble exports initiated. Please check the Tasks tab.');
