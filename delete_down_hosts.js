var deleteDownHosts = function () {
    // Deletes hosts that are "down". This means there are no
    // open ports, not even icmp response.
    //
    // Usage: deleteDownHosts()
    // Created by: @uth_cr33p (Jeff Stiles)
    // Requires client-side updates: ??

    var PROJECT_ID = Session.get('projectId');
    var portarray = [];
    var delarray = [];

    var hosts = Hosts.find({
        'project_id': PROJECT_ID
    }).fetch();

    hosts.forEach(function (host) {
        var hostid = host._id;
        var ports = Ports.find({
            'project_id': PROJECT_ID,
            'host_id': host._id
        }).fetch();
        if (ports.length == 0) {
            console.log('Removing HostID: ' + hostid);
            Meteor.call('removeHost', PROJECT_ID, hostid, function (err) {
                if (!err) {
                    Meteor.call('removeHostFromVulnerabilities', PROJECT_ID, hostid);
                }
            });
        }
    });
};