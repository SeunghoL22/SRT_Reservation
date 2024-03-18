function Check(linkText) {


    if (linkText === "예약하기") {
        return true;
    
    } else if (linkText === "입석+좌석") {
        console.log("입석+좌석이에요")
        return false;
    } else if (linkText === "신청하기") { //이건 예약대기 잡는 것 전용임
        return true;
    }
    else if (linkText === "매진") {
        console.log("매진이에요")
        return false;
    }
}

module.exports = {
    Check : Check
};