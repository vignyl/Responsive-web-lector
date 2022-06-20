

const player = document.querySelector('.mtvs-player');
const controlResize = document.querySelector('.mtvs-controls-resize');
const leftControlResize = document.querySelector('.mtvs-left-controls-resize');
const rightControlResize = document.querySelector('.mtvs-right-controls-resize');
const resizeBtn = document.getElementById('mtvs-resize-btn');
const video = document.querySelector('.mtvs-video');
const progressSpan = document.querySelector('.mtvs-progress-span');
const progressBar = document.querySelector('.mtvs-progress-bar');
const playBtn = document.getElementById('mtvs-play-btn');
const volumeIcon = document.getElementById('mtvs-volume-icon');
const volumeLine = document.querySelector('.mtvs-volume-line');
const volumeBar = document.querySelector('.mtvs-volume-bar');
const speed = document.querySelector('.mtvs-player-speed');
const currentTime = document.querySelector('.mtvs-time-elapsed');
const duration = document.querySelector('.mtvs-time-duration');
const fullScreenbtn = document.querySelector('.mtvs-fullscreen');
const fullscreenIcon = document.getElementById('mtvs-fullscreen-icon');
const playNotif = document.querySelector('.mtvs-play-notif');
const playNotifIcon = document.getElementById('mtvs-play-notif-icon');
const volumeNotif = document.querySelector('.mtvs-volume-notif');
const volumeNotifIcon = document.getElementById('mtvs-volume-notif-icon');

//Even listener

playBtn.addEventListener('click', togglePlay);
resizeBtn.addEventListener('click', toggleExpand);
leftControlResize.addEventListener('click', toggleExpand);
rightControlResize.addEventListener('click', closeVideo);

video.addEventListener('click', togglePlay);
video.addEventListener('ended', displayPlayIcon);
video.addEventListener('timeupdate', spanUpdate);
video.addEventListener('canplay', spanUpdate);

progressSpan.addEventListener('click', spanTime);
progressSpan.addEventListener('mousemove', showMouseOvertime);
progressSpan.addEventListener('mousedown', setCanDraw);
progressSpan.addEventListener('mouseup', unsetCanDraw);
progressSpan.addEventListener('mousemove', dragSpanTime);

volumeLine.addEventListener('click', changeVolume);
volumeLine.addEventListener('mousedown', setCanDraw);
volumeLine.addEventListener('mouseup', unsetCanDraw);
volumeLine.addEventListener('mousemove', dragVolume);

volumeIcon.addEventListener('click', toggleMute);

speed.addEventListener('change', changeSpeed);
fullScreenbtn.addEventListener('click', toggleFullscreen);

document.body.addEventListener('keydown', keyAction);
video.addEventListener('wheel', changeVolumeScrolling);
volumeLine.addEventListener('wheel', changeVolumeScrolling);
progressSpan.addEventListener('wheel', changeTimeScrolling);

//Const
let endVolume = 0.5;
let fullscreen = false;
let canDraw = false;
let keyboardShortcut = {
	mute: 77, 
	backward: 37,
	forward: 39, 
	volumeUp: 38, 
	volumeDown: 40, 
	pausePlay: 32, 
	fullscreen: 70, 
	resize: 82, 
};
//Initialize values

video.volume = endVolume; 


function keyAction(e){
	e.preventDefault();
    var keycode = (e.keyCode ? e.keyCode : e.which);
	if(keycode == keyboardShortcut.pausePlay) togglePlay();
	if(keycode == keyboardShortcut.mute) toggleMute();
	if(keycode == keyboardShortcut.fullscreen) toggleFullscreen();
	if(keycode == keyboardShortcut.resize) toggleExpand();
	if(keycode == keyboardShortcut.volumeUp) setVolume(endVolume + 0.1);
	if(keycode == keyboardShortcut.volumeDown) setVolume(endVolume - 0.1);
	if(keycode == keyboardShortcut.forward) setTime((video.currentTime / video.duration) + 0.025);
	if(keycode == keyboardShortcut.backward) setTime((video.currentTime / video.duration) + -0.025);
}


function toggleExpand(){
	if(player.style.position == 'relative') { 
      player.style.position = 'absolute';
      player.style.bottom = '15px';
      player.style.right = '15px';
      player.style.maxWidth = '30vw';   
      player.style.minWidth = '500px';  
      controlResize.style.opacity = "1";
      resizeBtn.style.display = "none";
    }else{   
      player.style.position = 'relative';
      player.style.bottom = '';
      player.style.right = '';
      player.style.maxWidth = '80vw';   
      player.style.minWidth = '800px';  
      controlResize.style.opacity = "0";
      resizeBtn.style.display = "block"; 
    }
}

function closeVideo(){
	toggleExpand();
	video.pause();
	video.currentTime = 0;
}

function togglePlay(){ 
	if(video.paused){
		video.play();
		playBtn.setAttribute('title', 'Pause'); 
		playBtn.classList.replace('fa-play', 'fa-pause');
		playNotifIcon.classList.replace('fa-pause', 'fa-play');
	}
	else {
		video.pause();
		displayPlayIcon();
		playNotifIcon.classList.replace('fa-play', 'fa-pause');
	}
	unfade(playBtn); 
	fade(playNotif, 20);
}

function displayPlayIcon(){
	playBtn.classList.replace('fa-pause', 'fa-play');
	playBtn.setAttribute('title', 'Play'); 
}

function showTime(time){
	let hour = 0;
	let minute = Math.floor(time / 60);
	if(minute >= 60) {
		hour = Math.floor(minute / 60);
		minute = minute % 60;
	}
	let seconds = Math.floor(time % 60);
	//console.log("time", time, "hour", hour, "minute", minute, "seconds", seconds);
	seconds = seconds > 9 ? seconds : `0${seconds}`;
	minute = minute > 9 ? minute : `0${minute}`;
	hour = hour > 0 ? (hour > 9 ? `${hour}:` : `0${hour}:`) : "";
	return `${hour}${minute}:${seconds}`;
}

function spanUpdate(){
	//console.log("currentTime", video.currentTime, "duration", video.duration);
	progressBar.style.width = `${(video.currentTime/video.duration) * 100}%`;
	currentTime.textContent = `${showTime(video.currentTime)} /`;
	duration.textContent = `${showTime(video.duration)}`;
}

function spanTime(e){
	//console.log(e);
	const newTime = e.offsetX / progressSpan.offsetWidth;
	setTime(newTime);
}

function showMouseOvertime(e){
	//console.log("e.offsetX", e.offsetX, "progressSpan.offsetWidth", progressSpan.offsetWidth); 
	const newTime = e.offsetX * progressSpan.offsetWidth / 100;
	progressSpan.setAttribute('title', showTime(newTime + 150));
}

function setTime(time){
	/*console.log("time", time);  
	console.log("currentTime", video.currentTime);  
	console.log("currentTime", time * video.duration); */ 
	progressBar.style.width = `${time * 100}%`;
	video.currentTime = time * video.duration; 
}

function dragSpanTime(e){
	if(canDraw) spanTime(e);
}

function changeVolume(e){
	//console.log(e);
	let volume = e.offsetX / volumeLine.offsetWidth;
	setVolume(volume); 
} 

function changeVolumeScrolling(e){
	e.preventDefault();
    let volume = endVolume + event.deltaY * -0.001;

    // Restrict scale
    volume = Math.min(Math.max(.125, volume), 4); 
	setVolume(volume); 
} 

function changeTimeScrolling(e){
	e.preventDefault(); 
    let newTime = (video.currentTime / video.duration) + 0.025 * (e.wheelDelta > 0 ? 1 : -1); 
	/*console.log(video.duration);  
	console.log(video.currentTime);  
	console.log(video.newTime);  */
	setTime(newTime); 
} 

function setVolume(volume){ 
	if(volume < 0.1) volume = 0;
	if(volume > 0.9) volume = 1;
	volumeBar.style.width = `${volume * 100}%`; 
	video.volume = volume;

	volumeIcon.className = '';
	volumeNotifIcon.className = '';
	if(volume >= 0.7) {
		volumeIcon.classList.add('mtvs-icon-fas', 'fas', 'fa-volume-up');
		volumeNotifIcon.classList.add('icon-fas', 'fas', 'fa-volume-up');
	}
	else if(volume < 0.7 && volume > 0) {
		volumeIcon.classList.add('mtvs-icon-fas', 'fas', 'fa-volume-down');
		volumeNotifIcon.classList.add('mtvs-icon-fas', 'fas', 'fa-volume-down');
	}
	else {
		volumeIcon.classList.add('mtvs-icon-fas', 'fas', 'fa-volume-off');
		volumeNotifIcon.classList.add('mtvs-icon-fas', 'fas', 'fa-volume-off');
	} 
	fade(volumeNotif, 20);
	endVolume = volume;
} 

function dragVolume(e){
	if(canDraw) changeVolume(e);
} 

function toggleMute(){ 
	volumeIcon.className = '';
 
	if(video.volume) {
		endVolume = video.volume;
		video.volume = 0;
		volumeIcon.classList.add('mtvs-icon-fas', 'fas', 'fa-volume-mute');
		volumeIcon.setAttribute('title', 'Unmute');
		volumeBar.style.width = 0; 
		unfade(volumeIcon);
	}
	else  {
		video.volume = endVolume; 
		volumeIcon.classList.add('mtvs-icon-fas', 'fas', 'fa-volume-up');
		volumeIcon.setAttribute('title', 'Mute');
		volumeBar.style.width = `${endVolume * 100}%`; 
		unfade(volumeIcon);
	}
}

function changeSpeed(){ 
 	video.playbackRate = speed.value;
}

function toggleFullscreen(){ 
 	if(!fullscreen) {
 		openFullscreen(player)
 		resizeBtn.style.display = "none";
	}else {
		closeFullscreen();
 		resizeBtn.style.display = "block";
	} 
 	fullscreen = !fullscreen;
}

/* View in fullscreen */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
  video.classList.add('mtvs-video-fullscreen'); 
  fullscreenIcon.classList.remove('fa-expand');
  fullscreenIcon.classList.add('fa-compress'); 
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
  video.classList.remove('mtvs-video-fullscreen'); 
  fullscreenIcon.classList.remove('fa-compress');
  fullscreenIcon.classList.add('fa-expand'); 
}

function fade(element, time = 50) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            op = 0;
        	element.style.opacity = op;
        	element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            //element.style.display = 'none';
        } 
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, time);
}

function unfade(element, time = 10) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, time);
}

function setCanDraw(e) { 
	canDraw = true; 
}

function unsetCanDraw(e) { 
	canDraw = false;  
}