function createPayment(){
    return 1;
}
function attCrypto(){
    return 2;
}

function* setUp(){
    yield createPayment();
    yield attCrypto();
}
