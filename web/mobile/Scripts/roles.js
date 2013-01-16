var cai = cai || {};

cai.RolesViewModel = function(serverhost, serverport) {
	
    //**********************************************
    // HUB Client
	var socket = io.connect('//' + serverhost, { port: serverport });
    socket.on('setRoles', function(roles) {
    	onSetRoles(roles);
    });
    socket.on('roleAdded', function(role) {
    	onRoleAdded(role);
    });
    socket.on('roleUpdated', function(role) {
    	onRoleUpdated(role);
    });
    socket.on('roleDeleted', function(id) {
    	onRoleDeleted(id);
    });
    socket.on('onError', function(e) {
        //onError(e);
    	var msg = e.body;
        console.error(msg);
    });
    
    function getRoles() {
    	socket.emit('getRoles');
    }
    function addRole(role) {
    	socket.emit('addRole', role);
    }
    function updateRole(role) {
    	socket.emit('updateRole', role);
    }
    function deleteRole(id) {
    	socket.emit('deleteRole', id);
    }
    //**********************************************
    
	var activeRole;
    var model = function(){
        Id : '';
        Name : '';
        Description : '';
        Active : '';
        
    }
    
    var models = [];
	function findModelById(id){
		for(var i = 0; i < models.length ; i++){
		   if(models[i].Id == id){
				return models[i];
		   }
		}
	}
	function updateModel(updated){
		var index = _.indexOf(models, findModelById(updated.Id));
		models.splice(index,1,updated);
	}
	function transitionToEdit(elem)
	{
		activeRole = findModelById($(elem).attr('id'))
		$('#editName').val(activeRole.Name);
		$('#editDescription').val(activeRole.Description);
	    $.mobile.changePage("#editPage");
		$('#editName').select().focus();
	}
	function processDeletion(elem){
    	$('<div>').simpledialog2({
			mode: 'button',
			headerText: 'Delete Role',
			headerClose: true,
			buttonPrompt: 'Confirm Deletion of ' + $(elem).text(),
			buttons : {
			  'OK': {
				click: function () {
				  $(elem).addClass("deletedItem");
				  deleteRole($(elem).attr('id'));
				}
			  },
			  'Cancel': {
				click: function () { 
				},
				icon: "delete",
				theme: "c"
			  }
			}
		});
	}
	
	function bindEvents(elem){
		$(elem).on("click", function(event){
			transitionToEdit(elem);
		});
		$(elem).on("swipeleft", function(event){
			processDeletion(elem);
		});
		$(elem).on("swiperight", function(event){
			processDeletion(elem);
		});
	}
    
	$( '#mainPage' ).live( 'pageinit',function(event){
    	//getRoles();
		//$.mobile.showPageLoadingMsg();
	});
	$( '#editPage' ).live( 'pageinit',function(event){
		$('#editName').keypress(function(e) {
			if(e.which == 13) {
				jQuery(this).blur();
				jQuery('#updateButton').focus().click();
			}
		});
        $('#editDescription').keypress(function(e) {
        
			if(e.which == 13) {
				jQuery(this).blur();
				jQuery('#updateButton').focus().click();
			}
		});
	});
	
	$( '#addPage' ).live( 'pageinit',function(event){
		$('#roleDescription').keypress(function(e) {
        	if(e.which == 13) {
            	jQuery(this).blur();
                jQuery('#createButton').focus().click();
			}
		});
		$('#role').keypress(function(e) {
        	if(e.which == 13) {
            	jQuery(this).blur();
                jQuery('#createButton').focus().click();
			}
		});
	});

	$("#newRole").click(function(){
		$("#role").val("");
		$("#roleDescription").val("");
	});
    
	$("#createButton").click(function() {
		if($("#role").val() != ''){
			var add = new model();
			add.Id = 0;
			add.Name = $('#role').val();
			add.Description = $('#roleDescription').val();
			add.active = true;
			addRole(add);
		}
	});
	
	$("#updateButton").click(function() {
		if($("#editName").val() != ''){
			activeRole.Name = $('#editName').val();
			activeRole.Description = $('#editDescription').val();
			updateRole(activeRole);
		}
	});
	
    function onSetRoles(roles) {
    	if (roles) {
        	models = [];
            $('#roleList').children().remove();
            $.mobile.hidePageLoadingMsg();
            var rolesarray = (typeof roles == "string") ? JSON.parse(roles) : roles;
            for (var i=0; i<rolesarray.length; i++) {
            	models = rolesarray;
                var role = rolesarray[i];
                $('#roleList').append("<li id='" + role.Id + "'><a data-role='button'>" + role.Name + "</a></li>");
                bindEvents($('#' + role.Id));
			}
            $('#roleList').listview('refresh');
		}
	}

     function onRoleAdded(role) {
		models.push(role);
        $('#roleList').append("<li id='" + role.Id + "'><a data-role='button'>" + role.Name + "</a></li>");
		bindEvents($('#' + role.Id));
    	$("#roleList").listview("refresh"); 
    };
 
 	function onRoleUpdated(role) {
		updateModel(role);
		$('#' + role.Id).replaceWith("<li id='" + role.Id + "'><a data-role='button'>" + role.Name + "</a></li>");
		bindEvents($('#' + role.Id));
		$('#roleList').listview('refresh');
	}
    function onRoleDeleted(id){
		//remove from model.
        $('#'+id).remove();
        $('#roleList').listview('refresh');
    };
    
	this.init = function() {
		if( !window.location.hash ) {
			window.addEventListener("load", function(){
				if(document.height <= window.outerHeight + 10)
				{
					document.body.style.height = (window.outerHeight + 50) +'px';
					setTimeout( function(){ window.scrollTo(0, 1); }, 50 );
				}
				else
				{
					setTimeout( function(){ window.scrollTo(0, 1); }, 0 );
				}
			});
		}
        
    	getRoles();
		$.mobile.showPageLoadingMsg();
    }
}
    
$(function() {
    var app = new cai.RolesViewModel('192.168.50.12', 4242);
    app.init();
});
    