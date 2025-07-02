const showLessText = 'Show Less';
const showMoreText = 'Show More';
var clearAllFilterButton = false,
minPriceRange='',
maxPriceRang='';
var movingButtons=document.querySelector('.sd-sidebar-background');
window.addEventListener('load', (event) => { 
    applyFilters();
    sortByOptions();
    sortByClose();
    showMoreFilters();
    var clearAllfilter=document.getElementById("removeFilterdata");
    if(clearAllfilter){
        clearAllfilter.addEventListener("click", (e) => {
        e.preventDefault();
        var section = document.getElementById('CollectionProductsContainer');
        if (section) {
            var sectionId = section.dataset.id;
            var _url = clearAllfilter.getAttribute('href');
            getFilterData(clearAllfilter,sectionId, _url);
        } 
        });
    }
   
    $(window).scroll(function() {
        var scrollElement=document.querySelector("[data-scroll]");
        if(scrollElement){
            infineScroll(scrollElement);
        }
       
    });
   
    loadMoreCollection();
   
});


function showMoreFilters() {
    const filterForm = document.getElementById('FiltersForm');
    if(filterForm){
        var showMoreFilters = filterForm.querySelectorAll('.filters-expand');
        if (showMoreFilters) {
            Array.from(showMoreFilters).forEach(function(showMoreFilter) {
                showMoreFilter.addEventListener("click", (e) => {
                    e.preventDefault();
                    if (showMoreFilter.classList.contains('active')) {
                        showMoreFilter.classList.remove('active');
                        DOMAnimations.slideUp(showMoreFilter.parentNode.querySelector('.more-options'), 150);
                        showMoreFilter.querySelector('span').textContent = showMoreText;
                    } else {
                        showMoreFilter.classList.add('active');
                        DOMAnimations.slideDown(showMoreFilter.parentNode.querySelector('.more-options'), 150);
                        showMoreFilter.querySelector('span').textContent = showLessText;
                    }
                });
            });
        }
    }
}
function applyFilters() {
    var section = document.getElementById('CollectionProductsContainer');
    if (section) {
        var sectionParent = section.closest('.shopify-section');
        var sectionId = section.dataset.id;
        const filterForm = document.getElementById('FiltersForm');
        if (!filterForm) {
            return false;
        }
        const rangeInput = document.querySelectorAll(".mg-range-input input"),
        priceInput = document.querySelectorAll(".mg-price-input input"),
        range = document.querySelector("#priceSilderProgress");
        if(rangeInput.length > 0){
            let priceGap = rangeInput[0].getAttribute('step');
            priceInput.forEach((input) => {
                input.addEventListener("change", (e) => {
                    let minPrice = parseInt(priceInput[0].value),
                    maxPrice = parseInt(priceInput[1].value),
                    maxPriceRange=parseInt(priceInput[1].getAttribute("data-max-value"));
                    if(minPrice > maxPriceRange){
                        minPrice = maxPriceRange;
                        priceInput[0].value = minPrice;              
                    }
                    getFilterData(input, sectionId)
                });
            });
            rangeInput.forEach((input) => {
                input.addEventListener("change", (event) => {
                    rangeSlider(input,event);
                    getFilterData(input, sectionId);
                
                });
                input.addEventListener("input", (event) => {
                    rangeSlider(input,event);
                    
                });
        
            });
            var rangeSlider = function(input,event){
                let minVal = parseInt(rangeInput[0].value),
                    maxVal = parseInt(rangeInput[1].value);   
                    minPriceRange=(minVal / rangeInput[0].max) * 100 + "%";
                    maxPriceRang=100 - (maxVal / rangeInput[1].max) * 100 + "%";
                    if (maxVal - minVal < priceGap) {
                        if (event.target.className === "priceslider-range-min") {
                            rangeInput[0].value = maxVal - priceGap;
                        } else {
                            rangeInput[1].value = minVal + priceGap;
                        }
                    }else {
                        priceInput[0].value = minVal;
                        priceInput[1].value = maxVal;
                        range.style.left = minPriceRange;
                        range.style.right = maxPriceRang;
                    }
            }
        }
        if (window.innerWidth > 767) {
            var inputs = filterForm.querySelectorAll('input[type=checkbox]');
            Array.from(inputs).forEach(function(input) {
                input.addEventListener("click", () => {
                  if (window.innerWidth > 767) {
                    getFilterData(input, sectionId)
                  }
                });
            });
        } else {
            filterForm.addEventListener("submit", (e) => {
                e.preventDefault();
                getFilterData(filterForm, sectionId)
                document.querySelector('body').classList.remove('open-filter-sort');
            });
    }
    var removeFilters = sectionParent.querySelectorAll('a.mg-applied-filter-remove');
    Array.from(removeFilters).forEach(function(removeFilter) { 
        removeFilter.addEventListener("click", (e) => {
            e.preventDefault();
            if(removeFilter.hasAttribute('mg-applied-filter-cross-all')){
                var _url = removeFilter.getAttribute('href');
                getFilterData(removeFilter, sectionId, _url);
                return false;
            }
            else{
                var _url = removeFilter.getAttribute('href');
                getFilterData(removeFilter, sectionId, _url);
                }
                
            });
        
    });
    }
}
function sortByClose() {
    var section = document.getElementById('CollectionProductsContainer');
    var sortByClose = document.querySelectorAll('.filter-close-mobile');
    if(section){
        var sectionId = section.dataset.id;
        Array.from(sortByClose).forEach(function(closeBtn) {
            closeBtn.addEventListener("click", (e) => {
                e.preventDefault();
                var sortMenu = closeBtn.closest('details');
                var slide= sortMenu.querySelector('.detail-expand');
                if (sortMenu.hasAttribute('open')) {
                    DOMAnimations.slideUp(slide);
                    setTimeout(function(){
                        sortMenu.removeAttribute('open'); 
                    },500)
                }
            });
        });
    }
}
function sortByOptions(){
    var section = document.getElementById('CollectionProductsContainer');
    var sortBy = document.querySelectorAll('[name="sort_by"]');
    if(section){
        var sectionId = section.dataset.id;
        Array.from(sortBy).forEach(function(sort) {
            sort.addEventListener("change", (e) => {
                e.preventDefault();
                Array.from(sortBy).forEach(function(sort) {
                    sort.parentNode.classList.remove('selected');
                })
                sort.parentNode.classList.add('selected');
                var sortMenu = document.querySelector('.collection-sortby-selected');
                var slide= document.getElementById('sort__list');
                if (sortMenu.hasAttribute('open')) {
                    DOMAnimations.slideUp(slide);
                    setTimeout(function(){
                        sortMenu.removeAttribute('open'); 
                    },500)
                }
                getFilterData(sort, sectionId);
            });
        });
    }
}
function fetchFilterData(url) {
    return fetch(url)
        .then(response => response.text())
}
function checkUrlParam(){
    let matchString="#filters-sidebar";
    var url=window.location;
    if(url.toString().includes(matchString))
    {
        if (window.innerWidth > 767) {
        matchString=matchString;
        }else{
            matchString=''; 
        }
    }else{
        matchString='';
    }
    return matchString
}
function getFilterData(input, sectionId, remove, minPriceRange, maxPriceRange) {
    let filterForm = document.getElementById('FiltersForm');
    const formData = new FormData(filterForm);
    var searchParameters = new URLSearchParams(formData).toString();
    var url = window.location.pathname + '?section_id=' + sectionId + '&' + searchParameters;
    var _updateUrl = window.location.pathname + '?' + searchParameters
    if (remove) {
        url = remove;
        _updateUrl = remove;
    }
    const html = fetchFilterData(url).then((responseText) => {
        const resultData = new DOMParser().parseFromString(responseText, 'text/html');
        var itemResultCount = resultData.querySelector('.products-count');
        var sortByHtml = '';
        if (resultData.getElementById('toolbox-sort')) {
            sortByHtml = resultData.getElementById('toolbox-sort').innerHTML;
        }
        var html = resultData.getElementById('CollectionProductsContainer');
        var elmnt = document.getElementById('CollectionProductsContainer');
        /* Result for the collection and search page */
        if (html){
        elmnt.innerHTML = html.innerHTML;
        let quickviewElements = elmnt.querySelectorAll(".quickView-action-link");
        Array.from(quickviewElements).forEach(function (element) {
          initQuickViewAction(element);
        });
        colorSwatchChanged(elmnt);
        productGridImageSlider(elmnt);
        } else {
            let productResultContainer = elmnt.querySelector('[data-collection-products]');
            if (productResultContainer) {
                productResultContainer.innerHTML = noResultFound;
            }
        }
        /* end */

        /* result for the search page */
        var totalresultcount= resultData.querySelector('.searchbar__result-heading');
        if(totalresultcount){
            document.querySelector('.searchbar__result-heading').innerHTML= totalresultcount.innerHTML;
        }
        var postResulthtml = resultData.getElementById('data-articale-result');
        var postResultElement=document.getElementById('data-articale-result');
        var searchResultElement=resultData.querySelector('[data-serach-pagination]');
        var searchElement=document.querySelector('[data-serach-pagination]');
        if(searchResultElement && searchResultElement.querySelector(".pagination")  ){
            searchElement.innerHTML=searchResultElement.innerHTML;  
        }else{
            if(searchElement){
                searchElement.innerHTML='';
            }
        }
        if(postResulthtml){ 
            postResultElement.innerHTML= postResulthtml.innerHTML;   
            postResultElement.classList.add("searchbar__result-content");
        }else{
            if(postResultElement){
                postResultElement.innerHTML='';
                postResultElement.classList.remove("searchbar__result-content");
            }
        }
        var pageResulthtml = resultData.getElementById('data-page-result');
        var pageResultElement= document.getElementById('data-page-result');
        if(pageResulthtml){
            pageResultElement.innerHTML=pageResulthtml.innerHTML;
            pageResultElement.classList.add("searchbar__result-content");
        }else{
            if(pageResultElement){
                pageResultElement.innerHTML='';
                pageResultElement.classList.remove("searchbar__result-content");
            } 
        }
        /* end */
        /*------------ update filter sidebar --------------*/
            var currentFilterItems = document.querySelectorAll(".filterby__list-item");
            var resultFilterItems=resultData.querySelectorAll(".filterby__list-item");
            if(resultFilterItems){ 
                Array.from(resultFilterItems).forEach(function(filterItem,index) {
                    let matchItem = currentFilterItems[index];
                    if(matchItem.querySelector(".priceslider-range-min")){    
                        matchItem.querySelector(".mg-range-input").innerHTML=filterItem.querySelector('.mg-range-input').innerHTML;
                        matchItem.querySelector(".mg-price-input").innerHTML=filterItem.querySelector('.mg-price-input').innerHTML;
                        let rangeInput = matchItem.querySelectorAll(".mg-range-input input")
                        minVal = parseInt(rangeInput[0].value),
                        rangeselector=filterItem.querySelector('#priceSilderProgress')
                        maxVal = parseInt(rangeInput[1].value);
                        minPriceRange=(minVal / rangeInput[0].max) * 100 + "%";
                        maxPriceRang=100 - (maxVal / rangeInput[1].max) * 100 + "%";
                        rangeselector.style.left = minPriceRange;
                        rangeselector.style.right = maxPriceRang;
                        matchItem.querySelector(".mg-slider").innerHTML=filterItem.querySelector('.mg-slider').innerHTML;
                    }
                    else{
                        matchItem.querySelector('.filter-name-list').innerHTML = filterItem.querySelector('.filter-name-list').innerHTML;
                    }
                }); 
            }
            let inputId = input.getAttribute('id');
            let updateInput = document.getElementById(inputId);
            if (updateInput) {
                updateInput.focus();
                let moreOption = updateInput.closest('.more-options');
                if (moreOption) {
                    moreOption.style.display = 'block';
                    let moreOptionText = updateInput.closest('.filter-name-list').querySelector('.filters-expand');
                    if (moreOptionText) {
                        moreOptionText.classList.add('active');
                        moreOptionText.querySelector('span').innerHTML = showLessText;

                    } 
                }
            }
        if (window.innerWidth > 767) {
        }
        else{
            let filterSideDrawer = document.getElementById('filters-sidebar');
            if(filterSideDrawer){
                filterSideDrawer.querySelector('[data-side-drawer-close]').click();
            }
        }
        /*------------ update product count --------------*/
        if (itemResultCount) {
            document.querySelector('.products-count').innerHTML = itemResultCount.innerHTML;
        }
        /*------------ update sort option  --------------*/
        if (document.getElementById('toolbox-sort')) {
            document.getElementById('toolbox-sort').innerHTML = sortByHtml;
        }
        sortByOptions();
        applyFilters();
        showMoreFilters(); 
        sideDrawerEventsInit();
        sortByClose();
        if(animationStatus){
            if (AOS) { 
                AOS.refreshHard() 
            }
        }
        triggered = false
        loadMoreCollection();
        history.pushState({}, null, _updateUrl);
    });
}

let triggered = false;
function infineScroll(scrollElement) {
    if(scrollElement && scrollElement.querySelector("a")){
        var nextUrl = scrollElement.querySelector("a").getAttribute("href");
        if (isOnScreen(scrollElement) && (triggered == false)) {
             triggered = true;
             scrollElement.querySelector("a").remove();
             scrollElement.querySelector('.load').classList.remove('hidden');
             fetchFilterData(nextUrl).then((responseText) => {
              scrollElement.remove();
              const resultData = new DOMParser().parseFromString(responseText, 'text/html');
              var html = resultData.getElementById('CollectionProductsContainer');
              var elmnt = document.getElementById('CollectionProductsContainer');
              
              /* Result for the collection and search page */
            if(html){
                elmnt.querySelector("[data-collection-products]").innerHTML+=  html.querySelector("[data-collection-products]").innerHTML
                let quickviewElements = elmnt.querySelectorAll(".quickView-action-link");
                Array.from(quickviewElements).forEach(function (element) {
                    initQuickViewAction(element);
                });
                colorSwatchChanged(elmnt);
                productGridImageSlider(elmnt);
                if(animationStatus){
                    if (AOS) { 
                        AOS.refreshHard() 
                    }
                }
                triggered = false
                loadMoreCollection();
            }
         })
        }
    }   
 }

 function loadMoreCollection(){
    var loadmoreButton =document.querySelector(".collection-load-more");
    if(loadmoreButton){
        loadmoreButton.addEventListener("click", (event) => {
            event.preventDefault();
            var scrollElement=document.querySelector("[data-load-more]");
            if(scrollElement){
               infineScroll(scrollElement);
            }          
        })
     }
 }