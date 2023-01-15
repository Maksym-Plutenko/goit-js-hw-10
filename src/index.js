import './css/styles.css';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function inputHandler(event) {
    const request = input.value.trim();

    if (request) {
        fetchCountries(request)
        .finally(() => {
            clearMarkup();
        })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }

            return response.json();
        })
        .then(data => {
            const numbersOfCountries = data.length;
            console.log(numbersOfCountries);

            if (data.length > 10) {
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            } else if (data.length > 1) {
                showCountryList(data, countryList);
            } else {
                showCountryInfo(data, countryInfo);
            }
        })
        .catch(error => {
            Notiflix.Notify.failure("Oops, there is no country with that name");
        }); 
    }
}

const debouncedInputHandler = debounce(inputHandler, DEBOUNCE_DELAY);

input.addEventListener('input', debouncedInputHandler);

function showCountryList(data, place) {
    const countryArray = data.map(country => {
        const flag = country.flags.png;
        const name = country.name.common;
        return `<li class="country-item">
                    <img src="${flag}" alt="the flag of the title country" class="country-flag">
                    <p class="country-name">${name}</p>
                </li>
                `
    });

    let markup = '';

    countryArray.forEach(element => {
        markup = markup + element;
    });

    place.innerHTML = markup;
}

function showCountryInfo(data, place) {
    const name = data[0].name.common;
    const flag = data[0].flags.png;
    const capital = data[0].capital[0];
    const population = data[0].population;
    const languages = data[0].languages;
    const languagesStr = Object.values(languages).join(', ');
    
    const markup = `
        <div class="country-info_name-card">
            <img src="${flag}" alt="the flag of the title country" class="country-info_flag country-flag">
            <h2 class="country-info_title">${name}</h2>
        </div>
        <p class="country-info_text"><b>Capital:</b> ${capital}</p>
        <p class="country-info_text"><b>Population:</b> ${population}</p>
        <p class="country-info_text"><b>Languages:</b> ${languagesStr}</p>
    `;

    place.innerHTML = markup;
}

function clearMarkup() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}