let buff = Buffer.from('aws-=-123-=-xsdef');

Buffer.prototype.split = Buffer.prototype.split || function(mark) {
    let curIndex = 0, // 当前Buffer下标
        markIndex = 0; // 查找字符的下标
    let arr = [];

    while ((markIndex = this.indexOf(mark, curIndex)) != -1) {
        arr.push(this.slice(curIndex, markIndex))
        curIndex = markIndex + mark.length
    }
    arr.push(this.slice(curIndex))
    return arr;
}