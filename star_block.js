// JavaScript source code star_block.js


/******************************************************************
*  Class StarBlock with a constructor for star data 			   
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
