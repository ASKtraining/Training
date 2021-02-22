const ID_MODULE_LIST_SIDE_BAR = 'module-list-side-bar';

window.onload = function(){
    initiateSortable();
    initiateWordcloudFilter();
    initiateTimeBreaks()
}


/**
 * Drag & Drop
 */

function initiateSortable(){
    let module_list_training = document.getElementById('module-list-training');
    Sortable.create(module_list_training, {
        group: {
            name: 'module_list_training',
            put: function(){
                const chosenClassName = document.getElementsByClassName('sortable-chosen')[0].className;
                const isModule = chosenClassName.includes('module');
                const isTimeBreak = chosenClassName.includes('timebreak');
                const isDayBreak = chosenClassName.includes('daybreak');
                return isModule || isTimeBreak || isDayBreak;
            }
        },
        fallbackOnBody: true,
		swapThreshold: 0.2,
        animation: 100,
        oneEnd: updateTimeBreaks
    });

    let moduleListSideBar = document.getElementById(ID_MODULE_LIST_SIDE_BAR);
    Sortable.create(moduleListSideBar, {
        group: ID_MODULE_LIST_SIDE_BAR,
        animation: 100
    });

    let index = 0;
    let resource_list_lists = document.getElementsByClassName('resource-list');
    for(ul of resource_list_lists){
        Sortable.create(ul, {
            group: {
                name: `resource-list-${index}`,
                put: function(){
                    const chosenClassName = document.getElementsByClassName('sortable-chosen')[0].className;
                    const isResource = chosenClassName.includes('resource');
                    const isTimeBreak = chosenClassName.includes('timebreak');
                    const isDayBreak = chosenClassName.includes('daybreak');
                    return isResource || isTimeBreak || isDayBreak;
                }
            },
            fallbackOnBody: true,
            animation: 100,
            oneEnd: updateTimeBreaks
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
 * Time Breaks
 */

const timeBreak = `
<li class="timebreak">
    <div class="time">
        <i class="far fa-clock"></i> <span>12:30am - 12:45pm</span>
    </div>
    <div class="content">
        <div class="options">
            <a class="trash" href="#"><i class="fas fa-trash-alt"></i></a> 
        </div>
        <p>Time Break</p>
    </div>
    <div class="clearer"></div>
</li>`;

function initiateTimeBreaks(){

}

function updateTimeBreaks(){

}

function addTimeBreakBefore(){

}

function addTimeBreakAfter(){

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