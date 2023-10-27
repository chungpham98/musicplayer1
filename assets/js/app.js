const $ = document.querySelector.bind(document) 
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = '99_PLAYER'

const heading = $('.play-title h1')
const singer = $('.play-singer p')
const diskThumb = $('.play-disk img')
const audio = $('#audio')
const disk = $('.play-disk')
const play = $('.btn-play')
const progress = $('.play-progress')
const backwardBtn = $('.btn-backward')
const forwardBtn = $('.btn-forward')
const shuffleBtn = $('.btn-shuffle')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const audioTimeLeft = $('.time-left')
const audioTimeDuration = $('.time-start')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isShuffle: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs:  [
        {
            name: 'Em Của Ngày Hôm Qua',
            singer: 'Sơn Tùng M-TP',
            path: './assets/music/Em Cua Ngay Hom Qua - Son Tung M-TP - NhacHayVN.mp3',
            img: './assets/img/Em-Cua-Ngay-Hom-Qua-Son-Tung-M-TP.jpg',
        },
        {
            name: 'Không Phải Gu',
            singer: 'HIEUTHUHAI',
            path: './assets/music/KhongPhaiGu-HIEUTHUHAI-11966359.mp3',
            img: './assets/img/1697425246797.jpg',
        },
        {
            name: 'Cắt Đôi Nỗi Sầu',
            singer: 'Tăng Duy Tân, Drum7',
            path: './assets/music/Cat Doi Noi Sau - Tang Duy Tan, Drum7 - NhacHayVN.mp3',
            img: './assets/img/Cat-Doi-Noi-Sau-Tang-Duy-Tan-Drum7.jpg',
        },
        {
            name: 'Anh Luôn Như Vậy',
            singer: 'B Ray',
            path: './assets/music/AnhLuonNhuVay-BRay-11853369.mp3',
            img: './assets/img/1696403382253.jpg',
        },
        {
            name: 'Bên Trên Tầng Lầu',
            singer: 'Tăng Duy Tân',
            path: './assets/music/Ben Tren Tang Lau - Tang Duy Tan - NhacHayVN.mp3',
            img: './assets/img/Ben-Tren-Tang-Lau-Tang-Duy-Tan.jpg',
        },
        {
            name: 'Gấp Đôi Yêu Thương',
            singer: 'Tuấn Hưng',
            path: './assets/music/Gap Doi Yeu Thuong - Tuan Hung - NhacHayVN.mp3',
            img: './assets/img/Gap-Doi-Yeu-Thuong-Tuan-Hung.jpg',
        },
        {
            name: 'Hoa Cỏ Lau',
            singer: 'Phong Max',
            path: './assets/music/Hoa Co Lau - Phong Max - NhacHayVN.mp3',
            img: './assets/img/Hoa-Co-Lau-Phong-Max.jpg',
        },
        {
            name: 'Sao Trời Làm Gió',
            singer: 'Nal, CT',
            path: './assets/music/Sao Troi Lam Gio - Nal, CT - NhacHayVN.mp3',
            img: './assets/img/Sao-Troi-Lam-Gio-Nal-CT.jpg',
        },
        {
            name: 'Tất Cả Hoặc Không Là Gì Cả',
            singer: 'Cao Thái Sơn, Đông Thiên Đức',
            path: './assets/music/Tat Ca Hoac Khong La Gi Ca - Cao Thai Son, Dong Thien Duc - NhacHayVN.mp3',
            img: './assets/img/Tat-Ca-Hoac-Khong-La-Gi-Ca-Cao-Thai-Son-Dong-Thien-Duc.jpg',
        },
        {
            name: 'Thương Em',
            singer: 'Dương Edward',
            path: './assets/music/Thuong Em - Duong Edward - NhacHayVN.mp3',
            img: './assets/img/Thuong-Em-Duong-Edward.jpg',
        },
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
                    <div class="thumb">
                        <img src="${song.img}" alt="">
                    </div>
                    <div class="song-info">
                        <h1 class="song-title">${song.name}</h1>
                        <p class="song-singer">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        const _this = this
        const diskWidth = disk.offsetWidth

        // Xử lý disk quay / dừng
        const diskThumbAnimate = diskThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10 giây disk quay 1 vòng
            iterations: Infinity
        })
        diskThumbAnimate.pause()

        // Xử lý phóng to thu nhỏ disk
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newDiskWidth = diskWidth - scrollTop
            
            disk.style.width = newDiskWidth > 0 ? newDiskWidth + 'px' : 0
            disk.style.opacity = newDiskWidth / diskWidth
        }

        // Xử lý click vào nút play
        play.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            play.classList.add('active')
            diskThumbAnimate.play()
        }

        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            play.classList.remove('active')
            diskThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
                audioTimeDuration.innerHTML = _this.formatTime(audio.currentTime)
                progress.setAttribute('title','Load '+progressPercent+'%')
            }
        }

        // Xử lý khi tua song
        progress.onchange = function() {
            const seekTime = progress.value / 100 * audio.duration
            audio.currentTime = seekTime
        }

        // Xử lý click vào nút forward
        forwardBtn.onclick = function() {
            if (_this.isShuffle) {
                _this.shuffleSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lý click vào nút backward
        backwardBtn.onclick = function() {
            if (_this.isShuffle) {
                _this.shuffleSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi bật / tắt shuffle
        shuffleBtn.onclick = function() {
            _this.isShuffle = !_this.isShuffle
            _this.setConfig('isShuffle', _this.isShuffle)
            shuffleBtn.classList.toggle('active', _this.isShuffle)
        }

        // Khi bật / tắt repeat
        repeatBtn.onclick = function() {
            _this.isRepeat =!_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
            forwardBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.progressSong = 0
                    _this.loadCurrentSong()
                    $('.song.active').classList.remove('active')
                    songNode.classList.add('active')
                    if (_this.isPlaying)
                        audio.play()
                }
            }
        }
    },
    scrollToActiveSong() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'end',
            })
        }, 200)
    },
    loadCurrentSong: function() {
        heading.innerHTML = this.currentSong.name
        singer.innerHTML = this.currentSong.singer
        diskThumb.setAttribute('src', this.currentSong.img)
        audio.setAttribute('src', this.currentSong.path)
        audio.onloadedmetadata = () => {
            audioTimeLeft.innerHTML = this.formatTime(audio.duration)
        }
    },
    formatTime: function (seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        return formattedTime;
    },
    loadConfig: function() {
        this.isShuffle = this.config.isShuffle
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    shuffleSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // Tải config khi chạy ứng dụng
        this.loadConfig()

        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // Lắng nghe / Xử lý các sự kiện (DOM Events)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vao UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // Hiện thị trạng thái ban đầu của Repeat & Shuffle đã lưu
        shuffleBtn.classList.toggle('active', this.isShuffle)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()