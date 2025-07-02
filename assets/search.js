var selector = {
    searchIconButton: '[data-search-drawer]',
    resultContainer: '[data-search-result]',
    searchInput: '[data-searchbar__input]',
    searchForm: '[data-mg-search]',
    searchClose: '[data-search-close]',
    recentSearchClear: '[data-recent-clear]'
};
let formSearch = document.querySelectorAll(selector.searchForm);
let formDestination = '/search';
Array.from(formSearch).forEach(function(form) {
    formDestination = form.getAttribute('action');
    form.addEventListener("submit", function(event) {
        const form = event.target;
        const formFields = form.elements;
        const searchTerm = formFields.q.value;
        if (searchTerm.replace(/\s/g, '').length > 0) {
            __setRecentSearch(searchTerm);
        }
    });
});
let searchSelectors = document.querySelectorAll(selector.searchIconButton);
if (searchSelectors) {
    Array.from(searchSelectors).forEach(function(seachSelector) {
        seachSelector.addEventListener("click", (e) => {
            e.preventDefault();
            var searchDrawer = document.querySelector(".searchbar");
            if (searchDrawer.classList.contains('search-drawer-active')) {
                searchDrawer.classList.remove('search-drawer-active');
                document.querySelector('body').classList.remove('no-scroll')
                stopFocusRotation();
                previousFocusElement.focus();
                previousFocusElement = '';
            } else {
                searchDrawer.classList.add('search-drawer-active');
                document.querySelector('body').classList.add('no-scroll')
                let querySelectorForSearch = document.querySelector("[data-recent-search]");
                if (__getRecentSearch() && querySelectorForSearch) {
                    querySelectorForSearch.innerHTML = __getRecentSearch();
                    __clearRecentSearch();
                    querySelectorForSearch.classList.remove('hidden')
                }
                previousFocusElement = seachSelector;
                focusElementsRotation(searchDrawer);
                setTimeout(() => {
                    document.querySelector(selector.searchInput).setAttribute('tabindex', '0');
                    document.querySelector(selector.searchInput).focus()
                }, 100);
            }
            __searchResult(document.querySelector(selector.searchInput).value = '');
        });
        seachSelector.addEventListener("keydown", (e) => {
            document.querySelector('body').classList.add('tab-focus')
        })
    })
}
let searchCloses = document.querySelectorAll(selector.searchClose);
if (searchCloses) {
    Array.from(searchCloses).forEach(function(seachClose) {
        seachClose.addEventListener("click", (e) => {
            e.preventDefault();
            var searchDrawer = document.querySelector(".searchbar");
            if (searchDrawer.classList.contains('search-drawer-active')) {
                stopFocusRotation();
                if (previousFocusElement) {
                    previousFocusElement.focus();
                }
                previousFocusElement = '';
                searchDrawer.classList.remove('search-drawer-active');
                document.querySelector('body').classList.remove('no-scroll')
            }
        });
    })
}
// search input 
var searchTyping;
document.querySelector(selector.searchInput).addEventListener("keyup", (event) => {
    event.preventDefault();
    clearTimeout(searchTyping);
    searchTyping = setTimeout(function() {
        let searchTerm = document.querySelector(selector.searchInput).value;
        if (searchTerm.replace(/\s/g, '').length > 0) {
            __setRecentSearch(searchTerm);
        }
        __searchResult(searchTerm);
    }, 1000)

});

// searchResult funtion
var __searchResult = function(searchTerm) {
        let resultContainer = document.querySelector(selector.resultContainer);
        let querySelectorForSearch = document.querySelector("[data-recent-search]");
        if (__getRecentSearch() && querySelectorForSearch) {
            querySelectorForSearch.innerHTML = __getRecentSearch();
            __clearRecentSearch();
            // querySelectorForSearch.classList.remove('hidden')
        }
        if (searchTerm.replace(/\s/g, '').length > 0) {
            resultContainer.innerHTML = preLoadLoadGif;
            fetch(formDestination + "/suggest?section_id=predictive-search&q=" + searchTerm)
                .then((response) => {
                    return response.text();
                })
                .then((responseText) => {
                    let resultsMarkup = new DOMParser().parseFromString(responseText, 'text/html');
                    resultContainer.innerHTML = resultsMarkup.querySelector('#shopify-section-predictive-search').innerHTML;
                    if (__getRecentSearch() && querySelectorForSearch) {
                        querySelectorForSearch.innerHTML = __getRecentSearch();
                        querySelectorForSearch.classList.add('hidden')
                    }
                    if (animationStatus) {
                        if (AOS) {
                            AOS.refreshHard()
                        }
                    }
                })
        } else {
            resultContainer.innerHTML = '';
            if (__getRecentSearch() && querySelectorForSearch) {
                querySelectorForSearch.innerHTML = __getRecentSearch();
                __clearRecentSearch();
                querySelectorForSearch.classList.remove('hidden')
            }
        }
    }
    // set recent search item in the local storage
var __setRecentSearch = function(sarchItem) {
    var localStorageValue = JSON.parse(localStorage.getItem("recent-search")) || [];
    if (localStorageValue && localStorageValue.length > 0) {
        if (localStorageValue.indexOf(sarchItem) < 0) {
            if (localStorageValue.length >= 20) {
                localStorageValue.shift();
            }
            localStorageValue.push(sarchItem)
            localStorage.setItem("recent-search", JSON.stringify(localStorageValue));
        }
    } else {
        localStorageValue.push(sarchItem);
        localStorage.setItem("recent-search", JSON.stringify(localStorageValue));
    }
}
var __clearRecentSearch = function() {
        let clearButton = document.querySelector(selector.recentSearchClear);
        let querySelectorForSearch = document.querySelector("[data-recent-search]");
        if (clearButton) {
            clearButton.addEventListener('click', function(event) {
                event.preventDefault();
                localStorage.removeItem("recent-search");
                querySelectorForSearch.classList.add('hidden');
            })
        }
    }
    // get recent serach name;
var __getRecentSearch = function() {
    let localStorageValue = JSON.parse(localStorage.getItem("recent-search"));
    let recentHtml = '';
    if (localStorageValue && localStorageValue.length > 0) {
        recentHtml = '<h6 class="searchbar__recent-heading text-small">Recent Search</h6><ul class="list-unstyled recent__list">'
        localStorageValue.reverse();
        Array.from(localStorageValue).forEach(function(recent, index) {
            if (recent != '') {
                recentHtml += '<li class="recent__list-item"><a class="recent__list-link unstyled-link" href="/search?q=' + recent + '">' + recent + '</a></li>'
            }
        })
        recentHtml += '<li class="recent__list-item clear-recent" data-recent-clear><a class="recent__list-link unstyled-link" href="#">Clear</a></li></ul>';
    }
    return recentHtml;
}