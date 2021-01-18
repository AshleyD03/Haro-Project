let container = document.getElementById('container');
let hidden = document.getElementById('hidden');
let bar = document.getElementById('bar');
let nav_links = document.getElementsByClassName('nav-link');
let nav_summons = document.getElementsByClassName('nav-summon');
let nav_containers = document.getElementsByClassName('nav-container');
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

// Initliase bar position and variables
let ongoingTouches, minY, maxY, curY, barLock, goingDown, showing, hiding; 
window.addEventListener('load', initBar())
window.addEventListener('resize', initBar())
window.addEventListener('orientationchange', initBar())

// Move bar and set vairables
function initBar() {
    ongoingTouches = []
    minY = bar.clientHeight;
    maxY = hidden.clientHeight + parseFloat(window.getComputedStyle(hidden).marginTop);
    curY = minY;
    barLock = false;
    goingDown = false;
    showing = 'cart-cont';
    hiding = 'nav-cont';
    showAndHide(showing, hiding)
    container.style.transform = `translateY(-${maxY}px)`
}



// - = - Navbar Swipes - = -

// On touch add new touches to ongoingTouches
container.addEventListener('touchstart', e => {
    e.preventDefault();
    let touches = e.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]))
    }
    console.log('click')
}, false)


// Move Touch EVENT 
container.addEventListener('touchmove', e => {
  try {
    e.preventDefault();
    let touches = e.changedTouches;

    if (barLock) return

    for (var i = 0; i < touches.length; i++) {

        let touch = touches[i]
        let id = touch.identifier;
        let tchIndex = ongoingTouches.findIndex(tch => tch.identifier === id);
       
        // Check that the touch is valid
        if (tchIndex > -1) {

            // Calculate Destination
            let dif = ongoingTouches[tchIndex].pageY - touch.pageY
            let acceleration = Math.abs(dif)
            dif *= 2
            let limit = 25;
            if (Math.abs(dif) > limit) acceleration = limit;
            let destY = curY - ( acceleration * dif / Math.abs(dif) )

            // If destination is valid
            if ((destY > minY) && (destY < maxY)) {

                // Update direction and currentY
                goingDown = false;
                if (destY > curY) {
                    goingDown = true;
                } 
                curY = destY;

                // Move container and change content opacity
                container.style.transform = `translateY(${destY - maxY - minY}px)`;
                document.getElementById(showing).style.opacity = (curY - minY) / (maxY - minY);
            }
            ongoingTouches[tchIndex] = copyTouch(touch)

        } else {
            console.log('unverified move')
        }
    }
  } catch (error) {
    console.error(error)
  }
}, false)

// End Touch EVENT
container.addEventListener('touchend', e => {
  try {
    e.preventDefault();
    let touches = e.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        let touch = touches[i]
        let id = touch.identifier;
        if (ongoingTouches.some(tch => tch.identifier === id)) {
            
            // A fraction displaying the percentage of page, from top (0) to bottom (1), that the slider covers
            let disFraction = (curY - minY) / (maxY - minY);
            // initialiise animation parts
            let options = {
                easing: 'cubic-bezier(0.39, 0.575, 0.565, 1)'       
            }
            let keyframes = [] //= [{transform: `translateY(${curY - maxY - minY}px)`}]

            // Decide the direction of translation
            let reasonDown = ( !(curY <= maxY * 0.15) && ( (goingDown === true) || (curY >= maxY * 0.85) ));
            if (reasonDown) {
                // Go down 
                keyframes.push({transform: `translateY(-${minY}px)`})
                curY = maxY
                disFraction = 1 - disFraction; // flip disFraction
            } else {
                // Go up
                keyframes.push({transform: `translateY(-${maxY}px)`})
                curY = minY
            }

            // Duration Equation : y = 450x + 100
            options['duration'] = 450 * disFraction + 100;
            animateFromCurrent(container, keyframes, options);
            ongoingTouches.splice(copyTouch(touch), 1)
            document.getElementById(showing).style.opacity = (curY - minY) / (maxY - minY);
        }
    }
  } catch (error) {
    console.error(error)
  }
}, false)

// copy key touch properties
function copyTouch({ identifier, pageX, pageY }) {
    return { identifier, pageX, pageY };
}

function doesTouchEndOnTarget(touchEvent) {
    let touches = touchEvent.changedTouches;
    let checkTarget = touch => (document.elementFromPoint(touch.pageX, touch.pageY) ===  touchEvent.target)
    if (Array.from(touches).some(checkTarget)) return true
    else return false
}

function showAndHide(showing, hiding) {
    let show = document.getElementById(showing);
    let hide = document.getElementById(hiding);
    show.style.pointerEvents = 'auto';
    hide.style.pointerEvents = 'none';
    show.style.opacity = 1;
    hide.style.opacity = 0; 
}

// - = - Navbar Summons - = - 
// Do to all .nav_summon
Array.from(nav_summons).some(summon => {

    let reveal = summon.getAttribute('value')

    // Ignore other touch starts
    summon.addEventListener('touchstart', e => {
        e.stopPropagation()
    })

    // Let Go event
    summon.addEventListener('touchend', e => {
        e.stopPropagation()

        // Check if correct event to pulldown
        if (!(doesTouchEndOnTarget(e)) || !reveal) return 

        // Swap option showing / hiding
        if (showing !== reveal) {
            hiding = showing; showing = reveal;
        }      

        // Push up navbar
        let options = {
            easing: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
            duration: (1 - (curY - minY) / (maxY - minY)) * 450 + 100       
        }
        let keyframes = [
            {transform: `translateY(${curY - maxY - minY}px)`}, 
            {transform: `translateY(-${minY}px)`}
        ]
        animateTo(container, keyframes, options);
        curY = maxY;

        // Swap contents
        showAndHide(showing, hiding)
    })
})

// Make href's clickable instead of dragable
Array.from(nav_links).some(link => {
    let href = link.href;
    link.addEventListener('touchstart', e => {
        e.stopPropagation()
    })
    link.addEventListener('touchend', e => {
        e.stopPropagation()
        if (!(doesTouchEndOnTarget(e)) || !href) return 
        window.location.href = href;
    })
})