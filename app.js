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

    // Function to create popup content based on type
    function createPopupContent(properties) {
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
        }).bindPopup(createPopupContent(feature.properties));
        
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

    // Button functionality
    document.getElementById('about-btn').addEventListener('click', function() {
        alert('Masaka Waste Management Map\n\nThis interactive map shows waste management infrastructure and challenges in Masaka Municipality. The system helps identify legal collection points, illegal dumping sites, and community support centers for environmental health initiatives.');
    });

    document.getElementById('help-btn').addEventListener('click', function() {
        alert('How to Use This Map:\n\n• Click on any marker to see detailed information\n• Use filter buttons to show specific types of locations\n• Legal Sites: Official waste collection points\n• Illegal Sites: Reported dumping areas needing attention\n• Community Centers: Support and education facilities\n\nReport issues or suggest improvements through municipal channels.');
    });

    document.getElementById('contact-btn').addEventListener('click', function() {
        alert('Contact Masaka Municipal Council:\n\nWaste Management Department\nPhone: +256 482 234 567\nEmail: waste-management@masaka.go.ug\nAddress: District Headquarters, Masaka\n\nOffice Hours: 8:00 AM - 5:00 PM, Monday - Friday');
    });

    // Action button functionality
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