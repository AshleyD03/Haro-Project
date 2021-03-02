(function() {
    let lazy_images = Array.from(document.getElementsByClassName('lazy-load'));
    let scrollers = [document, ...Array.from(document.getElementsByClassName('scroll'))];

    function getElementPostions (ele) {
        let top = 0;
        let left = 0;

        let climb = (child) => {
            let parent = child.parentNode;
            top += child.offsetTop;
            left += child.offsetLeft;

            if (parent.nodeName !== 'BODY') climb(parent)
        }

        climb(ele)
        return {top: top, left: left}
    }

    function getViewPositions () {
        
    }

    let checkImages = () => {
        
        

        lazy_images.forEach(img => {

            console.log(img)
            // Check if about to scroll on
            let scrollX = window.pageXOffset;
            let scrollY = window.pageYOffset;
            let {top, left} = getElementPostions(img);

            if (top < (window.innerHeight + scrollY + 100) && left < (window.innerWidth + scrollX + 100)) {

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
    scrollers.forEach(scroll => scroll.addEventListener('scroll', checkImages));
    window.addEventListener('resize', checkImages);
    window.addEventListener('orientationChange', checkImages);

    // Early load checks
    checkImages()
    window.addEventListener('load', checkImages())    

    
})()