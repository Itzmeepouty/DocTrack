/**
 * Office Module
 * 
 * Handles all office-related functionality including:
 * - Fetching office data from API
 * - Managing office dropdown UI
 * - Filtering and selecting offices
 * - Maintaining office data state
 */

let offices = [];
let filteredOffices = [];
let isOfficesLoaded = false;

const API_CONFIG = {
    HEADERS: {'Content-Type': 'application/json'}
};

async function fetchOffices() {
    try {
        const officeField = document.getElementById('office');
        officeField.placeholder = 'Loading offices...';
        officeField.disabled = true;

        const response = await fetch('/api/offices/active', {
            method: 'GET',
            headers: API_CONFIG.HEADERS
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        
        if (Array.isArray(data)) {
            offices = data;
        } else if (data.offices && Array.isArray(data.offices)) {
            offices = data.offices;
        } else if (data.data && Array.isArray(data.data)) {
            offices = data.data.map(office => office.name || office.officeName || office.title || office);
        } else {
            offices = [];
        }

        filteredOffices = [...offices];
        isOfficesLoaded = true;
        officeField.placeholder = 'Search for your office';
        officeField.disabled = false;

    } catch (error) {
        const officeField = document.getElementById('office');
        officeField.placeholder = 'Search for your office (using fallback data)';
        officeField.disabled = false;
    }

    return offices;
}

function showOfficeDropdown() {
    if (!isOfficesLoaded) {
        fetchOffices().then(() => isOfficesLoaded && showOfficeDropdown());
        return;
    }

    const dropdown = document.getElementById('officeDropdown');
    dropdown.classList.remove('hidden');
    populateOfficeList(filteredOffices);
}

function hideOfficeDropdown() {
    setTimeout(() => {
        document.getElementById('officeDropdown').classList.add('hidden');
    }, 200);
}

function populateOfficeList(officeList) {
    const officeListElement = document.getElementById('officeList');
    officeListElement.innerHTML = '';

    if (!isOfficesLoaded) {
        officeListElement.innerHTML = '<div class="px-4 py-2 text-gray-500 text-sm">Loading offices...</div>';
        return;
    }

    if (officeList.length === 0) {
        officeListElement.innerHTML = '<div class="px-4 py-2 text-gray-500 text-sm">No offices found</div>';
        return;
    }

    officeList.forEach(office => {
        const div = document.createElement('div');
        div.className = 'px-4 py-2 cursor-pointer dropdown-item text-sm hover:bg-gray-100 transition';

        const officeName = office.office_name || 'Unknown Office';
        const officeId = office.office_id || '';
        const officeAbb = office.office_abb || '';

        // Constructing HTML content
        div.innerHTML = `
            <span class="font-medium text-gray-900">${officeName}</span>
            <span class="text-xs text-gray-400 ml-2">(${officeAbb})</span>
            <span class="hidden office-id">${officeId}</span>
        `;

        div.onclick = () => selectOffice(`${officeName} (${officeAbb})`, officeId);
        
        officeListElement.appendChild(div);
    });
}


function selectOffice(officeName, officeId = null) {
    const officeField = document.getElementById('office');
    officeField.value = officeName;

    if (officeId) {
        officeField.setAttribute('data-office-id', officeId);
    }

    document.getElementById('officeDropdown').classList.add('hidden');
}

function filterOffices(searchTerm) {
    if (!isOfficesLoaded) return;

    filteredOffices = offices.filter(office => {
        const officeName = typeof office === 'string' ? office : (office.name || office.officeName || office.title || '');
        return officeName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    populateOfficeList(filteredOffices);
    if (searchTerm.length > 0) showOfficeDropdown();
}

function initOfficeModule() {
    document.addEventListener('click', function(event) {
        const officeField = document.getElementById('office');
        const dropdown = document.getElementById('officeDropdown');
        if (!officeField.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.add('hidden');
        }
    });

    document.addEventListener('DOMContentLoaded', populateOfficeList.bind(null, offices));
}

export {
    offices,
    fetchOffices,
    showOfficeDropdown,
    hideOfficeDropdown,
    populateOfficeList,
    selectOffice,
    filterOffices,
    initOfficeModule
};

window.fetchOffices = fetchOffices;
window.showOfficeDropdown = showOfficeDropdown;
window.hideOfficeDropdown = hideOfficeDropdown;
window.populateOfficeList = populateOfficeList;
window.selectOffice = selectOffice;
window.filterOffices = filterOffices;
window.initOfficeModule = initOfficeModule;
