import {sha256, wots_public_key_gen, wots_sign, wots_publickey_from_sig, from_int_to_byte_array, byte_copy} from './index';

Array.prototype.pushArray = function(arr) {
    this.push.apply(this, arr);
};
Array.prototype.toHexString = function() {
    return Array.prototype.map.call(this, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}
String.prototype.hexToByteArray = function() {
    var result = [];
    for (var i = 0; i < this.length; i += 2) {
        result.push(parseInt(this.substr(i, 2), 16));
    }
    return result;
}
String.prototype.isHex = function() {
    return /^[A-F0-9]+$/i.test(this);
}
Array.prototype.toASCII = function () {
    var return_str = "";
    for (var i = 0; i < this.length; i++) {
        return_str += String.fromCharCode(this[i]);
    }
    return return_str;
}
function compute_transaction(source_wots, source_secret, change_wots, destination_wots, sent_amount, remaining_amount, fee) {
    //the lenght in bytes the sign message will have is 6456 bytes
    function generate_zeros(how_much) {
        var zeros = [];
        for(var i = 0; i < how_much; i++) {
            zeros.push(0);
        }
        return zeros;
    }
    var message = [];
    /*
    To understand better this message array look at here:
    https://github.com/mochimodev/mochimo/blob/cef95cdea68d12b840ba8631aae5f1312e724093/src/types.h#L72
    */
    message.pushArray(generate_zeros(2)); //things of network etc
    message.pushArray([57,5]);
    message.pushArray(generate_zeros(4)); //things of network etc
    message.pushArray(byte_copy(from_int_to_byte_array(3), 2))
    message.pushArray(generate_zeros(16)); //the two blocks things
    message.pushArray(generate_zeros(32*3)); //block etc hashes and weight
    message.pushArray(generate_zeros(2)); //len..

    if(source_wots.length != 2208 || change_wots.length != 2208 || destination_wots.length != 2208) {
        console.log("the input parameters are wrong")
        return false;
    }
    message.pushArray(source_wots);
    message.pushArray(destination_wots);
    message.pushArray(change_wots);
    var send_total = byte_copy(from_int_to_byte_array(sent_amount), 8);
    message.pushArray(send_total);
    var change_total = byte_copy(from_int_to_byte_array(remaining_amount), 8);
    message.pushArray(change_total);
    var tx_fee = byte_copy(from_int_to_byte_array(fee), 8);
    message.pushArray(tx_fee);
    var message_to_sign = message.slice(10+16+32*3+2, 10+16+32*3+2 + 2208*3 + 3*8);
    var hash_message = sha256(message_to_sign.toASCII());
    var pub_seed = source_wots.slice(2144, 2144+32);
    var pub_addr = source_wots.slice(2144 + 32, 2144+64);
    var signature = wots_sign(hash_message, source_secret, pub_seed, pub_addr);
    message.pushArray(signature);
    message.pushArray(generate_zeros(2));
    message.pushArray([205,171]);
    return message;
}


/*
wots_seed is in ASCII format so sha256 can understand it.
the tag is in hex.
*/
function generate_full_WOTS(wots_seed, tag) {
    var private_seed = sha256(wots_seed + "seed");
    var public_seed = sha256(wots_seed + "publ");
    var addr_seed = sha256(wots_seed + "addr");
    var public_key = wots_public_key_gen(private_seed, public_seed, addr_seed);
    var full_WOTS = [...public_key]; //clonin the array. I know I know, it's just to make "clean" code
    full_WOTS.pushArray(public_seed);
    full_WOTS.pushArray(addr_seed.slice(0, 20));
    if(tag == undefined || tag.length != 24 || !tag.isHex()) {
        //default tag, cause it is always equal is a waste of resources making a return with it
        full_WOTS.pushArray([66,0,0,0,14,0,0,0,1,0,0,0]);
    } else {
        full_WOTS.pushArray(tag.hexToByteArray());
    }
    return [full_WOTS, private_seed, public_seed, addr_seed];
}


var full_wots1 = generate_full_WOTS("somefancyorigin", "");
var full_wots2 = generate_full_WOTS("changewots", "");
var full_wots3 = generate_full_WOTS("magicdestination", "");

var source_wots = full_wots1[0];
var source_secret = full_wots1[1];
var change_wots = full_wots2[0];
var destination_wots = full_wots3[0]; //this should be replaced with the destination wots
var send_amount = 1000;
var     source_balance = 2000; //put here the balance in nMCM of source_wots
var TX_fee = 500; //latest tx fee
var remaining_amount = source_balance - (send_amount+TX_fee);

var transaction_array = compute_transaction(source_wots, source_secret, change_wots, destination_wots, send_amount, remaining_amount, TX_fee);

function _arrayBufferToBase64( buffer ) {
    function b2a(a) {
        var c, d, e, f, g, h, i, j, o, b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", k = 0, l = 0, m = "", n = [];
        if (!a) return a;
        // eslint-disable-next-line no-unused-expressions
        do c = a.charCodeAt(k++), d = a.charCodeAt(k++), e = a.charCodeAt(k++), j = c << 16 | d << 8 | e,
            f = 63 & j >> 18, g = 63 & j >> 12, h = 63 & j >> 6, i = 63 & j, n[l++] = b.charAt(f) + b.charAt(g) + b.charAt(h) + b.charAt(i); while (k < a.length);
        return m = n.join(""), o = a.length % 3, (o ? m.slice(0, o - 3) :m) + "===".slice(o || 3);
    }
    var binary = ''; var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return b2a( binary );
}

export {generate_full_WOTS}
