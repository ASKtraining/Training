const ID_MODULE_LIST_SIDE_BAR = 'module-list-side-bar';
const ID_MODULE_LIST_TRAINING = 'module-list-training';
const CLASS_DAYBREAK = 'daybreak';
const CLASS_TIMEBREAK = 'timebreak';
const CLASS_MODULE = 'module';
const CLASS_RESOURCE = 'resource';
const CLASS_TRAININGSTART = 'trainingstart';


/**
 * Drag & Drop
 */
const ANIMATION_SPEED = 85;

function initiateSortable() {
    let moduleListTraining = document.getElementById(ID_MODULE_LIST_TRAINING);
    Sortable.create(moduleListTraining, {
        filter: '.trainingstart',
        group: {
            name: 'module_list_training',
            put: true
        },
        fallbackOnBody: true,
        swapThreshold: 0.2,
        animation: ANIMATION_SPEED,
        onAdd: runDynamicCalculationsOnAdd,
        onUpdate: runDynamicCalculationsOnUpdate
    });

    let moduleListSideBar = document.getElementById(ID_MODULE_LIST_SIDE_BAR);
    Sortable.create(moduleListSideBar, {
        group: ID_MODULE_LIST_SIDE_BAR,
        animation: ANIMATION_SPEED
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
    for (ul of resourceListLists) {
        Sortable.create(ul, {
            group: {
                name: `resource-list-${index}`,
                put: function () {
                    const chosenClassName = document.getElementsByClassName('sortable-chosen')[0].className;
                    const isResource = chosenClassName.includes(CLASS_RESOURCE);
                    const isTimeBreak = chosenClassName.includes(CLASS_TIMEBREAK);
                    const isDayBreak = chosenClassName.includes(CLASS_DAYBREAK);
                    return isResource || isTimeBreak || isDayBreak;
                },
                pull: function () {
                    const chosenClassName = document.getElementsByClassName('sortable-chosen')[0].className;
                    const isTimeBreak = chosenClassName.includes(CLASS_TIMEBREAK);
                    const isDayBreak = chosenClassName.includes(CLASS_DAYBREAK);
                    return isTimeBreak || isDayBreak;
                }
            },
            fallbackOnBody: true,
            animation: ANIMATION_SPEED,
            onAdd: calculateTime,
            onUpdate: calculateTime
        });
        index++;
    }
}

function initiateTrashButton() {
    let trashButtons = document.getElementsByClassName('trash');
    for (btn of trashButtons) {
        btn.onclick = onClickDeleteOrMoveListElement
    }
}

function onClickDeleteOrMoveListElement() {
    let currentElement = this;
    while (currentElement.tagName !== 'LI') {
        currentElement = currentElement.parentNode;
    }
    if (currentElement.className.includes(CLASS_MODULE)) {
        let moduleListSideBar = document.getElementById(ID_MODULE_LIST_SIDE_BAR);
        moduleListSideBar.appendChild(currentElement);
        return;
    }
    currentElement.remove();
    calculateTime();
}

function initiateTimeEdit(){
    intiateTrainigstartTimeButton();
    intiateDaybreakTimeButton();
    intiateDaybreakModuleButton();
}

function intiateTrainigstartTimeButton(){
    let trainingstartClock = document.querySelectorAll(`.${CLASS_TRAININGSTART} .fa-clock`)[0];
    trainingstartClock.onclick = toggleTimeEditWindow;
}

function toggleTimeEditWindow(){
    let timeEdit = getChildByClassName(this.parentNode.parentNode, 'edit-time');
    if(timeEdit == null){
        return;
    }
    if(timeEdit.style.display == 'block'){
        timeEdit.style.display = '';
    } else {
        timeEdit.style.display = 'block';
    }
}

function intiateDaybreakTimeButton(){
    let trainingstartClock = document.querySelectorAll(`.${CLASS_DAYBREAK} .fa-clock`);
    for(let clock of trainingstartClock){
        clock.onclick = toggleTimeEditWindow;
    }
}

function intiateDaybreakTimeButton(){
    let trainingstartClock = document.querySelectorAll(`.${CLASS_MODULE} .fa-clock`);
    for(let clock of trainingstartClock){
        clock.onclick = toggleTimeEditWindow;
    }
}

/**
 * Dynamic Calculations
 */

function runDynamicCalculationsOnUpdate() {
    calculateTime();
    calculateSummary();
}

function runDynamicCalculationsOnAdd(evt) {
    let mod = evt.item;
    insertTimeBreaks(mod);
    calculateTime();
    calculateSummary();
}

function calculateTime() {
    let totalTime = 0;
    let clockTime = new Date();

    let trainingstart = document.getElementById(CLASS_TRAININGSTART);
    const duration = parseInt(trainingstart.dataset.duration);
    clockTime = parseDatefromString(clockTime, trainingstart.dataset.start);
    startTime = clockTime;
    clockTime = insertClockTime(clockTime, duration, trainingstart);
    totalTime+=duration;

    let moduleList = Array.from(document.getElementById(ID_MODULE_LIST_TRAINING).childNodes);
    moduleList = moduleList.filter(el => el.nodeName.includes('LI'));
    for (mod of moduleList) {
        if (mod.className.includes(CLASS_MODULE)) {
            const duration = parseInt(mod.dataset.duration);
            clockTime = insertClockTime(clockTime, duration, mod);
            totalTime+=duration;

            let resources = document.querySelectorAll(`#${mod.id} li`);
            let moduleEndTime = null;
            for(let el of resources){
                if(el.className.includes(CLASS_DAYBREAK)){
                    clockTime = parseDatefromString(clockTime, el.dataset.start);
                }
                const duration = parseInt(el.dataset.duration);
                clockTime = insertClockTime(clockTime, duration, el);
                moduleEndTime = clockTime;
                totalTime+=duration;
            }

        } else if (mod.className.includes(CLASS_TIMEBREAK)) {
            const duration = parseInt(mod.dataset.duration);
            clockTime = insertClockTime(clockTime, duration, mod);
            totalTime+=duration;

        } else if(mod.className.includes(CLASS_DAYBREAK)){
            let duration = parseInt(mod.dataset.duration);
            clockTime = parseDatefromString(clockTime, mod.dataset.start);
            clockTime = insertClockTime(clockTime, duration, mod);
            totalTime+=duration;

        } 
    }
}

function parseDatefromString(clockTime, daytime) {
    const splitDaytime = daytime.split(':');
    clockTime.setHours(splitDaytime[0]);
    clockTime.setMinutes(splitDaytime[1]);
    return clockTime;
}

function insertClockTime(clockTime, duration, mod) {
    let clockTimeSpan = getChildByClassName(mod, 'clock-time');
    if(clockTimeSpan == null){
        return clockTime;
    }
    const oldClockTime = new Date(clockTime);
    clockTime = new Date(clockTime.getTime() + duration * 60 * 1000);
    const clockTimeString = `${convertTimeToString(oldClockTime)} - ${convertTimeToString(clockTime)}`;
    clockTimeSpan.innerText = clockTimeString;
    return clockTime;
}

function convertTimeToString(clockTime) {
    let hour = clockTime.getHours();
    let minute = clockTime.getMinutes();
    let second = clockTime.getSeconds();
    let temp = '' + ((hour > 12) ? hour - 12 : hour);
    if (hour == 0)
        temp = '12';
    temp += ((minute < 10) ? ':0' : ':') + minute;
    temp += (hour >= 12) ? 'pm' : 'am';
    return temp;
}

// this function returns the first child node matching the className it finds at the nearest point to the root
function getChildByClassName(el, className){
    let runLoop = true;
    let nextLevelChilds = el.childNodes;
    while(runLoop){
        let currentChilds = nextLevelChilds;
        nextLevelChilds = [];
        for(let i = 0; i < currentChilds.length; i++) {
            nextLevelChilds.push(...currentChilds[i].childNodes);
            if (currentChilds[i].className == className) {
                return currentChilds[i];
            }
        }
        if(nextLevelChilds.length == 0){
            return null;
        }
        currentChilds = nextLevelChilds;
    }
}

function calculateSummary() {
    // TODO
}

/**
 * Time Breaks
 */

const BREAK_INTERVAL = 90;

function initiateTimeBreaks() {
    let moduleListTraining = Array.from(document.getElementById(ID_MODULE_LIST_TRAINING).childNodes);
    moduleListTraining = moduleListTraining.filter(el => el.nodeName.includes('LI') && el.className.includes(CLASS_MODULE));
    for (mod of moduleListTraining) {
        insertTimeBreaks(mod);
    }
}

function insertTimeBreaks(mod) {
    if(!mod.className.includes(CLASS_MODULE)) {
        return;
    }
    let moduleList = Array.from(document.getElementById(ID_MODULE_LIST_TRAINING).childNodes);
    moduleList = moduleList.filter(el => el.nodeName.includes('LI') && el.className.includes(CLASS_MODULE));
    const isLastModule = moduleList[moduleList.length - 1] === mod;

    let durationSum = 0;
    let resources = document.querySelectorAll(`#${mod.id} .${CLASS_RESOURCE}`);
    for (resource of resources) {
        const duration = parseInt(resource.dataset.duration);
        const isLastResource = resources[resources.length - 1] === resource;
        let hasBreakAfter = false;
        let searchBreak = true;
        let currentElement = resource;
        while (searchBreak) { // we do it this way of some strange html (nodeName: '#text') siblings appear on the rendered side inbetween the list elems
            currentElement = currentElement.nextSibling;
            if (currentElement != null && currentElement.nodeName === 'LI' && (currentElement.className.includes(CLASS_TIMEBREAK) || currentElement.className.includes(CLASS_RESOURCE))) {
                if (currentElement.className.includes(CLASS_TIMEBREAK)) {
                    hasBreakAfter = true;
                    searchBreak = false;
                }
                searchBreak = false;
            }
            if (currentElement === null) {
                searchBreak = false;
            }
        }

        if (!isNaN(duration)) {
            durationSum += duration;
        }
        if (duration >= BREAK_INTERVAL && !(isLastModule && isLastResource) && !hasBreakAfter) {
            addTimeBreakAfter(resource);
            durationSum = 0;
        }
    }
}

function addTimeBreakAfter(resource) {
    const MODULE_TIME_BREAK = document.getElementsByClassName(CLASS_TIMEBREAK)[0].cloneNode(true);
    resource.parentNode.insertBefore(MODULE_TIME_BREAK, resource.nextSibling);
    initiateTrashButton();
}

/**
 * Word Cloud Filter
 */

const CLASS_SELECTED = 'selected';
const ID_WORDCLOUD = 'wordcloud';
const ID_SHOW_ALL_CATEGORIES = 'show-all-modules';

function initiateWordcloudFilter() {
    const wordcloud = document.getElementById(ID_WORDCLOUD).getElementsByTagName('li');
    for (li of wordcloud) {
        li.onclick = updateWordcloudFilter;
    }
}

function updateWordcloudFilter() {
    if (this.id === ID_SHOW_ALL_CATEGORIES) {
        if (!this.className.includes(CLASS_SELECTED)) {
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
    if (!this.className.includes(CLASS_SELECTED)) {
        this.className = this.className.concat(CLASS_SELECTED);
    } else {
        const thisClasses = this.className.split(' ');
        const thisClassesWithoutSelected = thisClasses.filter(className => className != CLASS_SELECTED);
        this.className = thisClassesWithoutSelected.join(' ');
    }
    updateSelectableModulesList();
}

function unselectAllCategories() {
    const wordcloud = Array.from(document.getElementById(ID_WORDCLOUD).getElementsByTagName('li'));
    for (category of wordcloud) {
        if (category.id != ID_SHOW_ALL_CATEGORIES) {
            const categoryClasses = category.className.split(' ');
            const categoryClassesWithoutSelected = categoryClasses.filter(className => className != CLASS_SELECTED);
            category.className = categoryClassesWithoutSelected.join(' ');
        }
    }
}

function showAllModules() {
    unselectAllCategories()
    const sideBarModules = Array.from(document.getElementById(ID_MODULE_LIST_SIDE_BAR).getElementsByClassName(CLASS_MODULE));
    for (mod of sideBarModules) {
        mod.style.display = '';
    }
}

function hideAllModules() {
    unselectAllCategories()
    const sideBarModules = Array.from(document.getElementById(ID_MODULE_LIST_SIDE_BAR).getElementsByClassName(CLASS_MODULE));
    for (mod of sideBarModules) {
        mod.style.display = 'none';
    }
}

function updateSelectableModulesList() {
    const wordcloud = Array.from(document.getElementById(ID_WORDCLOUD).getElementsByTagName('li'));
    const wordcloudSelectedCategories = wordcloud.filter(li => li.className.includes(CLASS_SELECTED));
    const selectedCategories = wordcloudSelectedCategories.map(li => li.textContent);

    const sideBarModules = Array.from(document.getElementById(ID_MODULE_LIST_SIDE_BAR).getElementsByClassName(CLASS_MODULE));

    let showAllModulesCategory = document.getElementById(ID_SHOW_ALL_CATEGORIES)
    const showAllModulesCategoryClasses = showAllModulesCategory.className.split(' ');
    const showAllModulesCategoryClassesWithoutSelected = showAllModulesCategoryClasses.filter(className => className != CLASS_SELECTED);
    showAllModulesCategory.className = showAllModulesCategoryClassesWithoutSelected.join(' ');

    if (selectedCategories.length == 0) {
        hideAllModules();
        return;
    }

    for (mod of sideBarModules) {
        const modClasses = mod.className.split(' ');
        for (category of selectedCategories) {
            if (modClasses.includes(category)) {
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
window.onload = function () {
    initiateSortable();
    initiateWordcloudFilter();
    initiateTimeBreaks();
    initiateTrashButton();
    initiateTimeEdit();
    calculateTime();
    calculateSummary();
}