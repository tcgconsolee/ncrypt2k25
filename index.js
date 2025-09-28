const start = document.getElementById("start");
const tv = document.getElementById("tv");
const eventsv = document.getElementById("eventsv");
const sofa = document.getElementById("sofa");
const computer = document.getElementById("computer");
const canvas = document.getElementById("eventsv-canvas");
const ctx = canvas.getContext("2d");

let mouseonsofa = false, mouseontv = false, mouseoneventsv = false, mouseoncomputer = false;
let cool = 12, lastTime = performance.now();

const greenStrength = 1;
const tolerance = 0;

let greenLoopId = null;

// ---------------- Tick loop for autoplay & cooldown ----------------
function tick(now){
    const delta = now - lastTime;
    if(delta >= 1000 && cool>0){
        cool--;
        lastTime = now;
    }
    if(cool<0) cool=0;

    if(!mouseonsofa && sofa.currentTime>0 && sofa.paused) sofa.play();
    if(!mouseontv && tv.currentTime>0 && tv.paused) tv.play();
    if(!mouseoncomputer && computer.currentTime>0 && computer.paused) computer.play();
    if(!mouseoneventsv && eventsv.currentTime>0 && eventsv.paused) eventsv.play();

    requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// ---------------- General play/pause helpers ----------------
function playVideo(video, mouseFlag){
    window[mouseFlag] = true;
    if(cool>0) return;
    video.style.display="block";
    cool = video.duration/2;
    setTimeout(()=>{
        if(window[mouseFlag]) video.pause();
    }, (video.duration/2)*1000);
    video.currentTime=0;
    video.play();
}
function continueVideo(video, mouseFlag){
    window[mouseFlag]=false;
    if(cool>0) return;
    video.play();
}

// ---------------- Sofa ----------------
function playSofa(){ playVideo(sofa,'mouseonsofa'); }
function conSofa(){ continueVideo(sofa,'mouseonsofa'); }
sofa.addEventListener("ended",()=>sofa.style.display="none");

// ---------------- Computer ----------------
function playComputer(){ playVideo(computer,'mouseoncomputer'); }
function conComputer(){ continueVideo(computer,'mouseoncomputer'); }
computer.addEventListener("ended",()=>computer.style.display="none");

// ---------------- TV ----------------
function playTv(){ playVideo(tv,'mouseontv'); }
function conTv(){ continueVideo(tv,'mouseontv'); }
tv.addEventListener("ended",()=>tv.style.display="none");

// ---------------- Eventsv ----------------
function playEventsv(){
    mouseoneventsv = true;
    if(cool>0) return;
    canvas.style.display="block";
    cool = eventsv.duration/2;
    setTimeout(()=>{
        if(mouseoneventsv) eventsv.pause();
    }, (eventsv.duration/2)*1000);
    eventsv.currentTime=0;
    eventsv.play();
    startGreenScreenLoop();
}
function conEventsv(){
    mouseoneventsv = false;
    if(cool>0) return;
    eventsv.play();
}
eventsv.addEventListener("ended", ()=>{
    canvas.style.display="none";
    stopGreenScreenLoop();
});

// ---------------- Green-screen processing (no halo) ----------------
function startGreenScreenLoop(){
    if(greenLoopId) cancelAnimationFrame(greenLoopId);

    canvas.width = eventsv.videoWidth
    canvas.height = eventsv.videoHeight

    function renderFrame(){
        if(eventsv.paused || eventsv.ended){
            greenLoopId = null;
            return;
        }

        ctx.drawImage(eventsv,0,0,canvas.width,canvas.height);
        let frame = ctx.getImageData(0,0,canvas.width,canvas.height);
        let data = frame.data;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i], g = data[i + 1], b = data[i + 2];

            // strict green detection
            if (g > r*0.9 + 20 && g > b*0.9 + 20) {
                data[i + 3] = 0; // fully transparent
                data[i] = r + (g - r) * 0.5;  // reduce green spill in red channel
                data[i + 2] = b + (g - b) * 0.5; // reduce green spill in blue channel
                data[i + 1] = 0; // remove remaining green
            } 
            // soft edges: reduce green influence
            else if (g > r && g > b) {
                let factor = 1 - Math.min((g - Math.max(r, b))/30, 1);
                data[i + 3] = data[i + 3] * factor;
                let avg = (r + b) / 2;
                data[i] = avg;
                data[i + 1] = avg;
                data[i + 2] = avg;
            }
        }

        ctx.putImageData(frame,0,0);
        greenLoopId = requestAnimationFrame(renderFrame);
    }

    greenLoopId = requestAnimationFrame(renderFrame);
}

function stopGreenScreenLoop(){
    if(greenLoopId) cancelAnimationFrame(greenLoopId);
    greenLoopId=null;
}
const teamd = document.getElementsByClassName("teamsection")[0];
            const teamb = document.getElementsByClassName("teambtn")[0];
            document.querySelector("#teamback img").addEventListener("click", () => {
                teamd.style.animation = "pagepush 1s forwards"
            })
            teamb.addEventListener("click", () => {
                if(cool > 0) return;
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
                let distance = Math.sqrt( x*x + y*y );
                if (distance < (this.width * hoverArea)) {
                    hover = true;
                    if (!this.hover) {
                        this.hover = true;
                    }
                    this.onHover(e.clientX, e.clientY);
                }
                
                if(!hover && this.hover) {
                    this.onLeave();
                    this.hover = false;
                }
                }
                
                onHover(x, y) {
                gsap.to(this.el,  {
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
                    if(i+1>members.length) {
                        i =0;
                    }
                    selectm(members[i])
                } else if (e.keyCode == 37) {
                    
                    let el = document.getElementById(current);
                    let i = Array.from(members).indexOf(el) - 1;
                    if(i<0) {
                        i = members.length-1;
                    }
                    selectm(members[i])
                }
            })
             const alumnid = document.getElementsByClassName("alumnisection")[0];
            document.querySelector("#alumniback img").addEventListener("click", () => {
                if(cool>0) return;
                alumnid.style.animation = "pagepush 1s forwards"
            })
            document.getElementById("alumnin").addEventListener("click", () => {
                if(cool>0) return;
                teamd.style.animation="pagepush 1s forwards"
                alumnid.style.animation = "pagepull 1s forwards"
            })
            document.getElementById("teamin").addEventListener("click", () => {
                if(cool>0) return;
                teamd.style.animation="pagepull 1s forwards"
                alumnid.style.animation = "pagepush 1s forwards"
            })
            const y24 = document.getElementsByClassName("24")[0];
            const y22 = document.getElementsByClassName("22")[0];
            const classdiv = document.getElementsByClassName("class")[0]
            const pics = document.querySelectorAll(".pictures")

            y24.addEventListener("click", () => {
                classdiv.innerHTML = "CLASS OF 2<span>K</span>24 CLASS OF 2<span>K</span>24"
                pics.forEach(pic => {
                    pic.style.display="none"
                })
                document.getElementById("alum24").style.display="flex"
            })
            y22.addEventListener("click", () => {
                classdiv.innerHTML = "CLASS OF 2<span>K</span>22 CLASS OF 2<span>K</span>22"
                pics.forEach(pic => {
                    pic.style.display="none"
                })
                document.getElementById("alum22").style.display="flex"
            })
            window.onload = function() {
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
            window.location.href="/events.html"
        })