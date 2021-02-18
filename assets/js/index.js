
window.onload = function(){
    intiateDraggable();
    intitiateWordcloudFilter();
}


/**
 * Drag & Drop
 */

function intiateDraggable(){
    const Classes = {
        draggable: 'StackedListItem--isDraggable',
        capacity: 'draggable-container-parent--capacity',
    };

    const containers = document.querySelectorAll('#MultipleContainers .StackedList');

    const sortable = new Draggable.Sortable(containers, {
        draggable: `.${Classes.draggable}`
    });
}



/**
 * Wordcloud Filter
 */

const CLASS_SELECTED = 'selected';
const ID_WORDCLOUD = 'wordcloud';
const ID_SHOW_ALL_CATEGORIES = 'show-all-categories';

function intitiateWordcloudFilter(){
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

function hideAllCategories(){
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
    hideAllCategories()
    const sideBarModules = Array.from(document.getElementById('side-bar-module-list').getElementsByClassName('module'));
    for(mod of sideBarModules){
        mod.style.display = '';
    }
}

function hideAllModules(){
    hideAllCategories()
    const sideBarModules = Array.from(document.getElementById('side-bar-module-list').getElementsByClassName('module'));
    for(mod of sideBarModules){
        mod.style.display = 'none';
    }
}

function updateSelectableModulesList(){
    const wordcloud = Array.from(document.getElementById(ID_WORDCLOUD).getElementsByTagName('li'));
    const wordcloudSelectedCategories = wordcloud.filter(li => li.className.includes(CLASS_SELECTED));
    const selectedCategories = wordcloudSelectedCategories.map(li => li.textContent);

    const sideBarModules = Array.from(document.getElementById('side-bar-module-list').getElementsByClassName('module'));

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