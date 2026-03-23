/**
 * SCRIPT 01: HISTORICAL DATA EXTRACTION (1981-2014)
 * Purpose: Extract zonal precipitation statistics for CHIRPS (Observed) 
 * and 34 CMIP6 GCMs (Historical Scenario).
 * * Study Area: Eritrea Agricultural Heartlands
 * Data Sources: 
 * 1. UCSB-CHG/CHIRPS/PENTAD (Observed)
 * 2. NASA/GDDP-CMIP6 (Historical simulations)
 */

// --- 1. CONFIGURATION & STUDY AREA ---
// Note: Users must upload their own shapefile to GEE Assets and update the path below.
var studyArea = ee.FeatureCollection("projects/YOUR_PROJECT/assets/ERITREA_ZONES");

var startPeriod = '1981-01-01';
var endPeriod = '2015-01-01';

// List of 34 Global Climate Models (GCMs) analyzed in this study
var modelList = [
  'ACCESS-CM2','ACCESS-ESM1-5', 'BCC-CSM2-MR', 'CESM2', 'CESM2-WACCM',
  'CMCC-CM2-SR5', 'CMCC-ESM2', 'CNRM-CM6-1', 'CNRM-ESM2-1', 'CanESM5',
  'EC-Earth3', 'EC-Earth3-Veg-LR', 'FGOALS-g3', 'GFDL-CM4', 'GFDL-ESM4',
  'GISS-E2-1-G', 'HadGEM3-GC31-LL', 'HadGEM3-GC31-MM', 'IITM-ESM',
  'INM-CM4-8', 'INM-CM5-0', 'IPSL-CM6A-LR', 'KACE-1-0-G', 'KIOST-ESM',
  'MIROC-ES2L', 'MIROC6', 'MPI-ESM1-2-HR', 'MPI-ESM1-2-LR', 'MRI-ESM2-0',
  'NESM3', 'NorESM2-LM', 'NorESM2-MM', 'TaiESM1', 'UKESM1-0-LL'
];

// --- 2. CHIRPS OBSERVATIONAL DATA PROCESSING ---
// Extracting observed rainfall to serve as the ground-truth baseline
var observedRainfall = ee.ImageCollection("UCSB-CHG/CHIRPS/PENTAD")
  .filterDate(startPeriod, endPeriod)
  .map(function(img) {
    var spatialMean = img.reduceRegion({
      reducer: ee.Reducer.mean(), 
      geometry: studyArea.geometry(), 
      scale: 5000
    });
    return ee.Feature(null, {
      'Model': 'CHIRPS',
      'Year': img.date().get('year'),
      'Month': img.date().get('month'),
      // Pentad to Monthly approximation factor
      'Precip_mm': ee.Number(spatialMean.get('precipitation')).multiply(6) 
    });
  });

// --- 3. CMIP6 HISTORICAL MODEL EXTRACTION ---
// Mapping through 34 GCMs with a check for data validity (band 'pr')
var historicalSimulations = ee.FeatureCollection(modelList.map(function(modelName) {
  var modelCol = ee.ImageCollection("NASA/GDDP-CMIP6")
    .filter(ee.Filter.and(
      ee.Filter.eq('model', modelName),
      ee.Filter.eq('scenario', 'historical')
    ))
    .filterDate(startPeriod, endPeriod);
    
  // Verification: Ensure the 'pr' (precipitation) band is present
  var hasPrecipBand = modelCol.first().bandNames().contains('pr');
  
  return ee.FeatureCollection(ee.Algorithms.If(hasPrecipBand, 
    modelCol.map(function(img) {
      var imgDate = img.date();
      // Calculate number of days in the month for unit conversion
      var daysInMonth = imgDate.difference(imgDate.advance(1, 'month'), 'day').abs();
      var spatialMean = img.reduceRegion({
        reducer: ee.Reducer.mean(), 
        geometry: studyArea.geometry(), 
        scale: 27830 // Native NEX-GDDP resolution (~0.25 deg)
      });
      return ee.Feature(null, {
        'Model': modelName,
        'Year': imgDate.get('year'),
        'Month': imgDate.get('month'),
        // Conversion: kg/m^2/s to mm/month (86400 seconds in a day)
        'Precip_mm': ee.Number(spatialMean.get('pr')).multiply(86400).multiply(daysInMonth)
      });
    }), 
    ee.FeatureCollection([]) // Return empty collection if band is missing
  ));
})).flatten();

// --- 4. DATA CONSOLIDATION & EXPORT ---
// Merging observed and simulated data for performance evaluation (Ranking)
var consolidatedTable = observedRainfall.merge(historicalSimulations);

Export.table.toDrive({
  collection: consolidatedTable,
  description: 'CMIP6_Historical_Extraction_1981_2014',
  fileFormat: 'CSV',
  selectors: ['Model', 'Year', 'Month', 'Precip_mm']
});

print('Extraction initiated. Please run the task in the "Tasks" tab.');
