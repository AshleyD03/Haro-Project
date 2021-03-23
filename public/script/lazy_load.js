(function() {
    let lazy_images = Array.from(document.getElementsByClassName('lazy-load'));
    let scrollers = [document, ...Array.from(document.getElementsByClassName('scroll'))];

    function getElementPostions (ele) {
        
        let pos = ele.getBoundingClientRect();
        return {
            top: pos.top + window.scrollY,
            right: pos.right + window.scrollX,
            bottom: pos.bottom + window.scrollY,
            left: pos.right + window.scrollX
        }
        
    }

    // Cross browser height && width
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    let checkImages = () => {

        let y = vh + window.scrollY;
        let x = vw + window.scrollX;
        lazy_images.forEach(img => {

            // Check if about to scroll on
            let {top, right, bottom, left} = getElementPostions(img);
            

            let checkY = (y + 300 > top || bottom < window.scrollY - 300)
            let checkX = (x + 300 > left || right < window.scrollX - 300)

            if (checkX && checkY) {

                

                //console.log(img, imgX, imgY)
                // change src to data-src and remove from list
                img.src = img.dataset.src;
                lazy_images.splice(lazy_images.indexOf(img), 1);

            }

            if (lazy_images.length === 0) {

                // Remove event listeners
                scrollers.forEach(scroll => scroll.removeEventListener('scroll', checkImages));   
                window.removeEventListener('resize', checkImages);
                window.removeEventListener('orientationchange', checkImages);

            }
            
        })

    }

    // Add event listeners
    scrollers.forEach(scroll => scroll.addEventListener('scroll', checkImages),{passive: true});
    window.addEventListener('resize', checkImages);
    window.addEventListener('orientationChange', checkImages);

    // Early load checks
    checkImages()
    window.addEventListener('load', checkImages())    

    
})()