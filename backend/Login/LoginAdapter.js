/**
 * Created by liron on 9/8/15.
 */

'use strict'
var _  = require('lodash');

class Guitar {

    constructor(type, model) {
        this._type = type;
        this._model = model;
    }

    getType() {
        return this._type;
    }

    getModel() {
        return this._model;
    }

    toString(){
        return this._type + ' ' +this._model;
    }

}

class Fender extends Guitar {

    constructor(type, model) {
        super(type, model);
    }
}

class Gibson extends Guitar {

    constructor(type, model) {
        super(type, model);
    }
}

var tele = new Fender('e-guitar' , 'telecaster');
var sg = new Gibson('e-guitar', 'SG');

var myGuitars = [];
myGuitars.push(tele);
myGuitars.push(sg);
_.each(myGuitars, function(guitar){
    console.log(guitar.toString());
});
