(() => {

let currentRow = null;
let root = null;

//Finds y value of given object
function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    return curtop;
}

function activate(row) {
    row.classList.add('active');
    let windowHeight = document.documentElement.clientHeight;
    let oldScroll = root.scrollTop;
    let targetScroll = findPos(row) - windowHeight / 2 + row.clientHeight / 2;
    for (let amount = 0.0; amount < 1.0; amount += 0.02) {
        setTimeout(() => {
            let curvedAmount = Math.cos(amount * Math.PI) * -0.5 + 0.5;
            root.scroll(0, oldScroll * (1.0 - curvedAmount) + targetScroll * curvedAmount);
        }, 500 * amount);
    }
    root.classList.add('active');
    currentRow = row;
    for (let side of row.children) {
        for (let element of side.children) {
            if (element.classList.contains('autoplay')) {
                element.playbackRate = 1.0;
                element.play();
                element.volume = 1.0;
            }
        }
    }
}

function deactivate(row) {
    currentRow = null;
    row.classList.remove('active');
    row.classList.add('returning');
    root.classList.remove('active');
    setTimeout(() => row.classList.remove('returning'), 500);
    for (let side of row.children) {
        if (side.scrollTop > 0) {
            let startValue = side.scrollTop;
            for (let amount = 0.0; amount <= 1.0; amount += 0.05) {
                setTimeout(() => side.scrollTop = (1.0 - amount) * startValue, 600 * amount);
            }
            setTimeout(() => side.scrollTop = 0, 700);
        }
        side.scrollTop = 0;
        for (let element of side.children) {
            if (element.classList.contains('autoplay')) {
                element.playbackRate = 1.0;
                element.volume = 0.0;
                element.pause();
            }
        }
    }
}

function init() {
    let rows = document.getElementsByClassName('row');
    root = document.getElementById('root');
    for (let row of rows) {
        row.onclick = event => {
            if (currentRow === row) {
                deactivate(row);
            } else {
                activate(row);
            }
        };
    }

    let shade = document.getElementById('shade');
    shade.onclick = event => {
        let row = currentRow;
        deactivate(row);
    }
}

document.addEventListener('DOMContentLoaded', e => init());

})();