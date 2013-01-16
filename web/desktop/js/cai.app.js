var cai = cai || {};  

cai.Application = function(hub) {
    var self = this;
    
    self.rolesViewModel = null;
    
    self.init = function() {
    	self.rolesViewModel = new cai.RolesViewModel(hub);
        self.rolesViewModel.init();
        
        ko.applyBindings(self.rolesViewModel);
    };
    
    self.connectViews = function() {
        hub.registerRoleViewModel(self.rolesViewModel);
    }
    
    self.refreshViews = function() {
    	self.rolesViewModel.refresh();
    }
};

var app = null;

$(document).ready(function(){
    var server = '192.168.50.12';
    var port = 4242;
    
	cai.log("Initializing the Hub");
    var hub = new cai.HubClient(server, port);
    hub.init(function() {
    	cai.log("Initializing the Application");
        app = new cai.Application(hub);
        app.init();
    
    	cai.log("Refreshing views");
        app.connectViews();
        app.refreshViews();
	});        
});


