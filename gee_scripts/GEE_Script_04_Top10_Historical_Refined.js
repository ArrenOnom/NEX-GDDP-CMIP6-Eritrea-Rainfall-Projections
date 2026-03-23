/**
 * SCRIPT 04: REFINED HISTORICAL EXTRACTION (TOP 10 CRI RANKED MODELS)
 * -------------------------------------------------------------------------
 * Purpose: Extract high-precision zonal precipitation statistics for the 
 * top 10 performing GCMs identified via the Comprehensive Rating Index (CRI).
 * Period: 1981-2014 (Baseline)
 * Authors: Tesfalem W. Ghebretnsae, Elsayed S. Mohamed, Umar Joseph James
 * -------------------------------------------------------------------------
 */

// --- 1. CONFIGURATION & STUDY AREA ---
// Note: Users must upload their own shapefile to GEE Assets and update the path below.
var studyArea = ee.FeatureCollection("projects/YOUR_PROJECT/assets/SELECTED_ZONES_WGS1984");

// --- 2. UPDATED TOP 10 MODELS (BASED ON CRI RANKING RESULTS) ---
var top10CRI = [
  'TaiESM1', 
  'GFDL-ESM4', 
  'FGOALS-g3', 
  'EC-Earth3', 
  'NESM3', 
  'MIROC6', 
  'MIROC-ES2L', 
  'MRI-ESM2-0', 
  'GFDL-CM4', 
  'BCC-CSM2-MR'
];

// --- 3. DATA RETRIEVAL ---
// Filtering the master NASA NEX-GDDP-CMIP6 collection for historical data
var historicalCollection = ee.ImageCollection("NASA/GDDP-CMIP6")
  .filter(ee.Filter.and(
    ee.Filter.inList('model', top10CRI),
    ee.Filter.eq('scenario', 'historical')
  ))
  .filterDate('1981-01-01', '2015-01-01') // Coverage: 1981 to 2014 inclusive
  .select('pr');

// --- 4. SEQUENTIAL EXTRACTION LOGIC ---
// Mapping across each model to calculate monthly cumulative precipitation (mm/month)
var refinedHistoricalData = top10CRI.map(function(modelName) {
  var modelSpecificCol = historicalCollection.filter(ee.Filter.eq('model', modelName));
  
  return modelSpecificCol.map(function(img) {
    var imgDate = img.date();
    // Dynamically calculate days in month for precise flux conversion
    var daysInMonth = imgDate.advance(1, 'month').difference(imgDate, 'day');
    
    // Conversion: kg/m^2/s (flux) to mm/month (total depth)
    // 86400 seconds per day
    var monthlyTotalPrecip = img.multiply(86400).multiply(daysInMonth);
    
    var spatialStats = monthlyTotalPrecip.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: studyArea.geometry(),
      scale: 25000, // Matching native resolution of NEX-GDDP (0.25 deg)
      maxPixels: 1e9
    });

    return ee.Feature(null, {
      'Model': modelName,
      'Scenario': 'historical',
      'Year': imgDate.get('year'),
      'Month': imgDate.get('month'),
      'Precip_mm': spatialStats.get('pr')
    });
  });
});

// --- 5. DATA EXPORT ---
// Consolidating the nested lists into a single flat FeatureCollection for CSV export
var finalExportTable = ee.FeatureCollection(refinedHistoricalData).flatten();

Export.table.toDrive({
  collection: finalExportTable,
  description: 'CMIP6_Eritrea_Top10_Historical_Refined_1981_2014',
  fileFormat: 'CSV',
  selectors: ['Model', 'Scenario', 'Year', 'Month', 'Precip_mm']
});

print('Refined Historical extraction started. Monitor progress in the Tasks tab.');
