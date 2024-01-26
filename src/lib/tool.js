class Tool {
    hover(scene, x, y, primary, secondary) {}

    down(scene, isLeftClick, x, y, primary, secondary) {}

    drag(scene, isLeftClick, x, y, primary, secondary) {}

    up(scene, isLeftClick, x, y, primary, secondary) {}

}

class Pencil extends Tool {
    hover(scene, x, y, primary, secondary) {
        let layer = scene.tempLayer();
        layer.setPixel(x, y, primary);
    }

    down(scene, isLeftClick, x, y, primary, secondary) {
        let layer = scene.activeLayer();
        let color;
        if (isLeftClick) { color = primary; }
        else { color = secondary; }
        layer.setPixel(x, y, color);
    }

    drag(scene, isLeftClick, x, y, primary, secondary) {
        let layer = scene.activeLayer();
        let color;
        if (isLeftClick) { color = primary; }
        else { color = secondary; }
        layer.setPixel(x, y, color);
    }

}