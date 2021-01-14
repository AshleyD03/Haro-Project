let container = document.getElementById('container');
let hidden = document.getElementById('hidden');
let bar = document.getElementById('bar');
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

// Initliase bar position and variables
let ongoingTouches, minY, maxY, curY, goingDown; 
window.addEventListener('load', initBar())
window.addEventListener('resize', initBar())

// Move bar and set vairables
function initBar() {
    ongoingTouches = []
    minY = bar.clientHeight;
    maxY = hidden.clientHeight;
    curY = minY;
    goingDown = false;
    let height = hidden.clientHeight;
    container.style.transform = `translateY(-${height}px)`
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
    e.preventDefault();
    let touches = e.changedTouches;

    for (var i = 0; i < touches.length; i++) {

        let touch = touches[i]
        let id = touch.identifier;
        let original = ongoingTouches.find(tch => tch.identifier === id);
       
        // Check that the touch is valid
        if (original) {

            // Calculate Destination
            let acceleration = 10
            let dif = curY - touch.pageY
            let destY = curY - ( acceleration * dif / Math.abs(dif) )
            let move = destY - minY;
            

            // If destination is valid
            if ((destY > minY) && (destY < maxY)) {

                container.style.transform = `translateY(${move - maxY}px)`
            
                goingDown = false;
                if (destY > curY) {
                    goingDown = true;
                } 
                curY = destY;
            }

        } else {
            console.log('unverified move')
        }
    }
}, false)

// End Touch EVENT
container.addEventListener('touchend', e => {
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
            let keyframes;

            // Decide the direction of translation
            let reasonDown = ( !(curY <= maxY * 0.1) && ( (goingDown === true) || (curY >= maxY * 0.9) ));
            if (reasonDown) {
                // Go down 
                keyframes = {transform: `translateY(-${minY}px)`};
                curY = maxY
                disFraction = 1 - disFraction; // flip disFraction
            } else {
                // Go up
                keyframes = {transform: `translateY(-${maxY}px)`};
                curY = minY
            }

            // Duration Equation : y = 450x + 100
            options['duration'] = 450 * disFraction + 100;
            animateTo(container, keyframes, options);
            ongoingTouches.splice(copyTouch(touch), 1)
        }
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
        { ...options, fill: 'both'},
    );
    anim.addEventListener('finish', () => {
        anim.commitStyles();
        anim.cancel();
    });
    return anim
}