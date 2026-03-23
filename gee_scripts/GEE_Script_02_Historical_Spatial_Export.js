/**
 * SCRIPT 02: HISTORICAL SPATIAL EVALUATION & GEOTIFF EXPORT (1981-2014)
 * -------------------------------------------------------------------------
 * Purpose: Process and export Mean Annual Rainfall (mm/year) for CHIRPS 
 * and 34 CMIP6 GCMs to drive spatial validation and mapping.
 * Authors: Tesfalem W. Ghebretnsae, Elsayed S. Mohamed, Umar Joseph James
 * -------------------------------------------------------------------------
 */

// --- 1. CONFIGURATION & STUDY AREA ---
var studyArea = ee.FeatureCollection("projects/YOUR_PROJECT/assets/SELECTED_ZONES_WGS1984");

var startPeriod = '1981-01-01';
var endPeriod = '2015-01-01';

var modelList = [
  'ACCESS-CM2','ACCESS-ESM1-5','BCC-CSM2-MR','CESM2','CESM2-WACCM',
  'CMCC-CM2-SR5','CMCC-ESM2','CNRM-CM6-1','CNRM-ESM2-1','CanESM5',
  'EC-Earth3','EC-Earth3-Veg-LR', 'FGOALS-g3','GFDL-CM4','GFDL-ESM4',
  'GISS-E2-1-G','HadGEM3-GC31-LL','HadGEM3-GC31-MM','IITM-ESM',
  'INM-CM4-8','INM-CM5-0','IPSL-CM6A-LR','KACE-1-0-G','KIOST-ESM',
  'MIROC-ES2L','MIROC6','MPI-ESM1-2-HR','MPI-ESM1-2-LR','MRI-ESM2-0',
  'NESM3','NorESM2-LM','NorESM2-MM','TaiESM1','UKESM1-0-LL'
];

// Visualization Parameters for Rainfall (400 to 2500 mm/year)
var rainfallVis = {
  min: 400,
  max: 2500,
  palette: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594']
};

// --- 2. OBSERVED DATA PROCESSING (CHIRPS) ---
// Calculate the annual mean from the sum of pentads across the 34-year period
var chirpsObservedMean = ee.ImageCollection("UCSB-CHG/CHIRPS/PENTAD")
  .filterDate(startPeriod, endPeriod)
  .sum()
  .divide(34) // Convert total sum to annual average
  .clip(studyArea);

Map.addLayer(chirpsObservedMean, rainfallVis, 'CHIRPS (Observed Mean)');

// Export CHIRPS GeoTIFF
Export.image.toDrive({
  image: chirpsObservedMean,
  description: 'CHIRPS_Mean_Annual_Rainfall_Historical',
  scale: 1000,
  region: studyArea.geometry(),
  fileFormat: 'GeoTIFF',
  crs: 'EPSG:4326'
});

// --- 3. GCM DATA PROCESSING & EXPORT LOOP ---
modelList.forEach(function(modelName) {
  var modelCollection = ee.ImageCollection("NASA/GDDP-CMIP6")
    .filter(ee.Filter.and(
      ee.Filter.eq('model', modelName), 
      ee.Filter.eq('scenario', 'historical')
    ))
    .filterDate(startPeriod, endPeriod)
    .select('pr');
  
  // Conversion: flux (kg/m2/s) to mean annual total (mm/year)
  // Factor: 86400 (sec/day) * 365.25 (days/year)
  var annualMeanProjection = modelCollection.mean()
    .multiply(86400)
    .multiply(365.25)
    .clip(studyArea);
  
  // Add to map (Layers hidden by default to optimize browser performance)
  Map.addLayer(annualMeanProjection, rainfallVis, modelName, false); 
  
  // Export each individual model for spatial validation/ranking
  Export.image.toDrive({
    image: annualMeanProjection,
    description: modelName + '_Mean_Annual_Rainfall_Historical',
    scale: 1000, // 1km resolution for spatial analysis
    region: studyArea.geometry(),
    fileFormat: 'GeoTIFF',
    crs: 'EPSG:4326'
  });
});

print('Spatial processing started. Access the Tasks tab to trigger exports.');
