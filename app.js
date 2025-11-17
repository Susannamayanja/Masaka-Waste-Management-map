// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Masaka Waste Management Map...');
    
    // Initialize the map centered on Masaka, Uganda
    const map = L.map('map').setView([-0.3330, 31.7342], 13);

    // Add OpenStreetMap tiles with proper attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Masaka Municipal Council',
        maxZoom: 18,
        minZoom: 10
    }).addTo(map);

    // Add scale control - VISIBLE VERSION
    L.control.scale({
        imperial: false,
        metric: true,
        position: 'bottomleft',
        maxWidth: 200
    }).addTo(map);

    // Add zoom control
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // Create layer groups for different types
    const legalLayer = L.layerGroup();
    const illegalLayer = L.layerGroup();
    const communityLayer = L.layerGroup();
    
    // Routing control and variables
    let routingControl = null;
    let currentLocationMarker = null;
    let currentLocation = null;

    // Custom icons with different colors
    const legalIcon = L.divIcon({
        html: '<i class="fas fa-trash-alt"></i>',
        className: 'custom-div-icon legal-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    const illegalIcon = L.divIcon({
        html: '<i class="fas fa-exclamation-triangle"></i>',
        className: 'custom-div-icon illegal-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    const communityIcon = L.divIcon({
        html: '<i class="fas fa-users"></i>',
        className: 'custom-div-icon community-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    const currentLocationIcon = L.divIcon({
        html: '<i class="fas fa-location-arrow"></i>',
        className: 'custom-div-icon current-location-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    // Function to create popup content based on type
    function createPopupContent(properties, latlng) {
        let content = `
            <div class="popup-content">
                <h3>${properties.name}</h3>
                <p><strong>Address:</strong> ${properties.address}</p>
        `;

        if (properties.type === 'legal') {
            content += `
                <p><strong>Type:</strong> <span class="status-legal">Legal Waste Collection</span></p>
                <p><strong>Materials Accepted:</strong> ${properties.materials.join(', ')}</p>
                <p><strong>Operating Hours:</strong> ${properties.hours}</p>
                <p><strong>Status:</strong> ${properties.status}</p>
                <p><strong>Capacity:</strong> ${properties.capacity}</p>
                <p><strong>Last Cleared:</strong> ${properties.last_cleared}</p>
                ${properties.phone ? `<p><strong>Contact:</strong> ${properties.phone}</p>` : ''}
                <p><strong>Description:</strong> ${properties.description}</p>
            `;
        } else if (properties.type === 'illegal') {
            content += `
                <p><strong>Type:</strong> <span class="status-illegal">Illegal Dumping Site</span></p>
                <p><strong>Materials Found:</strong> ${properties.materials.join(', ')}</p>
                <p><strong>Reported Date:</strong> ${properties.reported_date}</p>
                <p><strong>Severity Level:</strong> ${properties.severity}</p>
                <p><strong>Reported By:</strong> ${properties.reported_by}</p>
                <p><strong>Environmental Risk:</strong> ${properties.risk}</p>
                <p><strong>Cleanup Priority:</strong> ${properties.cleanup_priority}</p>
                <p><strong>Description:</strong> ${properties.description}</p>
            `;
        } else if (properties.type === 'community') {
            content += `
                <p><strong>Type:</strong> Community Support Center</p>
                <p><strong>Services Offered:</strong> ${properties.services.join(', ')}</p>
                <p><strong>Operating Hours:</strong> ${properties.hours}</p>
                ${properties.contact ? `<p><strong>Contact:</strong> ${properties.contact}</p>` : ''}
                <p><strong>Programs:</strong> ${properties.programs.join(', ')}</p>
                <p><strong>Description:</strong> ${properties.description}</p>
            `;
        }

        // Add routing button for legal waste sites
        if (properties.type === 'legal') {
            content += `
                <div class="popup-actions">
                    <button class="route-btn" data-lat="${latlng.lat}" data-lng="${latlng.lng}" data-name="${properties.name}">
                        <i class="fas fa-route"></i> Get Directions from My Location
                    </button>
                </div>
            `;
        }

        content += `</div>`;
        return content;
    }

    // Function to get appropriate icon
    function getIconForType(type) {
        switch(type) {
            case 'legal': return legalIcon;
            case 'illegal': return illegalIcon;
            case 'community': return communityIcon;
            default: return legalIcon;
        }
    }

    // Add features to the map
    masakaData.features.forEach(feature => {
        const lat = feature.geometry.coordinates[1];
        const lng = feature.geometry.coordinates[0];
        
        const marker = L.marker([lat, lng], {
            icon: getIconForType(feature.properties.type)
        }).bindPopup(createPopupContent(feature.properties, {lat: lat, lng: lng}));
        
        // Add to appropriate layer group
        switch(feature.properties.type) {
            case 'legal':
                legalLayer.addLayer(marker);
                break;
            case 'illegal':
                illegalLayer.addLayer(marker);
                break;
            case 'community':
                communityLayer.addLayer(marker);
                break;
        }
    });

    // Add all layers to map initially
    legalLayer.addTo(map);
    illegalLayer.addTo(map);
    communityLayer.addTo(map);

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    let activeFilter = 'all';

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            activeFilter = this.getAttribute('data-filter');
            applyFilter(activeFilter);
            updateStatistics();
        });
    });

    function applyFilter(filter) {
        // Remove all layers first
        map.removeLayer(legalLayer);
        map.removeLayer(illegalLayer);
        map.removeLayer(communityLayer);
        
        // Add layers based on filter
        switch(filter) {
            case 'all':
                map.addLayer(legalLayer);
                map.addLayer(illegalLayer);
                map.addLayer(communityLayer);
                break;
            case 'legal':
                map.addLayer(legalLayer);
                break;
            case 'illegal':
                map.addLayer(illegalLayer);
                break;
            case 'community':
                map.addLayer(communityLayer);
                break;
        }
    }

    // Update statistics
    function updateStatistics() {
        const legalCount = masakaData.features.filter(f => f.properties.type === 'legal').length;
        const illegalCount = masakaData.features.filter(f => f.properties.type === 'illegal').length;
        const communityCount = masakaData.features.filter(f => f.properties.type === 'community').length;
        
        let totalCount;
        
        switch(activeFilter) {
            case 'all':
                totalCount = masakaData.features.length;
                break;
            case 'legal':
                totalCount = legalCount;
                break;
            case 'illegal':
                totalCount = illegalCount;
                break;
            case 'community':
                totalCount = communityCount;
                break;
        }
        
        document.getElementById('total-count').textContent = totalCount;
        document.getElementById('legal-count').textContent = legalCount;
        document.getElementById('illegal-count').textContent = illegalCount;
        document.getElementById('community-count').textContent = communityCount;
    }

    // Initialize statistics
    updateStatistics();

    // Get current location function
    function getCurrentLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        // Show loading state
        const locationBtn = document.querySelector('.location-btn');
        const originalText = locationBtn.innerHTML;
        locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';
        locationBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                currentLocation = [lat, lng];

                // Remove existing location marker
                if (currentLocationMarker) {
                    map.removeLayer(currentLocationMarker);
                }

                // Add current location marker
                currentLocationMarker = L.marker([lat, lng], {
                    icon: currentLocationIcon,
                    zIndexOffset: 1000
                }).addTo(map)
                .bindPopup('Your Current Location')
                .openPopup();

                // Center map on current location
                map.setView([lat, lng], 15);

                // Reset button
                locationBtn.innerHTML = originalText;
                locationBtn.disabled = false;

                console.log('Current location found:', currentLocation);
            },
            function(error) {
                console.error('Error getting location:', error);
                alert('Unable to get your current location. Please ensure location services are enabled.');
                
                // Reset button
                locationBtn.innerHTML = originalText;
                locationBtn.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    }

    // Function to calculate route
    function calculateRouteToWasteSite(destinationLat, destinationLng, siteName) {
        if (!currentLocation) {
            alert('Please get your current location first using the location button.');
            return;
        }

        // Remove existing route
        if (routingControl) {
            map.removeControl(routingControl);
        }

        // Create routing control
        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(currentLocation[0], currentLocation[1]),
                L.latLng(destinationLat, destinationLng)
            ],
            routeWhileDragging: false,
            showAlternatives: false,
            fitSelectedRoutes: true,
            show: true,
            collapsible: true,
            language: 'en',
            lineOptions: {
                styles: [{color: '#2E8B57', weight: 6, opacity: 0.8}]
            },
            createMarker: function(i, waypoint, n) {
                if (i === 0) {
                    return L.marker(waypoint.latLng, {
                        icon: currentLocationIcon
                    }).bindPopup('Your Location');
                } else {
                    return L.marker(waypoint.latLng, {
                        icon: getIconForType('legal')
                    }).bindPopup(siteName);
                }
            }
        }).addTo(map);

        // Show route instructions container
        const instructionsContainer = document.getElementById('route-instructions');
        instructionsContainer.style.display = 'block';
        instructionsContainer.innerHTML = '<h3>Route to ' + siteName + '</h3><div class="routing-instructions"></div>';

        // Handle route events
        routingControl.on('routesfound', function(e) {
            const routes = e.routes;
            const summary = routes[0].summary;
            
            // Update instructions container with route summary
            const instructionsDiv = instructionsContainer.querySelector('.routing-instructions');
            instructionsDiv.innerHTML += `
                <div class="route-summary">
                    <p><strong>Total Distance:</strong> ${(summary.totalDistance / 1000).toFixed(2)} km</p>
                    <p><strong>Estimated Time:</strong> ${Math.round(summary.totalTime / 60)} minutes</p>
                </div>
            `;
        });

        routingControl.on('routingerror', function(e) {
            console.error('Routing error:', e.error);
            alert('Unable to calculate route. Please try again.');
        });
    }

    // Function to clear route
    function clearRoute() {
        if (routingControl) {
            map.removeControl(routingControl);
            routingControl = null;
        }
        
        const instructionsContainer = document.getElementById('route-instructions');
        instructionsContainer.style.display = 'none';
        instructionsContainer.innerHTML = '';
    }

    // Event delegation for route buttons in popups
    map.on('popupopen', function(e) {
        const popup = e.popup;
        const routeBtn = popup._contentNode.querySelector('.route-btn');
        
        if (routeBtn) {
            routeBtn.addEventListener('click', function() {
                const lat = parseFloat(this.getAttribute('data-lat'));
                const lng = parseFloat(this.getAttribute('data-lng'));
                const name = this.getAttribute('data-name');
                
                calculateRouteToWasteSite(lat, lng, name);
                map.closePopup();
            });
        }
    });

    // Button functionality
    document.getElementById('about-btn').addEventListener('click', function() {
        alert('Masaka Waste Management Map\n\nThis interactive map shows waste management infrastructure and challenges in Masaka Municipality. The system helps identify legal collection points, illegal dumping sites, and community support centers for environmental health initiatives.');
    });

    document.getElementById('help-btn').addEventListener('click', function() {
        alert('How to Use This Map:\n\n• Click on any marker to see detailed information\n• Use filter buttons to show specific types of locations\n• Legal Sites: Official waste collection points\n• Illegal Sites: Reported dumping areas needing attention\n• Community Centers: Support and education facilities\n• Use the location button to find your current position\n• Click "Get Directions" on legal waste sites for routing\n\nReport issues or suggest improvements through municipal channels.');
    });

    document.getElementById('contact-btn').addEventListener('click', function() {
        alert('Contact Masaka Municipal Council:\n\nWaste Management Department\nPhone: +256 482 234 567\nEmail: waste-management@masaka.go.ug\nAddress: District Headquarters, Masaka\n\nOffice Hours: 8:00 AM - 5:00 PM, Monday - Friday');
    });

    // Action button functionality
    document.querySelector('.location-btn').addEventListener('click', getCurrentLocation);
    
    document.querySelector('.clear-route-btn').addEventListener('click', clearRoute);

    document.querySelector('.report-btn').addEventListener('click', function() {
        alert('Report Illegal Dumping:\n\nTo report illegal dumping in Masaka:\n\n1. Call Municipal Hotline: +256 482 234 567\n2. Visit Municipal Council Offices\n3. Contact Local Council Leaders\n4. Use the Municipal Mobile App\n\nPlease provide:\n- Exact location\n- Type of waste\n- Photos if possible\n- Date and time observed');
    });

    document.querySelector('.info-btn').addEventListener('click', function() {
        alert('Recycling Guidelines - Masaka Municipality:\n\n♻️ SEPARATE YOUR WASTE:\n• Plastic: Clean bottles, containers\n• Paper: Dry paper, cardboard\n• Glass: Bottles, jars (no broken glass)\n• Metal: Cans, foil, containers\n• Organic: Food waste, garden waste\n• Hazardous: Batteries, chemicals, medical waste\n\n📅 COLLECTION SCHEDULE:\n• Residential areas: Monday, Wednesday, Friday\n• Commercial areas: Daily\n• Market areas: Twice daily\n\n📍 Use designated collection points only');
    });

    console.log('Masaka Waste Management Map initialized successfully!');
    console.log('Total waste management points loaded:', masakaData.features.length);
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Map initialization error:', e.error);
});