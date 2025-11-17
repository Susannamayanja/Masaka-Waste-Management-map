// Masaka, Uganda Waste Management Dataset
const masakaData = {
    "type": "FeatureCollection",
    "features": [
        // Legal Waste Collection Sites
        {
            "type": "Feature",
            "properties": {
                "id": 1,
                "name": "Masaka Main Recycling Center",
                "type": "legal",
                "address": "Kimaanya Road, Near Central Market",
                "materials": ["Plastic", "Paper", "Glass", "Metal", "Organic Waste"],
                "hours": "7:00 AM - 6:00 PM",
                "status": "Operational",
                "phone": "+256 772 123 456",
                "description": "Main recycling facility serving Masaka municipality. Accepts all types of recyclable materials.",
                "capacity": "Large",
                "last_cleared": "2024-02-10"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7342, -0.3330]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 2,
                "name": "Nyendo Community Waste Point",
                "type": "legal",
                "address": "Nyendo Trading Center",
                "materials": ["General Waste", "Recyclables", "Organic"],
                "hours": "24/7",
                "status": "Operational",
                "description": "Community waste collection point in Nyendo. Serves residential and commercial areas.",
                "capacity": "Medium",
                "last_cleared": "2024-02-12"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7167, -0.3390]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 3,
                "name": "Kitovu Hospital Waste Facility",
                "type": "legal",
                "address": "Kitovu Hospital Road",
                "materials": ["Medical Waste", "General Waste", "Hazardous Materials"],
                "hours": "8:00 AM - 5:00 PM",
                "status": "Operational",
                "phone": "+256 752 234 567",
                "description": "Specialized medical waste management facility. Proper disposal of hazardous medical materials.",
                "capacity": "Medium",
                "last_cleared": "2024-02-11"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7420, -0.3450]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 4,
                "name": "Kimaanya Collection Point",
                "type": "legal",
                "address": "Kimaanya Housing Estate",
                "materials": ["Household Waste", "Recyclables", "Garden Waste"],
                "hours": "24/7",
                "status": "Operational",
                "description": "Residential area waste collection serving Kimaanya estate and surrounding communities.",
                "capacity": "Small",
                "last_cleared": "2024-02-13"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7280, -0.3250]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 5,
                "name": "Masaka Industrial Waste Facility",
                "type": "legal",
                "address": "Industrial Area, Boma Road",
                "materials": ["Industrial Waste", "Construction Debris", "Hazardous Materials"],
                "hours": "9:00 AM - 4:00 PM (Mon-Fri)",
                "status": "Operational",
                "description": "Industrial waste management facility. Handles construction and manufacturing waste.",
                "capacity": "Large",
                "last_cleared": "2024-02-09"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7480, -0.3350]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 6,
                "name": "Central Market Waste Station",
                "type": "legal",
                "address": "Masaka Central Market",
                "materials": ["Market Waste", "Organic Matter", "Packaging"],
                "hours": "6:00 AM - 8:00 PM",
                "status": "Operational",
                "description": "Dedicated waste collection for market vendors. Handles high volumes of organic waste.",
                "capacity": "Medium",
                "last_cleared": "2024-02-14"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7325, -0.3325]
            }
        },

        // Illegal Dumping Sites
        {
            "type": "Feature",
            "properties": {
                "id": 7,
                "name": "Lake Side Illegal Dumping",
                "type": "illegal",
                "address": "Near Lake Nabugabo Road",
                "materials": ["Plastic Waste", "Household Items", "Construction Debris", "Electronic Waste"],
                "reported_date": "2024-01-15",
                "severity": "High",
                "reported_by": "Community Members",
                "description": "Large illegal dumping site near water source. Significant environmental hazard.",
                "risk": "Water contamination, wildlife hazard",
                "cleanup_priority": "Urgent"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7100, -0.3500]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 8,
                "name": "Market Backstreet Dumping",
                "type": "illegal",
                "address": "Behind Masaka Central Market",
                "materials": ["Market Waste", "Organic Matter", "Plastic Packaging", "Food Waste"],
                "reported_date": "2024-01-20",
                "severity": "Medium",
                "reported_by": "Market Vendors Association",
                "description": "Unauthorized waste dumping behind market. Attracts pests and creates odor issues.",
                "risk": "Public health hazard, pest attraction",
                "cleanup_priority": "High"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7320, -0.3320]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 9,
                "name": "Residential Area Dumping",
                "type": "illegal",
                "address": "Kabwoko Settlement",
                "materials": ["Household Waste", "Furniture", "Electronics", "Construction Materials"],
                "reported_date": "2024-01-25",
                "severity": "Medium",
                "reported_by": "Local Residents Committee",
                "description": "Illegal dumping in residential area. Affects community living conditions.",
                "risk": "Children safety concern, visual pollution",
                "cleanup_priority": "Medium"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7250, -0.3200]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 10,
                "name": "Roadside Dumping Site",
                "type": "illegal",
                "address": "Masaka-Mbarara Highway",
                "materials": ["Plastic Bottles", "Packaging", "Household Waste", "Tires"],
                "reported_date": "2024-02-01",
                "severity": "Low",
                "reported_by": "Highway Maintenance",
                "description": "Scattered dumping along major highway. Mostly plastic and packaging waste.",
                "risk": "Visual pollution, drainage blockage",
                "cleanup_priority": "Low"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7400, -0.3300]
            }
        },

        // Community Support Centers
        {
            "type": "Feature",
            "properties": {
                "id": 11,
                "name": "Masaka Regional Hospital",
                "type": "community",
                "address": "Hospital Road, Masaka",
                "services": ["Healthcare", "Public Health Education", "Environmental Health"],
                "hours": "24/7",
                "contact": "+256 482 123 456",
                "description": "Primary healthcare facility providing public health services and environmental health education.",
                "programs": ["Community Health", "Disease Prevention", "Sanitation Education"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7400, -0.3400]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 12,
                "name": "Masaka Municipal Council",
                "type": "community",
                "address": "District Headquarters, Masaka",
                "services": ["Waste Management", "Environmental Protection", "Public Services"],
                "hours": "8:00 AM - 5:00 PM",
                "contact": "+256 482 234 567",
                "description": "Local government offices coordinating waste management and environmental protection programs.",
                "programs": ["Clean City Initiative", "Waste Collection", "Environmental Enforcement"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7350, -0.3340]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 13,
                "name": "Community Environmental Center",
                "type": "community",
                "address": "Kimaanya Community Hall",
                "services": ["Environmental Education", "Recycling Training", "Community Cleanups"],
                "hours": "9:00 AM - 4:00 PM",
                "contact": "Community Development Office",
                "description": "Community-led environmental education and waste management training center.",
                "programs": ["Recycling Workshops", "Cleanup Campaigns", "Youth Environmental Clubs"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7300, -0.3280]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 14,
                "name": "Masaka Public Library",
                "type": "community",
                "address": "Boma Grounds, Masaka",
                "services": ["Environmental Education", "Community Meetings", "Information Center"],
                "hours": "8:30 AM - 5:30 PM",
                "contact": "+256 482 345 678",
                "description": "Public library serving as information center for environmental and community programs.",
                "programs": ["Educational Programs", "Community Awareness", "Information Dissemination"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7370, -0.3360]
            }
        }
    ]
};