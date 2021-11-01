class CsvReader{
    constructor(_lines){
        this.lines = _lines
        this.headers = this.parseLine(this.lines[0])
        this.currIndex = 1
        this.updateCurrLine()
        this.secondsIndex = this.headers.indexOf('seconds')
    }

    parseLine(line){
        return line.split(',')
    }
    updateCurrLine(){
        this.currLine = this.parseLine(this.lines[this.currIndex])
    }

    currTimeStamp(){
        return parseFloat(this.currLine[this.secondsIndex])
    }

    syncTime(t){
        if (this.currTimeStamp() > t+1)  {
            this.currIndex=1
            this.updateCurrLine()
        }
        let tries = 0
        while (this.currTimeStamp() < t && tries < 100){
            this.currIndex = (this.currIndex+1)%(this.lines.length-1)
            if (this.currIndex==0) this.currIndex=1
            this.updateCurrLine()
            tries++
        }
    }

    update(){ }
    draw(){ }
    mousePressed(){ }
    mouseReleased(){ }
    mouseClicked(){ }
}