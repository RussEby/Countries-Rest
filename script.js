/**
 *  grab elements
 */
const themeToggleBTN = document.getElementById("btn-theme-Toggle");
const countryListArea = document.getElementById("country-list");
const regionSelectorOptions = document.getElementById("regionFilter-options");
const regionSelector = document.getElementById("regionFilter-Title");
const searchBoxArea = document.getElementById("search");

/**
 * Store the country List
 */
let countriesList;

/**
 * attach Listeners
 */
themeToggleBTN.addEventListener("click", handle_themeToggleBTN);
regionSelector.addEventListener("click", handle_toggleRegionOptions);
regionSelectorOptions.addEventListener("click", handle_regionSelection);
searchBoxArea.addEventListener("change", handle_searchBox);

/**
 *  Event handlers 
 */
function handle_themeToggleBTN(e) {
    document.getElementsByTagName("body")[0].classList.toggle("darkMode");
};

function handle_toggleRegionOptions(e) {
    regionSelectorOptions.classList.toggle("hideOptions");
};

function handle_regionSelection({ target }) {
    const selectedRegion = target.innerText;
    handle_toggleRegionOptions();

    const countriesItems = document.getElementsByClassName("countryItem");

    for (let country of countriesItems) {
        if (country.getElementsByClassName("country-region")[0].innerText.includes(selectedRegion) || selectedRegion == 'All') {
            country.style.display = 'block';
        } else {
            country.style.display = 'none';
        };
    }
};

function handle_searchBox({ target }) {
    const selectedName = target.value.toLowerCase();

    const countriesItems = document.getElementsByClassName("countryItem");

    for (let country of countriesItems) {
        if (country.getElementsByClassName("country-name")[0].innerText.toLowerCase().includes(selectedName)) {
            country.style.display = 'block';
        } else {
            country.style.display = 'none';
        }
    }
}

function handle_showDetails(country) {
    console.log(country);

    const modalArea = document.getElementById("modal-container");
    modalArea.classList.add("showModal");

    countryDetail = `
    <div class="country-modal">
        <header class="country-modal-header">
            <ion-icon name="close-circle-outline" class="close-icon"></ion-icon>
        </header>
        <div class="country-modal-details">   
            <section class="country-modal-flag">
                <img src="${country.flag}"/>
            </section>
            <section class="country-modal-stats">
                <h2>${country.name}</h2>
                <div class="col">
                    <p><strong>Native Name: </strong> ${country.nativeName}</p>
                    <p><strong>Population: </strong> ${country.population.toLocaleString()}</p>
                    <p><strong>Region:</strong> ${country.region}</p>
                    <p><strong>Sub Region:</strong> ${country.subregion}</p>
                    <p><strong>Capital:</strong> ${country.capital}</p>
                </div>
                <div class="col">
                    <p><strong>Top Level Domain:</strong> ${country.topLevelDomain}</p>
                    <p><strong>Currencies:</strong> ${getCurrencies(country.currencies)}</p>
                    <p><strong>Languages:</strong> ${getLanguages(country.languages)}</p>
                </div>
                <div class="bordering">
                    <p><strong>Border Countries:</strong> ${getBorderingCountries(country.borders)}</p>
                </div>
        </section>
        </div>
    </div>
    `;

    modalArea.innerHTML = countryDetail;

    modalArea.getElementsByTagName('ion-icon')[0].addEventListener("click", handle_closeModal);
}

function handle_closeModal() {
    const modalArea = document.getElementById("modal-container");
    modalArea.classList.toggle("showModal");
}

function swapModal(alpha3) {
    handle_showDetails(getCountryByAlpha3Code(alpha3));
}

/**
 * Formating Helpers
 */
function getLanguages(langs) {
    if (langs.length < 1) {
        return 'N/A';
    }
    const langsNames = [];

    langs.map((lang) => {
        langsNames.push(lang.name)
    });

    return langsNames.join(', ');
};

function getCurrencies(currencies) {
    if (currencies.length < 1) {
        return 'N/A';
    }
    const currNames = [];

    currencies.map((curr) => {
        currNames.push(curr.name)
    });

    return currNames.join(', ');
}

function getBorderingCountries(borders) {
    borderList = '<div>';

    getCountryByAlpha3Code(borders[0]);

    borders.map((border) => {
        borderList += `<button class="borderBtn" onclick="swapModal('${border}')">${getCountryByAlpha3Code(border).name}</button>`;
    })

    borderList += '</div>';


    return borderList;
};

/**
 * Data processes
 */
function getCountryByAlpha3Code(alpha3) {
    return countriesList.filter(country => country.alpha3Code === alpha3)[0];
}

/**
 * Load Countries
 */
async function getCountries() {
    const res = await fetch('https://restcountries.eu/rest/v2/all');
    countriesList = await res.json();

    buildCountryList(countriesList);
    buildRegionFilter(countriesList);
};

/**
 * Build the Country List
 */
function buildCountryList(countries) {
    const countryListElem = document.createElement('div');
    countryListElem.classList.add('countryList');

    countries.map((country) => {
        countryListElem.appendChild(buildCountryItem(country));
    });

    countryListArea.appendChild(countryListElem);
};

function buildCountryItem(country) {
    const countryItem = document.createElement('div');
    countryItem.classList.add('countryItem');
    countryItem.addEventListener("click", () => { handle_showDetails(country) });

    countryItem.innerHTML =
        `
        <img src="${country.flag}"/>
        <div class="countryItem-info">
            <h3 class="country-name">${country.name}</h3>
            <p><strong>Population:</strong> ${country.population.toLocaleString()} </p>
            <p class="country-region"><strong>Region</strong>: ${country.region === "" ? 'N/A' : country.region}</p>
            <p><strong>Capitol</strong>: ${country.capital}</p>
        </div>
    `
    return countryItem;
}

function buildRegionFilter(countries) {
    const regions = [];

    countries.map((country) => {
        if (regions.indexOf(country.region) === -1) {
            regions.push(country.region);
        }
    });

    regions.sort();

    let blankIndex = regions.indexOf("");

    if (blankIndex != -1) {
        regions[blankIndex] = 'N/A';
    }

    regions.unshift('All');

    regions.map((region) => {
        regionSelectorOptions.appendChild(buildRegionOption(region));
    });
};

function buildRegionOption(region) {
    const optionElem = document.createElement("div");
    optionElem.classList.add("region-option");

    optionElem.innerText = region;
    return optionElem;
}

/**
 * Get the ball started
 */
getCountries();


