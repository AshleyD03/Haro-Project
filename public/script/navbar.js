let navbar = (function () {
    let container = document.getElementById('mob-container');
    let hidden = document.getElementById('mob-hidden');
    let bar = document.getElementById('mob-bar');
    let nav_links = document.getElementsByClassName('nav-link');
    let nav_summons = document.getElementsByClassName('nav-summon');
    let nav_containers = document.getElementsByClassName('nav-container');
    let nav_cont = document.getElementById('nav-cont');
    let cart_cont = document.getElementById('cart-cont');
    let cart_white = document.getElementById('cart-white');
    let logo_main = document.getElementById('logo-main');
    let logo_arrow = document.getElementById('logo-arrow');
    let nav_blackout = document.getElementById('nav-blackout');

    // Initliase bar position and variables
    let ongoingTouches, minY, maxY, curY, barLock, goingDown, showing, hiding, vh, vw; 
    window.addEventListener('load', initBar())
    window.addEventListener('resize', e => {
        let check_width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        if (check_width !== vw) initBar();
    })

    // Move bar and set vairables
    function initBar() {
        vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

        // Rotate mobile effects
        if (vh > vw) {
            // Portrait Effect
            nav_cont.className = 'nav-container nav-cont-list1';
            Array.from(nav_cont.children).forEach(option => {
                option.classList.remove('nav-option2');
                option.classList.add('nav-option1')
            })
        } else {
            // Landscape Effect
            nav_cont.className = 'nav-container nav-cont-list2';
            Array.from(nav_cont.children).forEach(option => {
                option.classList.remove('nav-option1');
                option.classList.add('nav-option2')
            })
        }

        ongoingTouches = []
        minY = bar.clientHeight;
        maxY = hidden.clientHeight + parseFloat(window.getComputedStyle(hidden).marginTop);
        curY = minY;
        barLock = false;
        goingDown = false;
        hiding = 'cart-cont';
        showing = 'nav-cont';
        showAndHide(showing, hiding)
        container.style.transform = `translateY(-${maxY}px)`
        Array.from(nav_containers).forEach(cont => cont.style.height = hidden.clientHeight);
        cart_cont.style.transform = `translateY(-${nav_cont.clientHeight}px)`
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
                    // Opacity is distanceFraction from top to bot
                    let opacity = (curY - minY) / (maxY - minY) + 0.1;
                    document.getElementById(showing).style.opacity = opacity;
                    logoArrowAppear(opacity, false)
                }
                // Update Touch
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
                    disFraction = 1 - disFraction; // flip disFraction
                    pushNavbar(minY, maxY, disFraction)
                } else {
                    // Go up
                    pushNavbar(maxY, minY)
                }

                // Opacity is distanceFraction from top to bot
                let opacity = (curY - minY) / (maxY - minY);
                document.getElementById(showing).style.opacity = opacity;
                logoArrowAppear(opacity, (opacity === 1))
            }
        }
    } catch (error) {
        console.error(error)
    }
    }, false)



    // - = - Navbar Summons - = - 
    // Do to all .nav_summon
    Array.from(nav_summons).some(summon => {

        let reveal = summon.getAttribute('value')

        // Ignore other touch starts
        summon.addEventListener('touchstart', e => {
            summon.style.filter = 'brightness(75%)';
        })

        summon.addEventListener('touchend', e => {
            summon.style.filter = '';

            if (!(doesTouchEndOnTarget(e))) return
            e.stopPropagation()

            // Swap option showing / hiding
            if (showing !== reveal) {
                hiding = showing; showing = reveal;
            }      

            // Push nav down, show arrow and swap
            pushNavbar(minY, maxY, (1 - (curY - minY) / (maxY - minY)))
            logoArrowAppear(1)
            showAndHide(showing, hiding)
        })
    })

    // Make href's clickable instead of dragable
    Array.from(nav_links).some(link => {
        let href = link.href;
        link.addEventListener('touchstart', e => {
            e.stopPropagation()
            link.parentElement.style.boxShadow = 'inset -4px -4px 4px rgba(0, 0, 0, 0.25), inset 4px 4px 4px rgba(0, 0, 0, 0.25)';
        })

        link.addEventListener('touchend', e => {
            e.stopPropagation()
            link.parentElement.style.boxShadow = '';

            if (!(doesTouchEndOnTarget(e)) || !href) return 
            window.location.href = href;
        })
    })

    // Allow normal swipe to occur on cart-white
    cart_white.addEventListener('touchstart', e => e.stopPropagation())
    cart_white.addEventListener('touchmove', e => e.stopPropagation())
    cart_white.addEventListener('touchend', e => e.stopPropagation())

    Array.from([nav_blackout, logo_arrow]).forEach(element => {

        // No stop propagation's, as you can press the arrow and scroll at the same time
        element.addEventListener('touchstart', e => {
            element.style.filter = 'brightness(50%)';
        })

        element.addEventListener('touchend', e => {
            element.style.filter = 'brightness(100%)';

            if (!(doesTouchEndOnTarget(e))) return
            e.stopPropagation()

            pushNavbar(maxY, minY, (curY - minY) / (maxY - minY));
            logoArrowAppear(0)
        })
    })

    // - = - Functions - = - 
    // copy key touch properties
    function copyTouch({ identifier, pageX, pageY }) {
        return { identifier, pageX, pageY };
    }

    function doesTouchEndOnTarget(touchEvent) {
        let touches = touchEvent.changedTouches;

        Array.from(touches).some(touch => {
            console.log(touch.pageX)
            console.log(touch.pageY)
            console.log(document.elementFromPoint(touch.pageX, touch.pageY - window.pageYOffset))
        })

        let checkTarget = touch => {
            let x = touch.pageX - window.pageXOffset;
            let y = touch.pageY - window.pageYOffset;

            let target = document.elementFromPoint(x, y);
            if (target === touchEvent.target) return true
        }
        if (Array.from(touches).some(checkTarget)) return true
        else return false
    }

    // For swapping logo to arrow
    function logoArrowAppear(opacity=1, pointer=true) {
        logo_arrow.style.opacity = opacity;
        nav_blackout.style.opacity = 0.8 * opacity;
        logo_main.style.opacity = 1 - opacity;

        if (opacity === 0) pointer = false;
        // Change pointers if true
        if (pointer === true) {
            logo_arrow.style.pointerEvents = 'auto';
            nav_blackout.style.pointerEvents = 'auto';
            logo_main.style.pointerEvents = 'none';
        } else {
            logo_arrow.style.pointerEvents = 'none';
            nav_blackout.style.pointerEvents = 'none';
            logo_main.style.pointerEvents = 'auto';
        }
    }

    function pushNavbar(moveY, endY, durationFraction=(curY - minY) / (maxY - minY)) {
        let options = {
            easing: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
            duration: durationFraction * 450 + 100
        }
        let keyframes = [{transform: `translateY(-${moveY}px)`}]
        animateFromCurrent(container, keyframes, options);
        curY = endY;
    }

    return ({
        doesTouchEndOnTarget: doesTouchEndOnTarget, 
        pushNavbar: pushNavbar,
        minY: minY, 
        maxY: maxY
    })
})()