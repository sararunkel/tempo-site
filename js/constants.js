const zoomThresh = 5;
const firstSymbolId = 'ferry';//'road-simple'; 
const firstSymbolId2 = 'ferry';//'road-simple';
const project ='albers'
const mapCenter = [-105, 40];
const mapZoom = 8;

mapboxgl.accessToken = 'pk.eyJ1Ijoic3J1bmtlbCIsImEiOiJjbGRrZmdyc3cxbWxmM29udWd6cHZqeXA0In0.KDgLcBpTZkKMYMVcoory4Q';
    // A selector or reference to HTML element
const map_container = '#comparison-container';
const STOPS = [
    0, '#0a62c0',
    1, '#6ed4fc',
    2, '#a0ffb8',
    3, '#fff837',
    4, '#ffa646',
    5, '#d05134',
    6, '#75001d',
    7, '#4e0014'
];
//Dictionary of stops for the census data
const census_STOPS = {'PercentPOC':[
    10, '#F2EBF7',
    20, '#E3D8EB',
    30, '#D4C7DF',
    40, '#B4A0CA',
    50, '#9B7CB5',
    60, '#6f518a',
    70, '#523d6f'], 
    'MedianIncome':[
    30000, '#F2EBF7',
    60000, '#E3D8EB',
    90000, '#D4C7DF',
    120000, '#B4A0CA',
    180000, '#9B7CB5',
    2500000, '#7C54A0'],
    'MedianAge':[
    15, '#F2EBF7',
    30, '#E3D8EB',
    45, '#D4C7DF',
    60, '#B4A0CA',
    75, '#9B7CB5',
    100, '#7C54A0'],
    'PercentPoverty':[
    0, '#F2EBF7',
    5, '#E3D8EB',
    10, '#D4C7DF',
    15, '#B4A0CA',
    20, '#9B7CB5',
    25, '#7C54A0'],
}
    //'admin-1-boundary';
const bounds = [
    [-106.08195926, 38.8791579], // Southwest coordinates
    [-103.95380958, 40.73862622] // Northeast coordinates
    ];



let leftData = '../data/monthly/HAQ_TEMPO_NO2_CONUS_QA75_L3_Monthly_012024_15Z_V3.geojson';
let rightData = '../data/monthly/HAQ_TEMPO_NO2_CONUS_QA75_L3_Monthly_012024_22Z_V3.geojson';
