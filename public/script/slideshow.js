// New slideshow object
function Slideshow(target, widthTarget=null, options=null) {
    let getWidth = () =>  {
        if (!widthTarget) return (this.cont.clientWidth / this.slides.length)
        else return widthTarget.clientWidth;
    }

    // Properties
    this.cont = document.getElementById(target);
    this.pos = 0;
    this.curX = 0;
    this.slides = Array.from(this.cont.children);
    this.width = getWidth();
    this.options = options || {
        easing: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
        duration: 550
    };

    // Apply Background Colour Changes
    let firstColour = window.getComputedStyle(this.slides[1], null).getPropertyValue('background-color') || window.getComputedStyle(this.cont, null).getPropertyValue('background-color');
    let lastColour = window.getComputedStyle(this.slides[this.slides.length-1], null).getPropertyValue('background-color');
    this.slides[0].style.backgroundColor = firstColour;
    this.cont.parentNode.style.backgroundColor = lastColour;
  
    // Move slideshow view port to show slides array target pos
    this.moveTo = (target, duration=null) => {
        target += 1

        // Change container's background colour to prevent animation clipping
        let oldColour = this.cont.parentNode.style.backgroundColor;
        this.cont.parentNode.style.backgroundColor = this.slides[target].style.backgroundColor;

        // Check if target input valid 
        if (target !== 0 && !target || target - 2 > this.slides.length || typeof target !== 'number' || target % 1 !== 0) {
            return console.log(`Invalid target for slide : ${target}`)    
        }

        // Create settings for transfer
        let width = this.width;
        let options = { ...this.options};
        options.duration = duration ?? options.duration;
        let keyframes = [
            {transform: `translateX(-${this.curX}px)`},
            {transform: `translateX(-${width * target}px)`}
        ]
  
        // Animate and change pos property
        let anim = animateTo(this.cont, keyframes, options)
        this.pos = target - 1;
        this.curX = width * target;
    
        this.cont.dispatchEvent(new CustomEvent('moveTo', {
            detail: {
                name: 'moveTo',
                slideshow: this,
                animation: anim,
                slides: this.slides,
                target: target-1
            }
        }));

        // Return old colour
        anim.addEventListener('finish', () => {
            this.cont.parentNode.style.backgroundColor = oldColour
        })
        return true
    }

    // Add touch events
    let ongoingTouches = [];

    this.cont.addEventListener('touchstart', e => {
        e.preventDefault()

        // Add Touches to ongoingTouches
        let touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            ongoingTouches.push(copyTouch(touches[i]))
        }
    })

    this.cont.addEventListener('touchmove', e => {
        e.preventDefault()

        let touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {


            let touch = touches[i]

            // Catch invalid touches
            let id = touch.identifier;
            let oldTouch = ongoingTouches.find(tch => tch.identifier === id);
            if (oldTouch) {
                
                // Apply change in direction
                let change = touch.pageX - oldTouch.pageX

                
                this.curX = Math.round(this.curX - change);  
                this.cont.style.transform = `translateX(-${this.curX}px)`;

                touch.distance = oldTouch.distance + change;
                let index = ongoingTouches.indexOf(oldTouch);
                ongoingTouches[index] = copyTouch(touch);
            }

        }
    })

    this.cont.addEventListener('touchend', e => {
        e.preventDefault()


        let touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            let touch = touches[i]

            // Catch invalid touches
            let id = touch.identifier;
            let oldTouch = ongoingTouches.find(tch => tch.identifier === id);
            if (oldTouch) {

                // Remove from ongoingTouches
                let index = ongoingTouches.indexOf(oldTouch);
                ongoingTouches.splice(index, 1)

                // Work out current pos and target in array unit
                let pos = this.curX / this.width - 1; 
                let ratio = -Math.abs((pos % 1) - 1) + 1;
                let duration = Math.abs(ratio * this.options.duration);
                if (pos < this.curX);
                let target = this.pos;

                let goRight = false;
                if (oldTouch.distance < 0) goRight = true;

                // Work out target in array
                if (this.curX < this.width) {
                    // Swipe too far left
                    target = 0;

                } else 
                if (this.curX > (this.slides.length - 1) * this.width) {
                    // Swipe too far right
                    target = this.slides.length - 2;

                } else
                if (ratio < 0.15) {
                    // Swipe isn't far enough
                    target = this.pos;
                    duration = 100;

                } else
                if (pos < this.pos) {
                    // Swipe is far enough to go left
                    target = this.pos - 1
                } else {
                    // Swipe is far enough to go right
                    target = this.pos + 1
                    duration = Math.abs(-duration + this.options.duration)

                }

                //this.moveTo(target, duration)
                this.moveTo(target, duration)
            }
        }
    })


    // To adjust transformation with window resize
    let onResize = e => {
        this.width = getWidth()
        this.curX = this.width * (this.pos + 1);
        this.cont.style.transform = `translateX(-${this.curX}px)`;
        // Width of slides (account for scrollbar)
        this.slides.forEach(e => e.style.width = `${this.width}px`)
    }
    window.addEventListener('resize', onResize)
    onResize()

    // Copy Touch Function
    function copyTouch({ identifier, pageX, distance=0 }) {
        return { identifier, pageX, distance };
    }

    this.moveTo(0)
  }