// New slideshow object
function Slideshow(target, options=null) {
    let getWidth = () => this.cont.clientWidth / this.slides.length
  
    // Properties
    this.cont = document.getElementById(target);
    this.pos = 0;
    this.curX = 0;
    this.slides = Array.from(this.cont.children);
    this.width = getWidth();
    this.options = options || {
        easing: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
        duration: 1000
    };
  
    // Move slideshow view port to show slides array target pos
    this.moveTo = (target, duration=null) => {

        // Check if target input valid 
        if (target !== 0 && !target || target - 1 > this.slides.length || typeof target !== 'number' || target % 1 !== 0) {
            return console.log(`Invalid target for slide : ${target}`)    
        }
  
        // If already there
        if (target === this.pos) return true
  

        
        console.log('moveto')

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
        this.pos = target;
        this.curX = width * target;
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
                let pos = this.curX / this.width;
                let ratio = pos % 1;
                let target;

                let goRight = false;
                if (oldTouch.distance < 0) goRight = true;

                // Work out target in array
                if (this.curX < 0) {

                    // Swipe too far left
                    target = 0;

                } else 
                if (this.curX > this.slides.length * this.width) {

                    // Swipe too far right
                    target = this.slides.length - 1;

                } else 
                if (ratio > 0.2 &&) {

                }

                // Work out duration with target

                //this.moveTo(target, duration)
                console.log('pos', pos, 'ratio', ratio, 'target', target, 'duration', duration, 'go right', goRight)
                
                this.curX = target
            }
        }
    })


    // To adjust transformation with window resize
    let onResize = e => {
        this.width = getWidth()
        this.curX = this.width * this.pos;
        this.cont.style.transform = `translateX(-${this.curX}px)`;
    }
    window.addEventListener('resize', onResize)

    // Copy Touch Function
    function copyTouch({ identifier, pageX, distance=0 }) {
        return { identifier, pageX, distance };
    }

  }