const ID_MODULE_LIST_SIDE_BAR = 'module-list-side-bar';
const ID_MODULE_LIST_TRAINING = 'module-list-training';


/**
 * Drag & Drop
 */

function initiateSortable(){
    let moduleListTraining = document.getElementById(ID_MODULE_LIST_TRAINING);
    Sortable.create(moduleListTraining, {
        group: {
            name: 'module_list_training',
            put: true
        },
        fallbackOnBody: true,
		swapThreshold: 0.2,
        animation: 100,
        onAdd: runDynamicCalculationsOnAdd,
        onUpdate: runDynamicCalculationsOnUpdate
    });

    let moduleListSideBar = document.getElementById(ID_MODULE_LIST_SIDE_BAR);
    Sortable.create(moduleListSideBar, {
        group: ID_MODULE_LIST_SIDE_BAR
    });

    let breakListSideBar = document.getElementById('break-list-side-bar');
    Sortable.create(breakListSideBar, {
        group: {
            name: 'break-list-side-bar',
            pull: 'clone'
        },
        sort: false,
        onEnd: initiateTrashButton // we need this because on duplication the onclick event isn't copied
    });

    let index = 0;
    let resourceListLists = document.getElementsByClassName('resource-list');
    for(ul of resourceListLists){
        Sortable.create(ul, {
            group: {
                name: `resource-list-${index}`,
                put: function(){
                    const chosenClassName = document.getElementsByClassName('sortable-chosen')[0].className;
                    const isResource = chosenClassName.includes('resource');
                    const isTimeBreak = chosenClassName.includes('timebreak');
                    const isDayBreak = chosenClassName.includes('daybreak');
                    return isResource || isTimeBreak || isDayBreak;
                },
                pull: function(){
                    const chosenClassName = document.getElementsByClassName('sortable-chosen')[0].className;
                    const isTimeBreak = chosenClassName.includes('timebreak');
                    const isDayBreak = chosenClassName.includes('daybreak');
                    return isTimeBreak || isDayBreak;
                }
            },
            fallbackOnBody: true,
            animation: 100,
            onAdd: calculateTime,
            onUpdate: calculateTime
        });
        index++;
    }

    initiateTrashButton();
}

function initiateTrashButton(){
    let trashButtons = document.getElementsByClassName('trash');
    for(btn of trashButtons){
        btn.onclick = onClickDeleteOrMoveListElement
    }
}

function onClickDeleteOrMoveListElement(){    
    let currentElement = this;
    while(currentElement.tagName !== 'LI'){
        currentElement = currentElement.parentNode;
    }
    if(currentElement.className.includes('module')){
        let moduleListSideBar = document.getElementById(ID_MODULE_LIST_SIDE_BAR);
        moduleListSideBar.appendChild(currentElement);
        return;
    }
    currentElement.remove();
}

/**
 * Dynamic Calculations
 */

function runDynamicCalculationsOnUpdate(){
    calculateTime();
    calculateSummary();
}

function runDynamicCalculationsOnAdd(evt){
    let mod = evt.item;
    insertTimeBreaks(mod);
    calculateTime();
    calculateSummary();
}

function calculateTime(){
    let moduleList = Array.from(document.getElementById(ID_MODULE_LIST_TRAINING).childNodes);
    moduleList = moduleList.filter(el => el.nodeName.includes('LI'));

    let totalTime = 0;
    let moduleTime = 0;
    for(mod of moduleList){
        if(mod.className.includes('module')){
            let resources = document.querySelectorAll(`#${mod.id} .resource`);
        }
    }
}

function calculateSummary(){
    // TODO
}

/**
 * Time Breaks
 */

const BREAK_INTERVAL = 90;

function initiateTimeBreaks(){
    let moduleListTraining = Array.from(document.getElementById(ID_MODULE_LIST_TRAINING).childNodes);
    moduleListTraining = moduleListTraining.filter(el => el.nodeName.includes('LI') && el.className.includes('module'));
    for(mod of moduleListTraining){
        insertTimeBreaks(mod);
    }
}

function insertTimeBreaks(mod){
    let moduleList = Array.from(document.getElementById(ID_MODULE_LIST_TRAINING).childNodes);
    moduleList = moduleList.filter(el => el.nodeName.includes('LI') && el.className.includes('module'));
    const isLastModule = moduleList[moduleList.length - 1] === mod;

    let durationSum = 0;
    let resources = document.querySelectorAll(`#${mod.id} .resource`);
    for(resource of resources){
        const duration = parseInt(resource.dataset.duration);
        const isLastResource = resources[resources.length - 1] === resource;
        let hasBreakAfter = false;
        let searchBreak = true;
        let currentElement = resource;
        while(searchBreak){ // we do it this way of some strange html (nodeName: '#text') siblings appear on the rendered side inbetween the list elems
            currentElement = currentElement.nextSibling;
            if(currentElement != null && currentElement.nodeName === 'LI'&& (currentElement.className.includes('timebreak') || currentElement.className.includes('resource'))){
                if(currentElement.className.includes('timebreak')){
                    hasBreakAfter = true;
                    searchBreak = false;
                } 
                searchBreak = false;
            }
            if(currentElement === null){
                searchBreak = false;
            }
        }

        if(!isNaN(duration)){
            durationSum += duration;
        }
        if(duration >= BREAK_INTERVAL && !(isLastModule && isLastResource) && !hasBreakAfter){
            addTimeBreakAfter(resource);
            durationSum = 0;
        }
    }
}

function addTimeBreakAfter(resource){
    const MODULE_TIME_BREAK = document.getElementsByClassName('timebreak')[0].cloneNode(true);
    resource.parentNode.insertBefore(MODULE_TIME_BREAK, resource.nextSibling);
    initiateTrashButton();
}

/**
 * Word Cloud Filter
 */

const CLASS_SELECTED = 'selected';
const ID_WORDCLOUD = 'wordcloud';
const ID_SHOW_ALL_CATEGORIES = 'show-all-modules';

function initiateWordcloudFilter(){
    const wordcloud = document.getElementById(ID_WORDCLOUD).getElementsByTagName('li');
    for(li of wordcloud){
        li.onclick = updateWordcloudFilter;
    }
    updateSelectableModulesList();
}

function updateWordcloudFilter(){
    if(this.id === ID_SHOW_ALL_CATEGORIES){
        if(!this.className.includes(CLASS_SELECTED)){
            this.className = this.className.concat(CLASS_SELECTED);
            showAllModules();
            return;
        } else {
            const thisClasses = this.className.split(' ');
            const thisClassesWithoutSelected = thisClasses.filter(className => className != CLASS_SELECTED);
            this.className = thisClassesWithoutSelected.join(' ');
            hideAllModules();
            return;
        }
    }
    if(!this.className.includes(CLASS_SELECTED)){
        this.className = this.className.concat(CLASS_SELECTED);
    } else {
        const thisClasses = this.className.split(' ');
        const thisClassesWithoutSelected = thisClasses.filter(className => className != CLASS_SELECTED);
        this.className = thisClassesWithoutSelected.join(' ');
    }
    updateSelectableModulesList();
}

function unselectAllCategories(){
    const wordcloud = Array.from(document.getElementById(ID_WORDCLOUD).getElementsByTagName('li'));
    for(category of wordcloud){
        if(category.id != ID_SHOW_ALL_CATEGORIES){
            const categoryClasses = category.className.split(' ');
            const categoryClassesWithoutSelected = categoryClasses.filter(className => className != CLASS_SELECTED);
            category.className = categoryClassesWithoutSelected.join(' ');
        }
    }
}

function showAllModules(){
    unselectAllCategories()
    const sideBarModules = Array.from(document.getElementById(ID_MODULE_LIST_SIDE_BAR).getElementsByClassName('module'));
    for(mod of sideBarModules){
        mod.style.display = '';
    }
}

function hideAllModules(){
    unselectAllCategories()
    const sideBarModules = Array.from(document.getElementById(ID_MODULE_LIST_SIDE_BAR).getElementsByClassName('module'));
    for(mod of sideBarModules){
        mod.style.display = 'none';
    }
}

function updateSelectableModulesList(){
    const wordcloud = Array.from(document.getElementById(ID_WORDCLOUD).getElementsByTagName('li'));
    const wordcloudSelectedCategories = wordcloud.filter(li => li.className.includes(CLASS_SELECTED));
    const selectedCategories = wordcloudSelectedCategories.map(li => li.textContent);

    const sideBarModules = Array.from(document.getElementById(ID_MODULE_LIST_SIDE_BAR).getElementsByClassName('module'));

    let showAllModulesCategory = document.getElementById(ID_SHOW_ALL_CATEGORIES)
    const showAllModulesCategoryClasses = showAllModulesCategory.className.split(' ');
    const showAllModulesCategoryClassesWithoutSelected = showAllModulesCategoryClasses.filter(className => className != CLASS_SELECTED);
    showAllModulesCategory.className = showAllModulesCategoryClassesWithoutSelected.join(' ');

    if(selectedCategories.length == 0){
        hideAllModules();
        return;
    }

    for(mod of sideBarModules){
        const modClasses = mod.className.split(' ');
        for(category of selectedCategories){
            if(modClasses.includes(category)){
                mod.style.display = '';
                break; // --> change around here to implement "AND" filter style. bahaves atm like "OR"
            } else {
                mod.style.display = 'none';
            }
        }
    }
}

/**
 * and here we go
 */
window.onload = function(){
    initiateSortable();
    initiateWordcloudFilter();
    initiateTimeBreaks();
    calculateTime();
    calculateSummary();
}