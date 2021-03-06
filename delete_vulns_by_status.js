var deleteVulnerabilitiesByStatus = function (status) {
    // Deletes all vulnerabilities of a given status
    // Based on deleteHostsByStatus Script Created by Dan Kottmann
    //
    // Usage: deleteVulnerabilitiesByStatus('lair-grey')
    // Created by: Isaiah Sarju
    // Requires client-side updates: true

    var PROJECT_ID = Session.get('projectId');
    var vulnerabilities = Vulnerabilities.find({
        'project_id': PROJECT_ID,
        'status': status
    }).fetch();
    if (vulnerabilities.length < 1) {
        console.log('No matching vulnerabilities found');
        return;
    }
    vulnerabilities.forEach(function (vulnerability) {
        console.log('Removing ' + vulnerability.title);
        Meteor.call('removeVulnerability', PROJECT_ID, vulnerability._id);
    });
    console.log('Total of ' + vulnerabilities.length + ' vulnerability(s) removed.');
};