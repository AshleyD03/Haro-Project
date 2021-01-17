let container = document.getElementById('container');
let hidden = document.getElementById('hidden');
let bar = document.getElementById('bar');
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

// Initliase bar position and variables
let ongoingTouches, minY, maxY, curY, barLock, goingDown; 
window.addEventListener('load', initBar())
window.addEventListener('resize', initBar())
window.addEventListener('orientationchange', initBar())

// Move bar and set vairables
function initBar() {
    ongoingTouches = []
    minY = bar.clientHeight;
    maxY = hidden.clientHeight + parseFloat(window.getComputedStyle(hidden).marginTop);
    console.log(maxY)
    console.log(window.getComputedStyle(hidden).marginTop)
    curY = minY;
    barLock = false;
    goingDown = false;
    container.style.transform = `translateY(-${maxY}px)`
}

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

                container.style.transform = `translateY(${destY - maxY - minY}px)`
            
                goingDown = false;
                if (destY > curY) {
                    goingDown = true;
                } 
                curY = destY;
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
            let keyframes = [{transform: `translateY(${curY - maxY - minY}px)`}]

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
            animateTo(container, keyframes, options);
            ongoingTouches.splice(copyTouch(touch), 1)
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

// bug free animation function from HTTP 203 series
// https://www.youtube.com/watch?v=9-6CKCz58A8
function animateTo(element, keyframes, options) {
    const anim = element.animate(
        keyframes,
        { ...options, fill: 'both' },
    );
    anim.addEventListener('finish', () => {
        anim.commitStyles();
        anim.cancel();
    });
    return anim
}
