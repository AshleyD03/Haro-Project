let ss_container = document.getElementById('slideshow-container');
let ss_controlls = Array.from(document.getElementById('slideshow-controlls').children);

ss_container.addEventListener('moveTo', e => {
    let target = e.detail.target
    ss_controlls.forEach(element => element.style.background = 'rgba(51, 51, 51, 0.42)')
    ss_controlls[target].style.background = 'rgba(51, 51, 51, 0.75)';
})

let slideShow = new Slideshow('slideshow-container', document.getElementById('mob-container'));
slideShow.styleClassOn = 'slide-on';
slideShow.styleClassOff = 'slide-off'

// Add controll event listeners
for (let i = 0; i < ss_controlls.length; i++) {
    let cont = ss_controlls[i];
    cont.addEventListener('click', e => {
        slideShow.moveTo(i);
    })
}

let a = Array.from(document.getElementsByClassName('product'));
a.forEach(b=> {

    let x = (y) => {
        let d = y.getBoundingClientRect()
        console.log(y)
        console.log({
            top: d.top,
            right: d.right,
            bottom: d.bottom,
            left: d.left
        }) 
    }
        
    b.children[0].addEventListener('click', e => {
        e.preventDefault();

        let c = e.currentTarget;
        x(c);
    })

})