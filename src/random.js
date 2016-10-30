module.exports.randomStr = () => {
    var tempStr = Math.random().toString(36).slice(-7);
    if(tempStr.length !== 7) {
        randomStr();
    }
    return tempStr;
}
