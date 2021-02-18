(function() {
    let lazy_images = Array.from(document.getElementsByClassName('lazy-load'));
    let scrollers = [document, ...Array.from(document.getElementsByClassName('scroll'))];

    let checkImages = () => {
        
        

        lazy_images.forEach(img => {

            // Check if about to scroll on
            let scrollX = window.pageYOffset;
            let scrollY = window.pageYOffset;
            let imgX = img.getBoundingClientRect().top;
            let imgY = img.getBoundingClientRect().left;

            console.log(img ,`Y ${imgY} < ${window.innerHeight} + ${scrollY}\nX ${imgX} < ${window.innerWidth} + ${scrollX}`)

            
            if (imgY < (window.innerHeight + scrollY) && imgX < (window.innerWidth + scrollX)) {

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