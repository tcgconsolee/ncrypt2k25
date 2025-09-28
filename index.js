const start = document.getElementById("start");

// mouse flags
let mouseonsofa = false, mouseontv = false, mouseoneventsv = false, mouseoncomputer = false;

// global and per-video cooldowns
let cool = 12;  // global (for "start")
let cooldowns = { sofa: 0, tv: 0, computer: 0, eventsv: 0 };
let lastTime = performance.now();

// store all videos + canvases
const videos = {
    tv: { video: document.getElementById("tv"), canvas: document.getElementById("tv-canvas"), ctx: null, loopId: null },
    eventsv: { video: document.getElementById("eventsv"), canvas: document.getElementById("eventsv-canvas"), ctx: null, loopId: null },
    sofa: { video: document.getElementById("sofa"), canvas: document.getElementById("sofa-canvas"), ctx: null, loopId: null },
    computer: { video: document.getElementById("computer"), canvas: document.getElementById("computer-canvas"), ctx: null, loopId: null }
};
for (let key in videos) {
    videos[key].ctx = videos[key].canvas.getContext("2d");
}

// ---------------- Tick loop ----------------
function tick(now) {
    const delta = now - lastTime;
    if (delta >= 1000) {
        if (cool > 0) cool--; // global cooldown
        for (let key in cooldowns) { // per-video cooldowns
            if (cooldowns[key] > 0) cooldowns[key]--;
        }
        lastTime = now;
    }

    // auto-resume when mouse not on
    for (let key in videos) {
        const { video } = videos[key];
        const mouseFlag = window["mouseon" + key]; // e.g. mouseonsofa
        if (!mouseFlag && video.currentTime > 0 && video.paused) {
            video.play();
        }
    }

    requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// ---------------- Green-screen rendering ----------------
function startGreenScreenLoop(key) {
    const { video, canvas, ctx } = videos[key];
    if (videos[key].loopId) cancelAnimationFrame(videos[key].loopId);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    function renderFrame() {
        if (video.paused || video.ended) {
            videos[key].loopId = null;
            return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = frame.data;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i], g = data[i + 1], b = data[i + 2];

            if (g > r * 0.9 + 20 && g > b * 0.9 + 20) {
                data[i + 3] = 0;
                data[i] = r + (g - r) * 0.5;
                data[i + 2] = b + (g - b) * 0.5;
                data[i + 1] = 0;
            } else if (g > r && g > b) {
                let factor = 1 - Math.min((g - Math.max(r, b)) / 30, 1);
                data[i + 3] = data[i + 3] * factor;
                let avg = (r + b) / 2;
                data[i] = avg;
                data[i + 1] = avg;
                data[i + 2] = avg;
            }
        }

        ctx.putImageData(frame, 0, 0);
        videos[key].loopId = requestAnimationFrame(renderFrame);
    }

    videos[key].loopId = requestAnimationFrame(renderFrame);
}
function stopGreenScreenLoop(key) {
    if (videos[key].loopId) cancelAnimationFrame(videos[key].loopId);
    videos[key].loopId = null;
}

// ---------------- Play/Pause helpers ----------------
function playWithChroma(key, mouseFlag) {
    window[mouseFlag] = true;
    const { video, canvas } = videos[key];

    // check both global and per-video cooldowns
    if (cool > 0 || cooldowns[key] > 0) return;

    canvas.style.display = "block";
    cooldowns[key] = Math.floor(video.duration / 2);

    setTimeout(() => {
        if (window[mouseFlag]) video.pause();
    }, (video.duration / 2) * 1000);

    video.currentTime = 0;
    video.play();
    startGreenScreenLoop(key);
}

function continueWithChroma(key, mouseFlag) {
    window[mouseFlag] = false;
    const { video } = videos[key];

    if (cool > 0 || cooldowns[key] > 0) return;
    video.play();
}

// ---------------- Sofa ----------------
function playSofa() { playWithChroma("sofa", "mouseonsofa"); }
function conSofa() { continueWithChroma("sofa", "mouseonsofa"); }
videos.sofa.video.addEventListener("ended", () => { videos.sofa.canvas.style.display = "none"; stopGreenScreenLoop("sofa"); });

// ---------------- Computer ----------------
function playComputer() { playWithChroma("computer", "mouseoncomputer"); }
function conComputer() { continueWithChroma("computer", "mouseoncomputer"); }
videos.computer.video.addEventListener("ended", () => { videos.computer.canvas.style.display = "none"; stopGreenScreenLoop("computer"); });

// ---------------- TV ----------------
function playTv() { playWithChroma("tv", "mouseontv"); }
function conTv() { continueWithChroma("tv", "mouseontv"); }
videos.tv.video.addEventListener("ended", () => { videos.tv.canvas.style.display = "none"; stopGreenScreenLoop("tv"); });

// ---------------- Eventsv ----------------
function playEventsv() { playWithChroma("eventsv", "mouseoneventsv"); }
function conEventsv() { continueWithChroma("eventsv", "mouseoneventsv"); }
videos.eventsv.video.addEventListener("ended", () => { videos.eventsv.canvas.style.display = "none"; stopGreenScreenLoop("eventsv"); });
const teamd = document.getElementsByClassName("teamsection")[0];
const teamb = document.getElementsByClassName("teambtn")[0];
document.querySelector("#teamback img").addEventListener("click", () => {
    teamd.style.animation = "pagepush 1s forwards"
})
teamb.addEventListener("click", () => {
    if (cooldowns.sofa > 0) return;
    teamd.style.animation = "pagepull 1s forwards"
    selectm(document.getElementById(current))
})
const team = document.querySelectorAll(".team");
team.forEach(tm => {
    tm.style.display = "none";
})
document.getElementById("aaryan_parveen").style.filter = "saturate(100%)"
document.getElementById("aaryan-parveen").style.display = "block"
const members = document.querySelectorAll(".member")
let current = "aaryan_parveen"
let cooldown = 0;
function selectm(member) {
    if (cooldown > 0) return;
    cooldown = 10;

    members.forEach(m => m.style.filter = "saturate(0%)");
    member.style.filter = "saturate(100%)";

    let c = document.getElementById(current.replace("_", "-"));
    let el = document.getElementById(member.id.replace("_", "-"));
    current = member.id;

    let i1 = Array.from(team).indexOf(c);
    let i2 = Array.from(team).indexOf(el);

    el.style.display = "block";

    if (i1 > i2) {
        c.style.animation = "lteampush 1s forwards";
        el.style.animation = "lteampull 1s forwards";
    } else if (i2 > i1) {
        c.style.animation = "rteampush 1s forwards";
        el.style.animation = "rteampull 1s forwards";
    }

    let target = document.querySelector(`#${el.id} .tbg p`);
    let finalText = target.innerHTML;
    target.innerHTML = "";
    document.querySelector(`#${el.id} .tyear`).style.animation = "none"
    document.querySelector(`#${el.id} .tteam`).style.animation = "none"
    document.querySelector(`#${el.id} .tname`).style.animation = "none"
    document.querySelector(`#${el.id} .tnick`).style.animation = "none"
    document.querySelector(`#${el.id} .tyear`).style.top = "-5vmax"
    document.querySelector(`#${el.id} .tteam`).style.top = "-5vmax"
    document.querySelector(`#${el.id} .tname`).style.bottom = "-5vmax"
    document.querySelector(`#${el.id} .tnick`).style.bottom = "-5vmax"

    setTimeout(() => {
        if (target) {
            gsap.to(target, {
                duration: 2.5,
                scrambleText: {
                    text: finalText,
                    chars: "upperCase",
                    revealDelay: 0.5,
                    speed: 0.3,
                    delimiter: "",
                    tweenLength: true
                },
                ease: "power1.inOut"
            });
        }
    }, 500);
    setTimeout(() => {
        document.querySelector(`#${el.id} .tyear`).style.animation = "toptxt 1s forwards"
        document.querySelector(`#${el.id} .tteam`).style.animation = "toptxt 1s forwards"
        document.querySelector(`#${el.id} .tname`).style.animation = "bottomtxt 1s forwards"
        document.querySelector(`#${el.id} .tnick`).style.animation = "bottomtxt 1s forwards"
        c.style.display = "none";
        el.style.display = "block";
    }, 1000);

    let interval = setInterval(() => {
        cooldown--;
        if (cooldown < 1) clearInterval(interval);
    }, 100);
}

members.forEach(member => {
    member.addEventListener("click", () => {
        selectm(member);
    })
})
class HoverButton {
    constructor(el) {
        this.el = el;
        this.hover = false;
        this.calculatePosition();
        this.attachEventsListener();
    }

    attachEventsListener() {
        window.addEventListener('mousemove', e => this.onMouseMove(e));
        window.addEventListener('resize', e => this.calculatePosition(e));
    }

    calculatePosition() {
        gsap.set(this.el, {
            x: 0,
            y: 0,
            scale: 1
        });
        const box = this.el.getBoundingClientRect();
        this.x = box.left + (box.width * 0.5);
        this.y = box.top + (box.height * 0.5);
        this.width = box.width;
        this.height = box.height;
    }

    onMouseMove(e) {
        this.calculatePosition();
        let hover = false;
        let hoverArea = (this.hover ? 0.7 : 0.5);
        let x = e.clientX - this.x;
        let y = e.clientY - this.y;
        let distance = Math.sqrt(x * x + y * y);
        if (distance < (this.width * hoverArea)) {
            hover = true;
            if (!this.hover) {
                this.hover = true;
            }
            this.onHover(e.clientX, e.clientY);
        }

        if (!hover && this.hover) {
            this.onLeave();
            this.hover = false;
        }
    }

    onHover(x, y) {
        gsap.to(this.el, {
            x: (x - this.x) * 0.15,
            y: (y - this.y) * 0.15,
            scale: 1.1,
            ease: 'power2.out',
            duration: 0.8
        });
        this.el.style.zIndex = 10;
    }
    onLeave() {
        gsap.to(this.el, {
            x: 0,
            y: 0,
            scale: 1,
            ease: 'power2.out',
            duration: 1.3
        });
        this.el.style.zIndex = 1;
    }
}

const pic = document.querySelectorAll('.timg');
pic.forEach(p => {
    new HoverButton(p);
})
document.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) {
        let el = document.getElementById(current);
        let i = Array.from(members).indexOf(el) + 1;
        if (i + 1 > members.length) {
            i = 0;
        }
        selectm(members[i])
    } else if (e.keyCode == 37) {

        let el = document.getElementById(current);
        let i = Array.from(members).indexOf(el) - 1;
        if (i < 0) {
            i = members.length - 1;
        }
        selectm(members[i])
    }
})
const alumnid = document.getElementsByClassName("alumnisection")[0];
document.querySelector("#alumniback img").addEventListener("click", () => {
    alumnid.style.animation = "pagepush 1s forwards"
})
document.getElementById("alumnin").addEventListener("click", () => {
    teamd.style.animation = "pagepush 1s forwards"
    alumnid.style.animation = "pagepull 1s forwards"
})
document.getElementById("teamin").addEventListener("click", () => {
    teamd.style.animation = "pagepull 1s forwards"
    alumnid.style.animation = "pagepush 1s forwards"
})
const y24 = document.getElementsByClassName("24")[0];
const y22 = document.getElementsByClassName("22")[0];
const classdiv = document.getElementsByClassName("class")[0]
const pics = document.querySelectorAll(".pictures")

y24.addEventListener("click", () => {
    classdiv.innerHTML = "CLASS OF 2<span>K</span>24 CLASS OF 2<span>K</span>24"
    pics.forEach(pic => {
        pic.style.display = "none"
    })
    document.getElementById("alum24").style.display = "flex"
})
y22.addEventListener("click", () => {
    classdiv.innerHTML = "CLASS OF 2<span>K</span>22 CLASS OF 2<span>K</span>22"
    pics.forEach(pic => {
        pic.style.display = "none"
    })
    document.getElementById("alum22").style.display = "flex"
})
window.onload = function () {
    imageMapResize();
}
document.querySelectorAll("area").forEach(area => {
    area.addEventListener("click", (e) => {
        e.preventDefault();
    })
})
const blur = document.getElementsByClassName("blur")[0];
const teaserbtn = document.getElementsByClassName("teaserbtn")[0];
const teaser = document.getElementsByClassName("teaser")[0]
const video = document.querySelector(".teaser video");
teaserbtn.addEventListener("click", () => {
    if(cooldowns.tv > 0) return;
    blur.style.display = "block";
    blur.style.animation = "blurin 1s forwards"
    teaser.style.display = "block"
    video.play();
})
blur.addEventListener("click", () => {
    blur.style.animation = "blurout 1s forwards"
    teaser.style.display = "none"
    video.pause();
    video.currentTime = 0;
    setTimeout(() => {
        blur.style.display = "none"
    }, 1000);
})
document.getElementsByClassName("eventsbtn")[0].addEventListener("click", () => {
    window.location.href = "./events.html"
})