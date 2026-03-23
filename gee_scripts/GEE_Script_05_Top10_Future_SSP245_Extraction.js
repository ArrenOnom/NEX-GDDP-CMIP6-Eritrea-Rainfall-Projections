/**
 * SCRIPT 05: REFINED FUTURE EXTRACTION - SSP2-4.5 (2015-2100)
 * -------------------------------------------------------------------------
 * Purpose: Extract zonal precipitation statistics for the Top 10 performing 
 * GCMs under the SSP2-4.5 (Middle-of-the-road) future climate scenario.
 * Authors: Tesfalem W. Ghebretnsae, Elsayed S. Mohamed, Umar Joseph James
 * -------------------------------------------------------------------------
 */

// --- 1. CONFIGURATION & STUDY AREA ---
// Note: Users must upload their own shapefile to GEE Assets and update the path below.
var studyArea = ee.FeatureCollection("projects/YOUR_PROJECT/assets/SELECTED_ZONES_WGS1984");

// --- 2. TOP 10 MODELS (CRI RANKED SELECTION) ---
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
// Filtering for the SSP2-4.5 (Shared Socioeconomic Pathway) future scenario
var futureCollectionSSP245 = ee.ImageCollection("NASA/GDDP-CMIP6")
  .filter(ee.Filter.and(
    ee.Filter.inList('model', top10CRI),
    ee.Filter.eq('scenario', 'ssp245')
  ))
  .filterDate('2015-01-01', '2101-01-01') // Analysis through end of 21st century
  .select('pr');

// --- 4. SPATIOTEMPORAL EXTRACTION LOGIC ---
// Mapping across each model to calculate monthly cumulative precipitation (mm/month)
var futureDataSSP245 = top10CRI.map(function(modelName) {
  var modelSpecificCol = futureCollectionSSP245.filter(ee.Filter.eq('model', modelName));
  
  return modelSpecificCol.map(function(img) {
    var imgDate = img.date();
    // Dynamically calculate days in month for precise flux conversion
    var daysInMonth = imgDate.advance(1, 'month').difference(imgDate, 'day');
    
    // Unit Conversion: kg/m^2/s (flux) to mm/month (depth)
    // Conversion factor: 86400 seconds in a day
    var monthlyTotalPrecip = img.multiply(86400).multiply(daysInMonth);
    
    var spatialStats = monthlyTotalPrecip.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: studyArea.geometry(),
      scale: 25000, // 0.25-degree nominal resolution
      maxPixels: 1e9
    });

    return ee.Feature(null, {
      'Model': modelName,
      'Scenario': 'ssp245',
      'Year': imgDate.get('year'),
      'Month': imgDate.get('month'),
      'Precip_mm': spatialStats.get('pr')
    });
  });
});

// --- 5. DATA EXPORT ---
var finalExportTable = ee.FeatureCollection(futureDataSSP245).flatten();

Export.table.toDrive({
  collection: finalExportTable,
  description: 'CMIP6_Eritrea_Top10_Future_SSP245_2015_2100',
  fileFormat: 'CSV',
  selectors: ['Model', 'Scenario', 'Year', 'Month', 'Precip_mm']
});

print('SSP2-4.5 Future extraction initiated. Please check the Tasks tab.');
