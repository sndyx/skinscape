export function noSelect(node: HTMLElement) {

    function mousedown() {
        console.log("Mouse down!");
        window.addEventListener('mouseup', disableNoSelect);
        window.addEventListener('selectstart', disableSelect);
    }

    function disableSelect(event: Event) {
        event.preventDefault();
    }

    function disableNoSelect() {
        window.removeEventListener('mouseup', disableNoSelect);
        window.removeEventListener('selectstart', disableSelect);
    }

    node.addEventListener('mousedown', mousedown);

    return {
        destroy() {
            node.removeEventListener('mousedown', mousedown);
        }
    }
}

export function clearSelection() {
    if (document.getSelection) {
        document.getSelection()?.removeAllRanges();
        document.getSelection()?.addRange(document.createRange());
    }
  }