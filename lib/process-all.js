'use strict';

var eva = require('./eva'),
    appendSaveAsDialog = require('./append-save-as-dialog'),
    renderWaveForm = require('./render-wave-form');

function processAll () {
    var points,
        i,
        index,
        node0,
        css_elt,
        styles;
        // node1;

    // first pass
    index = 0; // actual number of valid anchor
    points = document.querySelectorAll('*');
    for (i = 0; i < points.length; i++) {
        if (points.item(i).type && points.item(i).type === 'WaveDrom') {
            points.item(i).setAttribute('id', 'InputJSON_' + index);

            node0 = document.createElement('div');
            // node0.className += 'WaveDrom_Display_' + index;
            node0.id = 'WaveDrom_Display_' + index;
            points.item(i).parentNode.insertBefore(node0, points.item(i));
            // WaveDrom.InsertSVGTemplate(i, node0);
            index += 1;
        }
    }
    // second pass
    for (i = 0; i < index; i += 1) {
        renderWaveForm(i, eva('InputJSON_' + i), 'WaveDrom_Display_');
        appendSaveAsDialog(i, 'WaveDrom_Display_');
    }
    // add styles
    styles = 'div.wavedromMenu{position:fixed;border:solid 1pt#CCCCCC;background-color:white;box-shadow:0px 10px 20px #808080;cursor:default;margin:0px;padding:0px;}div.wavedromMenu>ul{margin:0px;padding:0px;}div.wavedromMenu>ul>li{padding:2px 10px;list-style:none;}div.wavedromMenu>ul>li:hover{background-color:#b5d5ff;}';

    css_elt = document.createElement('style');
    css_elt.type = 'text/css';
    if (css_elt.styleSheet) {
        css_elt.styleSheet.cssText = styles;
    } else {
        css_elt.appendChild(document.createTextNode(styles));
    }
    document.getElementsByTagName('head')[0].appendChild(css_elt);
}

module.exports = processAll;
