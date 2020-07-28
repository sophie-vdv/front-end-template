// Nunjuks Filters
module.exports =  {
  manageEnvironment: function(env) {
   // limit
   env.addFilter('limit', function(arr, limit) {
     return arr.slice(0, limit);
   });
   // other filters here...
 }
};
