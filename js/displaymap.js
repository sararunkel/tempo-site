document.addEventListener('DOMContentLoaded', function() {
    // Your map initialization code here
    const displayMap = new MapInitializer(
        displayConfig.containerId,
        displayConfig.data,
        displayConfig.stops,
        displayConfig.variable
    );
    displayMap.initializeMap();
});