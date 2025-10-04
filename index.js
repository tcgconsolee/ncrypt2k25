const load = document.getElementsByClassName("load")[0];
const start = document.getElementById("start");
document.addEventListener('keypress', n)
let pressed = false;
function n(e) {
    if (e.key === "n") {
        start.currentTime = start.duration
        cool = 0
        pressed=true;
        document.querySelectorAll(".dot").forEach(dot => {
            dot.style.display="block"
        })
    }
    document.removeEventListener("keypress", n)
}
let mouseonsofa = false, mouseontv = false, mouseoneventsv = false, mouseoncomputer = false;

let cool = 13;
let cooldowns = { sofa: 0, tv: 0, computer: 0, eventsv: 0, mode:0 };
let lastTime = performance.now();
let currentmode = 0;
const dark = document.getElementById("darkmode")
const light = document.getElementById("lightmode")
document.getElementsByClassName("modebtn")[0].addEventListener("click", () => {
    if(cool>0 || cooldowns.mode>0) return;
    cooldowns.mode=3;
    if(currentmode === 0) {
        currentmode = 1;
        dark.style.display = "block"; dark.play();
        setTimeout(() => {
            light.style.display = "none"
            start.style.display = "none"
        }, 5);
    } else {
        currentmode = 0;
        light.style.display = "block"; light.play();
        setTimeout(() => {
            dark.style.display = "none"
        }, 5);
    }
})



const videos = {
    tv: document.getElementById("tv"),
    eventsv: document.getElementById("eventsv"),
    sofa: document.getElementById("sofa"),
    computer: document.getElementById("computer")
};
const darkvideos = {
    tv: document.getElementById("dtv"),
    eventsv: document.getElementById("deventsv"),
    sofa: document.getElementById("dsofa"),
    computer: document.getElementById("dcomputer")
}

const isMobile = /Mobi|Android/i.test(navigator.userAgent);
if(isMobile) window.location.href = "./mobile"

function tick(now) {
    const delta = now - lastTime;
    if (delta >= 1000) {
        if (cool > 0) cool--;
        if (!isMobile) {
            for (let key in cooldowns) {
                if (cooldowns[key] > 0) cooldowns[key]--;
            }
        }
        lastTime = now;
    }

    for (let key in videos) {
        let video;
        if(currentmode === 0) {
            video = videos[key];
        } else {
            video = darkvideos[key]
        }
        const mouseFlag = window["mouseon" + key];
        if (
            !mouseFlag &&
            video.currentTime > 0 &&
            video.paused &&
            (isMobile ? true : cooldowns[key] === 0) &&
            cool === 0
        ) {
            video.play();
        }
    }

    requestAnimationFrame(tick);
}

function playVideo(key, mouseFlag) {
    window[mouseFlag] = true;
    
    let video;
    if(currentmode === 0) {
        video = videos[key];
    } else {
        video = darkvideos[key]
    }

    if (cool > 0 || (!isMobile && cooldowns[key] > 0)) return;

    video.style.display = "block";

    if (!isMobile) {
        cooldowns[key] = Math.floor(video.duration / 2);
    }
    video.currentTime = 0;
    video.play();

    setTimeout(() => {
        if (window[mouseFlag]) video.pause();
    }, (video.duration / 2) * 1000);
}

function continueVideo(key, mouseFlag) {
    window[mouseFlag] = false;
    let video;
    if(currentmode === 0) {
        video = videos[key];
    } else {
        video = darkvideos[key]
    }

    if (cool > 0 || (!isMobile && cooldowns[key] > 0)) return;
    video.play();
}

function playSofa() { playVideo("sofa", "mouseonsofa"); }
function conSofa() { continueVideo("sofa", "mouseonsofa"); }

function playComputer() { playVideo("computer", "mouseoncomputer"); }
function conComputer() { continueVideo("computer", "mouseoncomputer"); }

function playTv() { playVideo("tv", "mouseontv"); }
function conTv() { continueVideo("tv", "mouseontv"); }

function playEventsv() { playVideo("eventsv", "mouseoneventsv"); }
function conEventsv() { continueVideo("eventsv", "mouseoneventsv"); }

for (let key in videos) {
    videos[key].addEventListener("ended", () => {
        cooldowns[key] = 0;
        videos[key].style.display = "none";
    });
    darkvideos[key].addEventListener("ended", () => {
        cooldowns[key] = 0;
        darkvideos[key].style.display = "none";
    });
}


const teamd = document.getElementsByClassName("teamsection")[0];
const teamb = document.getElementsByClassName("teambtn")[0];
document.querySelector("#teamback img").addEventListener("click", () => {
    teamd.style.animation = "pagepush 1s forwards"
})
teamb.addEventListener("click", () => {
    if ((cooldowns.sofa > 0 && !isMobile) || cool > 0) return;
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
    el.style.display = "block";
    current = member.id;

    let i1 = Array.from(team).indexOf(c);
    let i2 = Array.from(team).indexOf(el);


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
    document.querySelector(`#${el.id} .tamenu`).style.animation = "none"
    document.querySelector(`#${el.id} .tname`).style.animation = "none"
    document.querySelector(`#${el.id} .tnick`).style.animation = "none"
    document.querySelector(`#${el.id} .tyear`).style.top = "-5vmax"
    document.querySelector(`#${el.id} .tamenu`).style.top = "-5vmax"
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
        document.querySelector(`#${el.id} .tamenu`).style.animation = "toptxt 1s forwards"
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
document.querySelectorAll(".alumnin").forEach(mem => {
    mem.addEventListener("click", () => {
        teamd.style.animation = "pagepush 1s forwards"
        alumnid.style.animation = "pagepull 1s forwards"
    })
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
    if ((cooldowns.computer > 0 && !isMobile) || cool > 0) return;
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
    if ((cooldowns.eventsv > 0 && !isMobile) || cool > 0) return;
    window.location.href = "./events"
})
function init() {
    requestAnimationFrame(tick)
    setTimeout(() => {
        document.querySelectorAll(".dot").forEach(dot => {
            dot.style.display="block"
        })
    }, 13000);
    document.getElementsByClassName("pressn")[0].style.animation="fade 5s forwards"
    load.style.animation = "fadeout 500ms forwards";
    setTimeout(() => {
        load.style.display = "none"
    }, 500);
    if(!pressed) {
        start.play();
    }
}
document.getElementsByClassName("dcryptbtn")[0].addEventListener("click", () => {
    window.location.href = "./discord"
})
document.getElementsByClassName("regbtn")[0].addEventListener("click", () => {
    if ((cooldowns.tv > 0 && !isMobile) || cool > 0)
        window.location.href = "./register"
})
$(document).ready(function ($) {
    let loaded = false;
    function animateBars() {
        $("#l1").animate({ height: "0px" }, 100)
            .animate({ height: "100px" }, 100);

        $("#l2").delay(50).animate({ height: "0px" }, 150)
            .animate({ height: "100px" }, 150);

        $("#l3").delay(100).animate({ height: "0px" }, 200)
            .animate({ height: "100px" }, 200);

        $("#l4").delay(150).animate({ height: "0px" }, 250)
            .animate({ height: "100px" }, 250);

        $("#l5").delay(200).animate({ height: "0px" }, 300)
            .animate({ height: "100px" }, 300);

        $("#l6").delay(250).animate({ height: "0px" }, 350)
            .animate({ height: "100px" }, 350);

        $("#l7").delay(300).animate({ height: "0px" }, 400)
            .animate({ height: "100px" }, 400);

        $("#l8").delay(350).animate({ height: "0px" }, 450)
            .animate({ height: "100px" }, 450);
        if (loaded) {
            clearInterval(interval);

            $(".loader-tdiv").animate({ opacity: "0" }, 500);
            $(".loader").fadeOut(500);

            setTimeout(() => {
                init();
            }, 500);
        }
    }

    animateBars();
    let interval;
    setTimeout(() => {
        interval = setInterval(animateBars, 2000);
    }, 2000);
    $(window).on("load", function () {
        loaded = true;
    });
});
const els = [
    document.querySelector(".bg"),
    document.querySelector("#start"),
    document.querySelector("#tv"),
    document.querySelector("#eventsv"),
    document.querySelector("#sofa"),
    document.querySelector("#computer")
];
const imgContainer = document.querySelector('.bg-inner');
const img = imgContainer.querySelector('img');
let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

window.addEventListener("mousemove", (e) => {
  const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  const rect = img.getBoundingClientRect();

  const maxTranslateX = (rect.width - window.innerWidth) / 2;
  const maxTranslateY = (rect.height - window.innerHeight) / 2;

  targetX = -mouseX * maxTranslateX;
  targetY = -mouseY * (maxTranslateY > 40 ? 40 : maxTranslateY);
});

function animate() {
  const ease = 0.06;
  currentX += (targetX - currentX) * ease;
  currentY += (targetY - currentY) * ease;

  imgContainer.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.02)`;

  requestAnimationFrame(animate);
}
animate();

let dotData = [];

function centroid(coords) {
  let sx = 0, sy = 0, count = 0;
  for (let i = 0; i < coords.length; i += 2) {
    sx += coords[i];
    sy += coords[i + 1];
    count++;
  }
  return { x: sx / count, y: sy / count };
}

function buildDotDataFromMap(mapName = "image-map") {
  const map = document.querySelector(`map[name="${mapName}"]`);
  if (!map) return;
  dotData = [];

  map.querySelectorAll("area").forEach(area => {
    if(area.classList.contains("modebtn")) return;
    const coords = area.coords.split(",").map(Number);
    const shape = (area.shape || "poly").toLowerCase();
    let cx = 0, cy = 0;

    if (shape === "poly" || shape === "rect") {
      const c = centroid(coords);
      cx = c.x; cy = c.y;
    } else if (shape === "circle") {
      cx = coords[0]; cy = coords[1];
    }

    const dot = document.createElement("div");
    dot.className = "dot";
    imgContainer.appendChild(dot);

    dotData.push({ area, coords, shape, cx, cy, dot });

    area.addEventListener("mouseenter", () => dot.classList.add("active"));
    area.addEventListener("mouseleave", () => dot.classList.remove("active"));
  });
}

function updateDotPositions() {
  if (!img.naturalWidth || !img.naturalHeight) return;

  const scaleX = img.clientWidth / img.naturalWidth;
  const scaleY = img.clientHeight / img.naturalHeight;

  const offsetX = img.offsetLeft;
  const offsetY = img.offsetTop;

  dotData.forEach(item => {
    const left = offsetX + item.cx * scaleX;
    const top = offsetY + item.cy * scaleY;

    item.dot.style.left = `${left}px`;
    item.dot.style.top = `${top}px`;
  });
}

function initDots() {
  buildDotDataFromMap("image-map");
  updateDotPositions();
}

if (img.complete) {
  initDots();
} else {
  img.addEventListener("load", initDots);
}

window.addEventListener("resize", () => {
  if (typeof imageMapResize === "function") imageMapResize();
  updateDotPositions();
});
