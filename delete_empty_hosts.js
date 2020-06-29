var deleteEmptyHosts = function () {
    // Deletes hosts with:
    // 1. No open ports (except 0/tcp, 0/udp), AND
    // 2. No vulnerabilities
    //
    // Usage: deleteEmptyHosts()
    // Created by: @uth_cr33p (Jeff Stiles)
    // Requires client-side updates: ??

    var PROJECT_ID = Session.get('projectId');
    var delHosts = [];

    var hosts = Hosts.find({
        'project_id': PROJECT_ID,
    }).fetch();
    if (hosts.length < 1) {
        console.log('No matching hosts found');
        return;
    }
    hosts.forEach(function (host) {
        var ports = Ports.find({
            'project_id': PROJECT_ID,
            'host_id': host._id,
        }).fetch();
        for (i = 0; i < ports.length; i++) {
            var port = ports[i];
            if (port.port != 0 || (port.protocol != 'tcp' && port.protocol != 'udp')) {
                // host has a non-zero port, skip by returning
                console.log(host.string_addr, 'has port', port.port, port.protocol)
                return
            }
        }

        var vulns = Vulnerabilities.find({
            'project_id': PROJECT_ID,
            'hosts': {
                $elemMatch: {
                    string_addr: host.string_addr,
                }
            }
        }).fetch();
        for (i = 0; i < vulns.length; i++) {
            var vuln = vulns[i];
            if (vuln.cvss > 0 || vuln.confirmed) {
                // host has a vulnerability, skip by returning
                console.log(host.string_addr, 'has', vulns.length, 'vulns')
                return
            }
        }

        // host qualified, add it the array for deletion
        delHosts.push(host)
    })

    delHosts.forEach(function (host) {
        console.log('Removing ' + host.string_addr);
        Meteor.call('removeHost', PROJECT_ID, host._id, function (err) {
            if (!err) {
                Meteor.call('removeHostFromVulnerabilities', PROJECT_ID, host.string_addr);
            }
        });
    })

    console.log('Total of ' + delHosts.length + ' host(s) removed.');
};