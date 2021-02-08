let ss_container = document.getElementById('slideshow-container');
let ss_controlls = Array.from(document.getElementById('slideshow-controlls').children);

ss_container.addEventListener('moveTo', e => {
    console.log(e)
    let target = e.detail.target
    ss_controlls.forEach(element => element.style.background = 'rgba(51, 51, 51, 0.42)')
    ss_controlls[target].style.background = 'rgba(51, 51, 51, 0.75)';
})

let slideShow = new Slideshow('slideshow-container', document.getElementById('mob-container'));

for (let i = 0; i < ss_controlls.length; i++) {
    let cont = ss_controlls[i];
    console.log(cont)
    cont.addEventListener('click', e => {
        slideShow.moveTo(i);
    })
}