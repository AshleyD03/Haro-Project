// Back bar 
class InfoBar {
    constructor(bar, func = null) {

        // Status of infobar
        let active = true;
        this.active = () => active;

        // Seperate parts of the info bar
        this.function = func;
        this.bar = bar;
        this.items = Array.from(this.bar.children);
        let length = this.items.length;

        this.actives = [this.items[0]];
        if (length > 2)
            this.actives.push(this.items[length - 2]);
        this.exits = [this.items[length - 1]];


        // Recursive function to ensure single functions or arrays of functions all perform
        let performEvent = (event = null, params = null) => {
            try {
                switch (typeof event) {
                    case 'function':
                        event(params);
                        break;

                    case 'object':
                        if (Array.isArray(event)) {
                            event.forEach(ev => performEvent(ev, params));
                        }
                        break;
                }
            } catch (error) {
                console.error(error);
            }
        };

        this.close = (delay=550) => {
            
            let bar = this.bar;
            bar.style.opacity = 0;

            setTimeout(function () {
                active = false;
                bar.style.display = 'none';
            }, delay);
        }

        // Add event listener to all actives
        this.actives.forEach(a => {

            a.addEventListener('click', e => {
                e.preventDefault();
                e.infoBar = this;
                performEvent(this.function, e);
            });

        });

        // Add event listener for exits
        this.exits.forEach(ex => {

            ex.addEventListener('click', e => {
                console.log('close info-bar');

                this.close();
            });

        });
    }
}

function helpPage (e) {
    // Get infobar and body 
    let infoBar = e.infoBar;
    let body = document.getElementsByTagName('body')[0];

    // Create Blackout
    let blackout = document.createElement('span');
    blackout.setAttribute('id', 'info-bar-help-blackout');
    body.appendChild(blackout);
    
    // Create clicker
    let clicker = document.createElement('span');
    clicker.setAttribute('id', 'info-bar-help-clicker');
    body.appendChild(clicker)

    // Append text boxes
    let textBox = document.createElement('span');
    textBox.setAttribute('class', 'info-bar-help-textbox');
    let textBoxes = [textBox, textBox.cloneNode(true)];
    textBoxes.forEach(box => clicker.appendChild(box))

    // Get Pointers
    let pointers = [];
    Array.from(document.getElementsByClassName('help')).forEach(point => {
        let display = point.style.display || window.getComputedStyle(point, null).getPropertyValue('display');
        if (display !== 'none') pointers.push(point)
    })
    let i = 0;



    // Functions built for help session
    // Check if ancestor or current has positition fixed, if not return absolute
    function setTextBox(texts=[], fontSize='2rem') {
        texts = [...texts, '', 'Next']
        let boxes = textBoxes;
        if (texts === null || texts.length < 2 || boxes === null || boxes.length < 2) throw {name: `Incorrect Parts :\n ${texts} || ${boxes}`}
        
        // Loop through texts
        for (let i=0; i < 2; i++) {
            let text = texts[i];
            let box = boxes[i];

            // Hide box if invalid text
            if (!text || typeof text !== 'string' || text.length === 0) {
                box.style.display = 'none';
            } 
            else {
            // Add text
                box.style.display = 'block';
                box.innerHTML = text;
            }
        }

        boxes[1].style.fontSize = fontSize;
    }

    function checkAncestorPosition (ele) {
        let result = 'absolute';
        while (ele !== document.getElementsByTagName('body')[0]) {
            let computed = window.getComputedStyle(ele, null)
            let position = computed.getPropertyValue('position');

            if (position === 'fixed') {
                result = 'fixed';
                break;
            }

            ele = ele.parentElement;
        }
        return result
    }

    // Scroll to element
    function scrollToElement (ele) {
        let pos = ele.getBoundingClientRect();
        let offset =  pos.top - (window.innerHeight * 0.25);
        window.scrollBy({
            top: offset,
            left: 0,
            behavior: 'smooth'
        })
    }

    // Clone element as copy ontop of blackout
    function cloneElement (ele) {
        // Create clone and get clone style values
        let newEle = ele.cloneNode(true);
        let computed = window.getComputedStyle(ele, null);
        let pos = ele.getBoundingClientRect();

        // Move to front and adjust width & height
        console.log(checkAncestorPosition(ele))
        newEle.setAttribute('style', `${ele.getAttribute('style')}; position: ${checkAncestorPosition(ele)}; z-index: 201;`)
        newEle.style.transform = 'none';
        newEle.style.width = computed.getPropertyValue('width');
        newEle.style.height = computed.getPropertyValue('height');

        // Apply top / left, adjust for fixed clones
        if (computed.getPropertyValue('position') === 'fixed') {
            newEle.style.position = 'fixed'
            newEle.style.top = pos.top + 'px';
            newEle.style.left = pos.left + 'px';
        } else {    
            newEle.style.top = `${pos.top + window.scrollY}` + 'px';
            newEle.style.left = `${pos.left + window.scrollX}` + 'px';
        }

        // Apply transitions
        newEle.style.transition = 'opacity 550ms cubic-bezier(0.075, 0.82, 0.165, 1)';
        newEle.style.opacity = 0;
        setTimeout(function() {
            newEle.style.opacity = 1
        }, 100)

        // Return element
        return newEle
    }




    // Begin session
    setTimeout(function() {

        // Close bar and apply blackout
        infoBar.close();
        blackout.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        textBoxes.forEach(box => { 
            box.style.color = 'rgba(0, 0,0, 1)';
            box.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        })
        setTextBox(['Welcome to page tutorial', 'Click to start'])

        // Scroll to top
        body.style.overflowY = 'hidden';
        window.scrollBy({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })

        // Begin copy loop procress
        let copy = null;
        clicker.addEventListener('click', e => {


            // Remove last pointer's copy if present
            if (copy && body.contains(copy)) body.removeChild(copy);

            // If show finished give outro
            if (i === pointers.length) {
                setTextBox(['Help finished','We hope that helped'], '2rem');
                window.scrollBy({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                })
                return i++
            } 

            // If outro finished disappear
            else if (i > pointers.length) {
                
                // Fade away
                blackout.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                textBoxes.forEach(box => { 
                    box.style.color = 'rgba(0, 0,0, 0)';
                    box.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                })
                body.style.overflowY = 'scroll';

                // Delete
                return setTimeout(function () {
                    body.removeChild(blackout)
                    body.removeChild(clicker)
                }, 550)
            }

            let point = pointers[i];

            // Change message
            let msg = point.dataset['helpmsg'] || point.getAttribute('alt') || '\nClick to continue';
            let font = point.dataset['helpfont'] || null;
            msg = [...msg.split('\n')];
            console.log(msg)
            setTextBox(msg, font);
          
            // Create a copy of next pointer
            copy = cloneElement(point)
            let styles = point.dataset['helpstyle'];
            copy.setAttribute('style', `${copy.getAttribute('style')}${styles}`)

            body.appendChild(copy)
            console.log(copy)
            scrollToElement(copy)

            i++;
        })


    }, 100)
}

function redirect_InfoBar (bar, url="") {
    if (!bar) return null
    let redirect = () => {
        window.location.href = url ?? url[0];
    }
    return new InfoBar(bar, redirect)
}

let bar = document.getElementById('help-bar');
helpBar = new InfoBar(bar, helpPage)