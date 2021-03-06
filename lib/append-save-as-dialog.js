'use strict';

function appendSaveAsDialog (index, output) {
    var div;
    var menu;

    function closeMenu(e) {
        var left = parseInt(menu.style.left, 10);
        var top = parseInt(menu.style.top, 10);
        if (
            e.x < left ||
            e.x > (left + menu.offsetWidth) ||
            e.y < top ||
            e.y > (top + menu.offsetHeight)
        ) {
            menu.parentNode.removeChild(menu);
            document.body.removeEventListener('mousedown', closeMenu, false);
        }
    }

    function getDiagramSVG() {
        var firstDiv, html;

        html = '';
        if (index !== 0) {
            firstDiv = document.getElementById(output + 0);
            html += firstDiv.innerHTML.substring(166, firstDiv.innerHTML.indexOf('<g id="waves_0">'));
        }

        return 'data:image/svg+xml;base64,' + btoa([
            div.innerHTML.slice(0, 166),
            html,
            div.innerHTML.slice(166)].join(''));
    }

    div = document.getElementById(output + index);

    div.childNodes[0].addEventListener('contextmenu',
        function (e) {
            var list, savePng, saveSvg;

            menu = document.createElement('div');
            menu.className = 'wavedromMenu';
            menu.style.top = e.y + 'px';
            menu.style.left = e.x + 'px';

            list = document.createElement('ul');
            savePng = document.createElement('li');
            savePng.innerHTML = '<a href="#">Save as PNG</a>';
            list.appendChild(savePng);

            saveSvg = document.createElement('li');
            saveSvg.innerHTML = '<a href="#">Save as SVG</a>';
            list.appendChild(saveSvg);

            //var saveJson = document.createElement('li');
            //saveJson.innerHTML = 'Save as JSON';
            //list.appendChild(saveJson);

            menu.appendChild(list);
            document.body.appendChild(menu);

            function removeMenu() {
                menu.parentNode.removeChild(menu);
                document.body.removeEventListener('mousedown', closeMenu, false);
            }

            savePng.children[0].addEventListener('click',
                function (evt) {
                    var img;
                    if (savePng.children[0].download) {
                        window.setTimeout(removeMenu, 100);
                        return;
                    }

                    evt.preventDefault();

                    img = new Image();
                    img.src = getDiagramSVG();
                    img.addEventListener('load', function() {
                        var canvas, context, pngdata;
                        canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        context = canvas.getContext('2d');
                        context.drawImage(img, 0, 0);

                        pngdata = canvas.toDataURL('image/png');

                        savePng.children[0].href = pngdata;
                        savePng.children[0].download = 'wavedrom.png';
                        savePng.children[0].click();
                    }, false);
                },
                false
            );

            saveSvg.children[0].addEventListener('click',
                function () {
                    saveSvg.children[0].href = getDiagramSVG();
                    saveSvg.children[0].download = 'wavedrom.svg';

                    window.setTimeout(removeMenu, 100);
                },
                false
            );

            menu.addEventListener('contextmenu',
                function (ee) {
                    ee.preventDefault();
                },
                false
            );

            document.body.addEventListener('mousedown', closeMenu, false);

            e.preventDefault();
        },
        false
    );
}

module.exports = appendSaveAsDialog;
