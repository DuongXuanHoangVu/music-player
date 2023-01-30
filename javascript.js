// 1. Render songs
// 2. Scroll Top
// 3. Play/Pause/Seek
// 4. CD Rotate
// 5. Next/Prev
// 6. Random
// 7. Next/ Repeat when end
// 8. Active song
// 9. Scroll active song into view
// 10. Play song when click

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");

const app = {
  currentIndex: 0,
  isPlaying: false,
  songs: [
    {
      name: "Lửng lơ",
      singer: "Masew, B Ray, REDT, V.A",
      path: "./assets/music/song1.mp3",
      image: "./assets/image/song1.jpg",
    },
    {
      name: "Đừng Chờ Anh Nữa",
      singer: "Tăng Phúc",
      path: "./assets/music/song2.mp3",
      image: "./assets/image/song2.jpg",
    },
    {
      name: "Thanh xuân",
      singer: "Dalab",
      path: "./assets/music/song3.mp3",
      image: "./assets/image/song3.jpg",
    },
    {
      name: "Buồn thì cứ khóc đi",
      singer: "Lynk Lee",
      path: "./assets/music/song4.mp3",
      image: "./assets/image/song4.jpg",
    },
    {
      name: "Bên Trên Tầng Lầu",
      singer: "Tăng Duy Tân",
      path: "./assets/music/song5.mp3",
      image: "./assets/image/song5.jpg",
    },
    {
      name: "Vì Mẹ Anh Bắt Chia Tay",
      singer: "Miu Lê, Karik, Châu Đăng Khoa",
      path: "./assets/music/song6.mp3",
      image: "./assets/image/song6.jpg",
    },
    {
      name: "Thức Giấc",
      singer: "Dalab",
      path: "./assets/music/song7.mp3",
      image: "./assets/image/song7.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song) => {
      return `
            <div class="song">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },

  getCurrentSong: function () {
    return this.songs[this.currentIndex];
  },

  handleEvents: function () {
    const _this = this;

    // Xử lý CD quay
    const cdThumbAnimate = cdThumb.animate([
      { transform: "rotate(360deg)" }
    ], 
    {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause(); 

    // Xử lý phóng to thu nhỏ CD
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    // Khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      const progressPercent = Math.floor(
        (audio.currentTime / audio.duration) * 100
      );
      progress.value = progressPercent;
    };

    // Xử lý khi tua
    progress.oninput = function (e) {
      const seekTime = (audio.duration * e.target.value) / 100;
      audio.currentTime = seekTime;
    };
  },

  loadCurrentSong: function () {
    heading.textContent = this.getCurrentSong().name;
    cdThumb.style.backgroundImage = `url('${this.getCurrentSong().image}')`;
    audio.src = this.getCurrentSong().path;
  },

  start: function () {
    // Lắng nghe xử lý các sự kiện
    this.handleEvents();
    // Tải thông tin bài hát đầu tiên
    this.loadCurrentSong();
    // Render playlist
    this.render();
  },
};

app.start();
