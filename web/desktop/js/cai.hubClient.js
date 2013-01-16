var cai = cai || {};  

cai.HubClient = function(serverhost, serverport) {
	var self = this;
    
	var socket = io.connect('//' + serverhost, { port: serverport });
    socket.on('setRoles', function(roles) {
    	if (self.roleViewModel) {
        	self.roleViewModel.setRoles(roles);
	    }
    });
    socket.on('roleAdded', function(role) {
    	if (self.roleViewModel) {
    		self.roleViewModel.roleAdded(role);
	    }
    });
    socket.on('roleUpdated', function(role) {
    	if (self.roleViewModel) {
	    	self.roleViewModel.roleUpdated(role);
	    }
    });
    socket.on('roleDeleted', function(id) {
    	if (self.roleViewModel) {
	    	self.roleViewModel.roleDeleted(id);
	    }
    });
    
    socket.on('onError', function(e) {
    	var msg = e.body;
        console.error(msg);
    });
    
    self.init = function(callback) {
    	callback && callback();
    }
    
    // Roles
    self.roleViewModel = null;
    
    self.registerRoleViewModel = function(vm) {
    	self.roleViewModel = vm;
    }
    
    self.getRoles = function() {
    	socket.emit('getRoles');
    }
    
    self.addRole = function(role) {
    	socket.emit('addRole', role);
    }

    self.updateRole = function(role) {
    	socket.emit('updateRole', role);
    }
    
    self.deleteRole = function(id) {
    	socket.emit('deleteRole', id);
    }
};
