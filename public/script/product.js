// Get styleList from already init product object
let styleList = products.styleList;


// Get query data
// /offline/product.html?key=productOne
const query_string = window.location.search;
const urlParams = new URLSearchParams(query_string);

// Get Current Style Key & 
// Current Size from url with error checks
let currentKey = (function () {
    // Check url
    let style = urlParams.get('key') 
    if (!products.styleList[style]) return null
    else return style
})()
    ?? // Use first key 
    Object.keys(products.styleList)[0];

let currentSize = 
(function () {
    // Check url
    let size = urlParams.get('size') 
    if (Array.from(['s','m','l','xl']).includes(size)) return size;
    else return null
})()
    ?? 
(function () {
    // Get first availible size
    let sizes = products.styleList[currentKey].sizes
    let sizesVal = Object.values(sizes);
    let sizesKey = Object.keys(sizes);

    for (let i = 0; i < sizesVal.length; i++) if (sizesVal[i] === true) return sizesKey[i];
})()
    



// Check abailibility function
let checkAvailible = (style, size) => {
    // Check if style exists
    if (!products.styleList[style]) return false

    // Check if size availible
    if (products.styleList[style].sizes[size] !== true) return false

    return true
}


// Change visible slide show
let changeSlideShow = (targetKey=null) => {
    targetKey = targetKey ?? currentKey;

    Object.keys(styleList).forEach(key => {
        let style = styleList[key];    
        let slideShow = document.getElementById(style.slideShowId);

        if (key === targetKey) slideShow.style.display = 'block';
        else slideShow.style.display = 'none';
    })

    window.dispatchEvent(new CustomEvent('slideShowChange', {}))
}


// Change title
let titleOptions = document.getElementById('title-options');
let changeTitleOptions = (key=null) => {
    key = key ?? currentKey;
    let style = styleList[key];

    let title = style.title;
    let price = basket.penceToPound(style.price[basket.currency]);

    titleOptions.children[0].innerHTML = title;
    titleOptions.children[1].innerHTML = `${basket.currencySymbol}${price}`;
}


let addToBasket = document.getElementById('addToBasket');
let changeAddToBasket = (key=null) => {
    key = key ?? currentKey;
    let style = styleList[key];

    addToBasket.innerHTML = '';
    let node = document.createElement('span');

    if (checkAvailible(key, currentSize) === true) {
        node.innerHTML = 'Add to basket';
        let image = document.getElementById(style.slideShowId).children[0].children[0].children[0];
        let encodedImage = basket.encodeImageToUrl(image);

        node.addEventListener('click', e => {
            basket.appendItem(
                style.title,
                `${style.code}${currentSize}`,
                style.description[0],
                style.price,
                1,
                [encodedImage],
                [currentSize]
            )


            document.getElementById('basket').click();
        })
    } else {
        node.innerHTML = `Sorry, that's unavailible`;
        node.classList.add('invalid');
    }

    addToBasket.appendChild(node);
}
// Change addToBasket



// Create Size buttons
let sizeOptions = document.getElementById('size-options');
let changeSizeButtons = (key=null) => {
    key = key ?? currentKey;
    let style = styleList[key];

    let sizes = style.sizes;
    let keys = Object.keys(sizes);
    
    sizeOptions.innerHTML = '';

    keys.forEach(key => {
        let val = sizes[key];

        let node = document.createElement('span');
        node.classList.add('block');
        node.innerHTML = key;

        node.addEventListener('click', e => {
            currentSize = key;
            bigReset()
        })

        if (key === currentSize) node.classList.add('selected');
        if (val === false) node.classList.add('not-availible');

        sizeOptions.appendChild(node);
    })
}

// Create Color buttons
let colourOptions = document.getElementById('colour-options'); 
let changeColourButtons = (targetKey=null) => {
    targetKey = targetKey ?? currentKey;

    // Clear html
    colourOptions.innerHTML = '';

    // Create a button for each style
    Object.keys(styleList).forEach(key => {
        let style = styleList[key];

        let node = document.createElement('span');
        node.classList.add('block');
        node.style.background = style.iconColour;

        // Change colour click event listener
        node.addEventListener('click', e => {
            currentKey = key;
            bigReset();
        })

        if (key === targetKey) node.classList.add('selected');

        colourOptions.appendChild(node)
    }) 
}

bigReset = (param=null) => {
    changeSlideShow(param);
    changeColourButtons(param);
    changeSizeButtons(param);
    changeTitleOptions(param);
    changeAddToBasket(param)
}

bigReset()

// Apply features to all products / styleList loaded on each page
let n = Object.keys(styleList).length;
for (let prodN = 0; prodN < n; prodN++) {

    // Slide Show 
    let container = document.getElementsByClassName('slideshow-container')[prodN];
    let slideShow = document.getElementById('slideshow');
    let home = document.getElementsByClassName('ss-home')[prodN];
    let slides = Array.from(container.children);
    let left = document.getElementsByClassName('ss-left')[prodN];
    let right = document.getElementsByClassName('ss-right')[prodN];
    let bar = document.getElementsByClassName('ss-bar')[prodN];
    let bars = new Array;

    // Bandage function
    // Check if scopes product is currently in use by checking slideshow visability
    let isOn = () => {
        let props = window.getComputedStyle(home, null);
        let display = props.getPropertyValue('display');

        if (display === 'none') return false
        else return true
    }
    
    // Reset slideshow height with current slideshow
    let fixSlideShow = () => {
        // Return if using hidden slideshow
        if (!isOn()) return

        // Reset heights 
        home.style.height = 'auto';
        slideShow.style.height = 'auto';

        // Apply new heights
        let ssHeight = container.getBoundingClientRect().height;
        home.style.height = ssHeight + 'px';
        slideShow.style.height = ssHeight + 'px'
    }

    // Adjust slideshow height
    setTimeout(fixSlideShow(), 1)
    window.addEventListener('resize', fixSlideShow);
    window.addEventListener('load', fixSlideShow);
    window.addEventListener('slideShowChange', fixSlideShow)

    // Add scroll event listener
    let onScroll = () => {

        if (scrollAllow === false) return 


        for (let i = 0; i < bars.length; i++) {
            
            let slide = slides[i];
            let l = slide.getBoundingClientRect().left;
            if (l === 0) {
                curI = i;
                slideScroll(i)
            }
        }
    }

    let loadImg = (e) => {
        if (e.classList.contains('img-loaded')) return 

        e.src = e.dataset.src;
        e.classList.add('img-loaded');
    }

    let scrollAllow = false;
    onScroll = debounce(onScroll, 10)

    // Add spans on bar
    slides.forEach(slide => {
        let x = document.createElement('span');
        x.style.transition = 'filter 250ms cubic-bezier(0.075, 0.82, 0.165, 1)'

        bars.push(x)
        bar.appendChild(x)
    })



    // Function to move scrollbar to image I
    let slideScroll = (i) => {

        // Change scroll allow perms
        scrollAllow = false;
        setTimeout(function() {scrollAllow = true;}, 1000)

        // Change arrow opacity
        left.style.opacity = 1;
        right.style.opacity = 1;
        if (i === 0) left.style.opacity = 0;
        else if (i === slides.length - 1) right.style.opacity = 0;

        // Move image 
        let scroll = slides[i].getBoundingClientRect().left
        if (scroll < 50 && scroll >= 0 || scroll > -50 && scroll <= 0) scroll = 0;

        container.scrollBy({
            top: 0,
            left: scroll,
            behavior: 'smooth'
        })

        // Change Bar shades
        let bar = bars[i]
        bars.forEach(off => off.style.backgroundColor = '#D9D9D9');
        bar.style.backgroundColor = '#5B5B5B';
        

        return i
    }

    // Add event listeners to bars
    for (let i = 0; i < bars.length; i++) {
        let bar = bars[i];
        bar.addEventListener('click', e => {
            // change light
            bars.forEach(off => off.style.backgroundColor = '#D9D9D9');
            bar.style.backgroundColor = '#5B5B5B';
        
            // Change item position
            curI = slideScroll(i)
        })
    }

    // Left and Right Controls
    let curI = 0;
    left.addEventListener('click', e => {
        let pos = curI - 1;
        if (pos >= 0) {
            curI = slideScroll(pos);        
        } 
    })
    right.addEventListener('click', e => {
        let pos = curI + 1;
        if (pos <= slides.length - 1) {
            curI = slideScroll(pos);    
        } 
    })

    setTimeout(slideScroll(0))
    container.addEventListener('scroll', onScroll)
}