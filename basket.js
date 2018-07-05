const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
const cw = window.screen.width
const ch = window.screen.height
const cx = cw > ch ? 500 : cw

canvas.width = canvas.height = cx
document.body.appendChild(canvas)
canvas.style.backgroundColor = '#eee'
document.body.style.margin = '0'

let right = 0
let left = 0
let score = 0
let highScore = 0
let enemyTimer = 2000
let state = 'menu'

const touch = e => {
    e.touches[0].clientX > playButton.x && 
    e.touches[0].clientX < playButton.x + playButton.w &&
    e.touches[0].clientY > playButton.y &&
    e.touches[0].clientY < playButton.y + playButton.h 
    ? state = 'game' : 0
}

const click = e => {
    e.clientX > playButton.x && 
    e.clientX < playButton.x + playButton.w &&
    e.clientY > playButton.y &&
    e.clientY < playButton.y + playButton.h 
    ? state = 'game' : 0
}

canvas.addEventListener('click', click)
canvas.addEventListener('touchstart', touch)
canvas.addEventListener('touchend', e => e.preventDefault())

canvas.addEventListener('mousedown', e => e.clientX > cx/2 ? right = 1 : left = 1)
canvas.addEventListener('mouseup', e => e.clientX > cx/2 ? right = 0 : left = 0)
canvas.addEventListener('touchstart', e => e.touches[0].clientX > cx/2 ? right = 1 : left = 1)
canvas.addEventListener('touchstart', e => e.preventDefault())
canvas.addEventListener('touchend', e => left = right = 0)

document.addEventListener('keydown', e => e.keyCode == '37' ? left = 1 : 0)
document.addEventListener('keydown', e => e.keyCode == '39' ? right = 1 : 0)
document.addEventListener('keyup', e => e.keyCode == '37' ? left = 0 : 0)
document.addEventListener('keyup', e => e.keyCode == '39' ? right = 0 : 0)

let fruits = new Array(14)
for (let i = 0; i < 14; i++) {
    fruits[i] = new Image()
    fruits[i].src = `./assets/sprites/fruit-${i+1}.png`
}

let basket = new Image()
basket.src = './assets/sprites/basket.png'

class MenuItem {
    constructor(x, y, w, h, c, r) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.c = c
        this.r = r
    }
    show() {
        ctx.beginPath()
        ctx.fillStyle = this.c
        ctx.moveTo(this.x+this.r, this.y)
        ctx.arcTo(this.x+this.w, this.y, this.x+this.w, this.y+this.h, this.r)
        ctx.arcTo(this.x+this.w, this.y+this.h, this.x, this.y+this.h, this.r)
        ctx.arcTo(this.x, this.y+this.h, this.x, this.y, this.r)
        ctx.arcTo(this.x, this.y, this.x+this.w, this.y, this.r)
        ctx.fill()
        ctx.closePath()
    }
}

class MenuText {
    constructor(t, x, y, f, c) {
        this.t = t
        this.x = x
        this.y = y
        this.f = f
        this.c = c
    }
    show() {
        ctx.beginPath()
        ctx.font = `${this.f}px Tahoma`
        ctx.fillStyle = this.c
        ctx.fillText(this.t, this.x, this.y)
        ctx.fill()
        ctx.closePath()
    }
}

class Player {
    constructor() {
        this.x = cx/2
        this.y = cx/1.2
        this.r = cx/6
        this.dx = this.r/4.5
    }
    show() {
        ctx.beginPath()
        ctx.drawImage(basket, this.x, this.y, this.r, this.r)
        ctx.closePath
    }
    move() {
        right && this.x + this.dx + this.r < cx ? this.x += this.dx : 0
        left && this.x - this.dx > 0 ? this.x -= this.dx : 0
    }
}

class Enemy {
    constructor() {
        this.x = Math.random()*(cx - cx/3) + cx/5
        this.y = cx/20
        this.r = cx/9
        this.dy = this.r/16
        this.i = Math.floor(Math.random()*14)
    }
    show() {
        ctx.beginPath()
        ctx.drawImage(fruits[this.i], this.x, this.y, this.r, this.r)
        ctx.closePath
    }
    move() {
        this.y += this.dy
    }
}

class Score {
    constructor() {
        this.x = cx/20
        this.y = cx/20 + cx/34
    }
    show() {
        ctx.beginPath()
        ctx.fillStyle = 'violet'
        ctx.fillText(`Score: ${score} | High Score: ${highScore}`, this.x, this.y)
        ctx.font = `${cx/20}px Tahoma`
        ctx.fill()
        ctx.closePath
    }
}

const titleBox = new MenuItem(cx/2-cx/2.8, cx/2-cx/3, cx/1.4, cx/3, 'red', cx/12)
const playButton = new MenuItem(cx/2-cx/3.6, cx/1.6, cx/1.8, cx/4, 'violet', cx/12)

const title = new MenuText('Basket.js', titleBox.x+cx/10, titleBox.y+cx/5, cx/8, 'aliceblue')
const play = new MenuText('PLAY', playButton.x+cx/6.2, playButton.y+cx/6.2, cx/10, 'aliceblue')

const p = new Player
let e = []

const addEnemy = () => {
    state == 'game' ? e.push(new Enemy) : 0
    setTimeout(addEnemy, enemyTimer)
}

addEnemy()

const speedUp = () => {
    enemyTimer /= 1.009
    setTimeout(speedUp, 1000)
}
speedUp()

let s = new Score

const gameOver = () => {
    e.forEach(a => {
        if (a.y > cx) {
            if (score > highScore) {
                highScore = score
            }
            score = 0
            enemyTimer = 2000
            p.x = cx/2
            e.splice(0, e.length)
            state = 'game'
        }
    })
}

const scoreHandler = () => {
    e.forEach(a => {
        if (a.y + a.dy*15 > p.y && a.x < p.x + p.r && a.x > p.x - p.r) {
            e.splice(e.indexOf(a),1) 
            score++
            if (score > highScore) {
                highScore++
            }
        }
    })
}

const draw = () => {
    ctx.clearRect(0, 0, cx, cx)
    if (state == 'menu'){
        titleBox.show()
        playButton.show()
        title.show()
        play.show()
    }
    else if (state == 'game'){
        p.show()
        p.move()
        e.forEach(e => e.show())
        e.forEach(e => e.move())
        s.show()
        scoreHandler()
        gameOver()
    }
    requestAnimationFrame(draw)    
}
requestAnimationFrame(draw)
