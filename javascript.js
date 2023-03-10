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

const MUSIC_PLAYER_KEY = "MUSIC_KEY"

const playlist = $(".playlist");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(MUSIC_PLAYER_KEY)) || {},
  setConfig: function (key,value) {
    this.config[key] = value;
    localStorage.setItem(MUSIC_PLAYER_KEY, JSON.stringify(this.config))
  },
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
    {
      name: "Dạ Khúc",
      singer: "Châu Kiệt Luân",
      path: "./assets/music/song8.mp3",
      image: "./assets/image/song8.jpg",
    }
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
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
    playlist.innerHTML = htmls.join("");
  },

  getCurrentSong: function () {
    return this.songs[this.currentIndex];
  },

  handleEvents: function () {
    const _this = this;

    // Xử lý CD quay
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
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
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua
    progress.oninput = function (e) {
      const seekTime = (audio.duration * e.target.value) / 100;
      audio.currentTime = seekTime;
    };

    // Next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render()
      _this.scrollActiveSongtoTop()
    };

    // Prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render()
      _this.scrollActiveSongtoTop()
    };

    // Random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
      _this.setConfig('isRandom', _this.isRandom);
    };

    // Xử lý phát lại 1 bài khi repeat
    repeatBtn.onclick = function() {
      _this.isRepeat =!_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
      _this.setConfig('isRepeat', _this.isRepeat);
    },

    // Xử lý next song khi end
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play()
      } else {
        nextBtn.click();
      }
    };

    // xử lý active khi click vào 1 bài hát
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)')
      if (songNode || e.target.closest('.option')) {
        // Khi click  vào 1 bài hát
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index)
          _this.loadCurrentSong()
          _this.render()
          audio.play()
        }

        // Khi click vào nút option
      }
    }
  },

  scrollActiveSongtoTop: function () {
    $('.song.active').scrollIntoView({
      behavior:'smooth',
      block: 'nearest',
    })
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  loadCurrentSong: function () {
    const currentSong = this.getCurrentSong();
    heading.textContent = currentSong.name;
    cdThumb.style.backgroundImage = `url('${currentSong.image}')`;
    audio.src = currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    this.loadConfig();
    // Lắng nghe xử lý các sự kiện
    this.handleEvents();
    // Tải thông tin bài hát đầu tiên
    this.loadCurrentSong();
    // Render playlist
    this.render();

    // Hiển thị trạng thái ban đầu của nút Repeat và random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
