var deleteHostnamesByRegex = function (hostnameRegex, update) {
    // Deletes hostnames matching the supplied regex
    //
    // Usage: deleteHostnamesByRegex(/.*compute\.internal$/)
    // Created by: @uth_cr33p (Jeff Stiles)
    // Requires client-side updates: ??

    var PROJECT_ID = Session.get('projectId');

    var hosts = Hosts.find({
        'project_id': PROJECT_ID
    }).fetch();

    hosts.forEach(function (host) {
        host.hostnames.forEach(function (hostname) {
            if (hostnameRegex.test(hostname)) {
                if (update) {
                    console.log('Removing ' + hostname);
                    Meteor.call('removeHostname', PROJECT_ID, host._id, hostname);
                } else {
                    console.log('Faking: ' + hostname)
                }
            }
        })
    });
};