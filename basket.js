const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
const cw = window.screen.width
const ch = window.screen.height
const cx = cw > ch ? 500 : cw
canvas.width = canvas.height = cx
document.body.appendChild(canvas)
canvas.style.backgroundColor = '#eee'
let right = 0
let left = 0
let score = 0
let enemyTimer = 2000

canvas.addEventListener('mousedown', e => e.clientX > cx/2 ? right = 1 : left = 1)
canvas.addEventListener('mouseup', e => e.clientX > cx/2 ? right = 0 : left = 0)
canvas.addEventListener('touchstart', e => e.touches[0].clientX > cx/2 ? right = 1 : left = 1)
canvas.addEventListener('touchstart', e => e.preventDefault())
canvas.addEventListener('touchend', e => left = right = 0)

document.addEventListener('keydown', e => e.keyCode == '37' ? left = 1 : 0)
document.addEventListener('keydown', e => e.keyCode == '39' ? right = 1 : 0)
document.addEventListener('keyup', e => e.keyCode == '37' ? left = 0 : 0)
document.addEventListener('keyup', e => e.keyCode == '39' ? right = 0 : 0)

class Player {
    constructor() {
        this.x = cx/2
        this.y = cx/1.1
        this.r = cx/12
        this.dx = this.r/4.5
    }
    show() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI)
        ctx.fillStyle = 'mediumaquamarine'
        ctx.fill()
        ctx.closePath
    }
    move() {
        right && this.x + this.dx + this.r < cx ? this.x += this.dx : 0
        left && this.x - this.dx - this.r > 0 ? this.x -= this.dx : 0
    }
}

class Enemy {
    constructor() {
        this.x = Math.random()*(cx - cx/3) + cx/5
        this.y = cx/20
        this.r = cx/30
        this.dy = this.r/7
    }
    show() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2)
        ctx.fillStyle = 'tomato'
        ctx.fill()
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
        ctx.fillText(score, this.x, this.y)
        ctx.font = `${cx/17}px Tahoma`
        ctx.fill()
        ctx.closePath
    }
}

p = new Player
e = []

function addEnemy() {
    e.push(new Enemy)
    setTimeout(addEnemy, enemyTimer)
}
addEnemy()

function speedUp() {
    enemyTimer /= 1.009
    setTimeout(speedUp, 1000)
}
speedUp()

s = new Score

function draw() {
    ctx.clearRect(0, 0, cx, cx)
    p.show()
    p.move()
    e.forEach(e => e.show())
    e.forEach(e => e.move())
    s.show()
    e.forEach(a => a.y > p.y && a.x < p.x + p.r && a.x > p.x - p.r ? e.splice(e.indexOf(a),1) && score++ : 0)
    e.forEach(a => a.y - a.dy > cx ? location.reload() : 0)
    requestAnimationFrame(draw)
}
requestAnimationFrame(draw)

function debug() {
    console.log(`left = ${left == 0 ? 'not' : 'yes'}, right = ${right == 0 ? 'not' : 'yes'}`)
    setTimeout(debug, 500)
}
// for checking left or right input
// debug()
