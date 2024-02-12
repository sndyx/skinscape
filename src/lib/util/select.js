export function noSelect(node) {

    function mousedown() {
        window.addEventListener('mouseup', disableNoSelect);
        window.addEventListener('selectstart', disableSelect);
    }

    function disableSelect(event) {
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