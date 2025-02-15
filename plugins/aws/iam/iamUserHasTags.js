
var helpers = require('../../../helpers/aws');
      
module.exports = {
    title: 'IAM User Has Tags',
    category: 'IAM',
    domain: 'Identity and Access management',
    description:  'Ensure that AWS IAM Users have tags associated.',
    more_info: 'Tags help you to group resources together that are related to or associated with each other. It is a best practice to tag cloud resources to better organize and gain visibility into their usage.',
    link: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_tags_users.html',
    recommended_action: 'Modify IAM User and add tags',
    apis: ['IAM:listUsers'],
          
    run: function(cache, settings, callback) {
        var results = [];
        var source = {};
        var region = helpers.defaultRegion(settings);

        var listUsers = helpers.addSource(cache, source,
            ['iam', 'listUsers', region]);

        if (!listUsers) return callback(null, results, source);
    
        if (listUsers.err || !listUsers.data) {
            helpers.addResult(results, 3,
                'Unable to query for iam users: ' + helpers.addError(listUsers));
            return callback(null, results, source);
        }
    
        if (!listUsers.data.length) {
            helpers.addResult(results, 0, 'No iam users found', 'global');
        } 

        for (var user of listUsers.data) {
            if (!user.Tags || !user.Tags.length){
                helpers.addResult(results, 2, 'IAM User does not have Tags', 'global', user.Arn);
            } else {
                helpers.addResult(results, 0, 'IAM User has tags', 'global', user.Arn);
            }
        }
        return callback(null, results, source);
    }  
};
   

         