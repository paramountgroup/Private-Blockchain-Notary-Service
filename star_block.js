// JavaScript source code star_block.js


/******************************************************************
*  Class with a constructor for star 			   
*******************************************************************/

class StarBlock {
    constructor(Address, RA, DEC, MAG, CEN, starStory) {
        this.address = Address;
        this.star = {
            ra: RA,
            dec: DEC,
            mag: MAG,
            cen: CEN,
            story: starStory
        }
    };
}

module.exports.StarBlock = StarBlock;
