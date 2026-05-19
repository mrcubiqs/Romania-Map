document.addEventListener('DOMContentLoaded', function() {
    const regionElements = document.querySelectorAll('.cls-1');
    const regionSelector = document.getElementById('regionSelector');
    const tooltip = document.getElementById('tooltip');

    const regionNames = {
        'Banat': 'Banat',
        'Bucure_x219_ti-Ilfov': 'Bucure\u0219ti-Ilfov',
        'Dobrogea__x26__Sud-Est': 'Dobrogea & Sud-Est',
        'Moldova': 'Moldova',
        'Sud_Vest': 'Sud Vest',
        'Transilvania_Centru': 'Transilvania Centru',
        'Transilvania_Nord': 'Transilvania Nord'
    };

    const processedRegions = new Set();

    function getRegionCenter(regionId) {
        var elements = document.querySelectorAll('[data-name="' + regionId + '"]');
        var best = null, bestArea = 0;
        elements.forEach(function(el) {
            var b = el.getBoundingClientRect();
            var area = b.width * b.height;
            if (area > bestArea) { bestArea = area; best = el; }
        });
        return best || (elements.length ? elements[0] : null);
    }

    function highlightRegion(regionId) {
        regionElements.forEach(function(el) {
            el.style.fill = ''; el.style.opacity = ''; el.classList.remove('selected');
        });
        document.querySelectorAll('[data-name="' + regionId + '"]').forEach(function(el) {
            el.classList.add('selected');
        });
    }

    function updateTooltipPosition(el) {
        if (!el) return;
        var bbox = el.getBoundingClientRect();
        if (bbox.width === 0 && bbox.height === 0) return;
        var x = bbox.left + bbox.width / 2;
        var y = bbox.top + bbox.height / 2;
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
        tooltip.style.transform = 'translate(-50%, -50%)';
    }

    function showTooltip(el) {
        var regionId = el.getAttribute('data-name');
        tooltip.textContent = regionNames[regionId] || regionId;
        updateTooltipPosition(el);
        tooltip.style.display = 'block';
    }

    function hideTooltip() { tooltip.style.display = 'none'; }

    regionElements.forEach(function(el) {
        var regionId = el.getAttribute('data-name');
        if (!regionId) return;
        if (!processedRegions.has(regionId)) {
            processedRegions.add(regionId);
            var option = document.createElement('option');
            option.value = regionId;
            option.textContent = regionNames[regionId] || regionId;
            regionSelector.appendChild(option);
        }
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            highlightRegion(regionId);
            regionSelector.value = regionId;
            var bestEl = getRegionCenter(regionId);
            if (bestEl) showTooltip(bestEl);
        });
        el.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.opacity = '0.1';
            }
        });
        el.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.opacity = '';
            }
        });
    });

    regionSelector.addEventListener('change', function() {
        var regionId = this.value;
        if (!regionId) return;
        highlightRegion(regionId);
        var bestEl = getRegionCenter(regionId);
        if (bestEl) showTooltip(bestEl);
        else hideTooltip();
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.cls-1') && !e.target.closest('#regionSelector')) {
            hideTooltip();
            regionElements.forEach(function(el) {
                el.style.fill = ''; el.style.opacity = ''; el.classList.remove('selected');
            });
        }
    });

    window.addEventListener('scroll', hideTooltip);
    window.addEventListener('resize', function() {
        if (tooltip.style.display !== 'none') {
            var regionId = regionSelector.value;
            if (regionId) {
                var bestEl = getRegionCenter(regionId);
                if (bestEl) updateTooltipPosition(bestEl);
            }
        }
    });
});