window.onload = function(){
    const Classes = {
        draggable: 'StackedListItem--isDraggable',
        capacity: 'draggable-container-parent--capacity',
    };

    const containers = document.querySelectorAll('#MultipleContainers .StackedList');
    console.log(containers);

    const sortable = new Draggable.Sortable(containers, {
        draggable: `.${Classes.draggable}`
    });
}


