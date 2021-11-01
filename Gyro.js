class Gyro extends CsvReader{

    constructor(_lines, _vid){
        super(_lines)
        this.vid = _vid
        this.currIndex = 0
        this.startTimestamp = parseFloat(this.headers[0])
        this.gyroPos = createVector(parseFloat(this.headers[1]),parseFloat(this.headers[2]))
        this.dotData = [createVector(0,0)]
    }

    update(){
        this.syncTime(this.vid.elt.currentTime)
    }

    currTimeStamp(){
        return (parseFloat(this.currLine[0]) - this.startTimestamp)/1000
    }

    draw(){
        const x = parseFloat(this.currLine[1])
        const y = parseFloat(this.currLine[2])
        const deltaX = x - this.gyroPos.x
        const deltaY = y - this.gyroPos.y
        this.gyroPos.x = x
        this.gyroPos.y = y

        const nextDotPos = createVector(this.dotData[this.dotData.length-1].x + deltaX, this.dotData[this.dotData.length-1].y + deltaY)
        nextDotPos.mult(0.2)
        this.dotData.push(nextDotPos)
        if (this.dotData.length == 6) this.dotData = this.dotData.splice(1)

        translate(100,100)
        noFill()
        stroke(0,255,0)
        beginShape()
        curveVertex(this.dotData[0].x,this.dotData[0].y)
        this.dotData.forEach(d=>{
            curveVertex(d.x,d.y)
        })
        curveVertex(this.dotData[this.dotData.length-1].x,this.dotData[this.dotData.length-1].y)
        endShape()
    }
}
