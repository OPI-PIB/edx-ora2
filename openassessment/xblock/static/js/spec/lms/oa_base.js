import BaseView from 'lms/oa_base';

/**
Tests for OA student-facing views.
**/

describe("OpenAssessment.BaseView", function() {

    // Stub server that returns dummy data
    var StubServer = function() {

        // Dummy fragments to return from the render func
        this.fragments = {
            submission: readFixtures("oa_response.html"),
            student_training: readFixtures("oa_student_training.html"),
            self_assessment: readFixtures("oa_self_assessment.html"),
            peer_assessment: readFixtures("oa_peer_assessment.html"),
            grade: readFixtures("oa_grade_complete.html")
        };

        // Remember which fragments were requested
        this.fragmentsLoaded = [];

        this.render = function(component) {
            var server = this;
            this.fragmentsLoaded.push(component);
            return $.Deferred(function(defer) {
                defer.resolveWith(this, [server.fragments[component]]);
            }).promise();
        };

        var successPromise = $.Deferred(
            function(defer) {
                defer.resolve();
            }
        ).promise();

        this.peerAssess = function(optionsSelected, feedback) {
            return successPromise;
        };

        this.listTeams = function(username, courseId) {
            return $.Deferred(
                function(defer) { defer.resolveWith(this, [null]); }
            ).promise();
        }
    };

    // Stub runtime
    var runtime = {};

    var server = null;
    var view = null;

    beforeEach(function() {
        // Load the DOM fixture
        loadFixtures('oa_base.html');

        // Create a new stub server
        server = new StubServer();
        server.renderLatex = jasmine.createSpy('renderLatex');
        window.rewriteStaticLinks = jasmine.createSpy('rewriteStaticLinks');

        // Create the object under test
        var el = $(".openassessment").get(0);
        var data = {
            AVAILABLE_EDITORS: {
                'text': {
                    'js': ['/base/js/src/lms/editors/oa_editor_textarea.js']
                }
            }
        }
        view = new BaseView(runtime, el, server, data);
        view.load();
        expect($(".openassessment__steps__step").hasClass('is--loading')).toBeFalsy();
    });

    afterEach(function() {
        delete window.rewriteStaticLinks;
    });

    it("Loads each step", function() {
        expect(server.fragmentsLoaded).toContain("submission");
        expect(server.fragmentsLoaded).toContain("student_training");
        expect(server.fragmentsLoaded).toContain("self_assessment");
        expect(server.fragmentsLoaded).toContain("peer_assessment");
        expect(server.fragmentsLoaded).toContain("staff_assessment");
        expect(server.fragmentsLoaded).toContain("grade");
    });

    it("Only load the peer section once on submit", function() {
        // Simulate a server error
        view.peerView.peerAssess();
        var numPeerLoads = 0;
        for (var i = 0; i < server.fragmentsLoaded.length; i++) {
            if (server.fragmentsLoaded[i] === 'peer_assessment') {
                numPeerLoads++;
            }
        }
        // Peer should be called twice, once when loading the views,
        // and again after the peer has been assessed.
        expect(numPeerLoads).toBe(2);
    });

    it("Steps should have aria-controls and be visible by default", function() {
        $(".ui-slidable__container", view.element).each(function() {
            var step = this;
            var $content = $('.ui-slidable__content', step),
                $button = $('.ui-slidable', step)[0];

            expect($button).toHaveAttr('aria-controls', $content.id);
            expect($content).toHaveAttr('aria-labelledby', $button.id);

            if($(step).hasClass('is--showing')) {
                expect($button).toHaveAttr('aria-expanded', 'true');
                expect(step).toHaveClass('is--showing');
            };
        });
    });
});
