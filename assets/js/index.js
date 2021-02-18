const CLASS_SELECTED = 'selected';
const ID_WORDCLOUD = 'wordcloud';

window.onload = function(){
    intiateDraggable();
    intitiateWordcloudFilter();
}

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

function intitiateWordcloudFilter(){
    const wordcloud = document.getElementById(ID_WORDCLOUD).getElementsByTagName('li');
    for(li of wordcloud){
        li.onclick = updateWordcloudFilter;
    }
    updateSelectableModulesList();
}

function updateWordcloudFilter(){
    if(!this.className.includes(CLASS_SELECTED)){
        this.className = this.className.concat(CLASS_SELECTED);
    } else {
        const thisClasses = this.className.split(' ');
        const thisClassesWithoutSelected = thisClasses.filter(className => className != CLASS_SELECTED);
        this.className = thisClassesWithoutSelected.join(' ');
    }
    updateSelectableModulesList();
}

function updateSelectableModulesList(){
    const wordcloud = Array.from(document.getElementById(ID_WORDCLOUD).getElementsByTagName('li'));
    const wordcloudSelectedCategories = wordcloud.filter(li => li.className.includes(CLASS_SELECTED));
    const selectedCategories = wordcloudSelectedCategories.map(li => li.textContent);

    const sideBarModules = Array.from(document.getElementById('side-bar-module-list').getElementsByClassName('module'));

    if(selectedCategories.length == 0){
        for(mod of sideBarModules){
            mod.style.display = 'none';
        }
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