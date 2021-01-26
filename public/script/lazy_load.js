(function() {
    let lazy_images = Array.from(document.getElementsByClassName('lazy-load'));

    let checkImages = () => {

        lazy_images.forEach(img => {

            // Check if about to scroll on
            let scrollTop = window.pageYOffset;

            if (img.offsetTop < (window.innerHeight + scrollTop)) {

                // change src to data-src and remove from list
                img.src = img.dataset.src;
                lazy_images.splice(lazy_images.indexOf(img), 1);

            }

            if (lazy_images.length === 0) {

                // Remove event listeners   
                document.removeEventListener('scroll', checkImages);
                window.removeEventListener('resize', checkImages);
                window.removeEventListener('orientationchange', checkImages);

            }
        })

    }

    // Add event listeners
    document.addEventListener('scroll', checkImages);
    window.addEventListener('resize', checkImages);
    window.addEventListener('orientationChange', checkImages);

    // Early load checks
    checkImages()
    window.addEventListener('load', checkImages())    

    
})()