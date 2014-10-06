/**
 * @class SearchCache.js
 * @description
 *	Cache structure for searches.
 *
 *	Each result set is cached under a hash key of the parameters used in the
 *	search.
 *	Results are stored in the "cachedResults" structure.
 *	A separate structure is used to keep track of the oldest keys, so they can
 *	easily be expired if the cache gets too big.
 *
 *	NOTE: the maxSize measure in not an actual measure of the memory used, rather
 *	the size of cache once converted to string.
 */

deCarta.App.SearchCache = {

    maxSize: 100000,
    cachedResults: {},
    keyAge: [],

    /**
     * Checks the cache for results based on the given parameters
     * @return: results or undefined
     */
    get: function(searchParams){
        //var key = $.md5(JSON.stringify(searchParams));
        var key = JSON.stringify(searchParams);
        return this.cachedResults[key];
    },

    /**
     * Stores the result set for the specified sear4ch parameters
     */
    set: function(searchParams, results){

        //var key = $.md5(JSON.stringify(searchParams));
        var key = JSON.stringify(searchParams);
        this.keyAge.push(key);

        this.cachedResults[key] = results;
        this.sizeCheck();
    },

    /**
     * Checks the size of the cache, and expires the oldest objects if it's
     * over the limit
     */
    sizeCheck: function(){
        while (JSON.stringify(this.cachedResults).length  > this.maxSize){
            this.expireOldest();
        }
    },

    /**
     * Finds the oldes key in the store, and deletes it
     */
    expireOldest: function(){
        var key = this.keyAge.shift();
        delete this.cachedResults[key];
    }
}
