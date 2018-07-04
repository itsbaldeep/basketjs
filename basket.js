const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
canvas.width = canvas.height = 500
const cx = canvas.width
document.body.appendChild(canvas)
canvas.style.backgroundColor = '#eee'
document.body.style.display = 'flex'
document.body.style.justifyContent = 'center'
document.body.style.width = '500px'
let right = 0
let left = 0
let score = 0
let enemyTimer = 2000

canvas.addEventListener('mousedown', e => e.clientX > canvas.width/2 ? right = 1 : left = 1)
canvas.addEventListener('mouseup', e => e.clientX > canvas.width / 2 ? right = 0 : left = 0)

class Player {
    constructor() {
        this.x = cx/2
        this.y = cx/1.25
        this.r = cx/14
        this.dx = this.r/4
    }
    show() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI)
        ctx.fillStyle = 'coral'
        ctx.fill()
        ctx.closePath
    }
    move() {
        right && this.x < cx - this.r ? this.x += this.dx : 0
        left && this.x - this.dx > this.r ? this.x -= this.dx : 0
    }
}

class Enemy {
    constructor() {
        this.x = Math.random()*cx
        this.y = cx/10
        this.r = cx/30
        this.dy = this.r/7
    }
    show() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2)
        ctx.fillStyle = 'teal'
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

function checkCollision(a) {
    if (a.y > p.y && a.x < p.x + p.r && a.x > p.x - p.r) {
        e.splice(e.indexOf(a),1)
        score++
    }
}

function draw() {
    ctx.clearRect(0, 0, cx, cx)
    p.show()
    p.move()
    e.forEach(e => e.show())
    e.forEach(e => e.move())
    s.show()
    e.forEach(checkCollision)
    requestAnimationFrame(draw)
}
requestAnimationFrame(draw)

function debug() {
    console.log(`left = ${left == 0 ? 'not' : 'yes'}, right = ${right == 0 ? 'not' : 'yes'}`)
    setTimeout(debug, 500)
}
// for checking left or right input
// debug()