/*
 * API Docs - 1.0
 * https://github.com/plougy/apidocs-ui
 *
 * Aymeric Gallissot
 * http://aymericgallissot.fr
 *
 * Original idea: swagger.wordnik.com 
 *
 */

$(function(){

	helper = {
		s: $('#helper'),
		log: function(message){
			this.s.text(message);
		},
		
		off: function(){
			this.s.hide();
		},
		clear: function(){
			this.s.text('');
		}
	};
	
	
 	apidoc = {
		basePath: 'docs/',
		resources: null,
		
		init: function(jsonResources){
			_this = this;
						
			helper.log('Fetch resources listing');			
			this.resourcesLoad(jsonResources);
						
			this.link();
		},
		
		resourcesLoad: function(jsonResources){
			$.ajax({
				url: _this.basePath + jsonResources,
				dataType: 'json',
				success: function(resources){
					_this.resourcesProcess(resources);
					_this.resourcesTmpl();
				}
			});
		},
		
		resourcesProcess: function(resources){
			this.resources = resources;
			this.resources.count = resources.resources.length;
		},
		
		resourcesTmpl: function(){
			resources = this.resources.resources;

			$("#resourceTmpl").tmpl(resources).appendTo("#resources");
			
			this.endpointsLoad();
			helper.clear();
		},
		
		endpointsLoad: function(){
			resources = this.resources.resources;			
			
			$.each(resources, function(i){
				var indexResource = i;
				var resource = resources[i];
				
				if(resource.json){
					$.ajax({
						url: _this.basePath + resource.json,
						dataType: 'json',
						success: function(resource){
							_this.endpointsProcess(indexResource, resource);
							_this.endpointProcess(indexResource);
							_this.endpointTmpl(indexResource);
						}
					});
				}
			});
						
		},
		
		endpointsProcess: function(indexResource, resource){
			endpoints = resource.endpoints;
			version = resource.version;
			
			this.resources.resources[indexResource].endpoints = endpoints;
			this.resources.resources[indexResource].version = version;			
		},
		
		endpointProcess: function(indexResource){			
			resource = this.resources.resources[indexResource];
			endpoints = resource.endpoints;
			name = resource.resource;
			
			$.each(endpoints, function(i){
				index = i;
				endpoint = endpoints[i];
				
				endpoint.httpMethod = endpoint.httpMethod.toLowerCase();				
				endpoint.resource = name;
				//resource.endpoints[index] = endpoint;
			});			
		},
		
		endpointTmpl: function(indexResource){						
			resource = this.resources.resources[indexResource];
			endpoints = resource.endpoints;
						
			$.each(endpoints, function(i){
				endpoint = endpoints[i];
				
				selector = "#" + endpoint.resource + " .endpoints";
				
				$("#endpointTmpl").tmpl(endpoints[i]).appendTo(selector);
			});
			
			helper.clear();
		},
		
		link: function(){
			$('a').live('click', function(){
				return false;
			});
			
			$('h2 a').live('click', function(){
				resource = $(this).closest('.resource');
				endpoints = resource.find('.endpoints');
				
				if(endpoints.html() != ''){
					resource.toggleClass('active');
					endpoints.slideToggle(200);
				}
			});
			
			$('h3 a').live('click', function(){
				$(this).closest('.endpoint').find('.content').slideToggle(200);
			});
			
			$('.resource a.show').live('click', function(){
				resource = $(this).closest('.resource');
				endpoints = resource.find('.endpoints');
				
				if(endpoints.html() != ''){
					resource.toggleClass('active');
					endpoints.slideToggle(200);
				}
			});
			
			$('.resource a.list').live('click', function(){
				resource = $(this).closest('.resource');
				endpoints = resource.find('.endpoints');
				
				if(endpoints.html() != ''){
					if(!resource.hasClass('active')){
						resource.addClass('active');
						endpoints.slideToggle(200);
					}
					
					endpoints.find('.endpoint .content').hide(200);
				}
			});
			
			$('.resource a.expand').live('click', function(){
				resource = $(this).closest('.resource');
				endpoints = resource.find('.endpoints');
				
				if(endpoints.html() != ''){
					if(!resource.hasClass('active')){
						resource.addClass('active');
						endpoints.slideToggle(200);
					}
					
					endpoints.find('.endpoint .content').show(200);
				}
			});
			
			$('.endpoint .heading .options a').live('click', function(){	
				$(this).closest('.endpoint').find('.content').slideToggle(200);
			});
		}
		
	};
	
	
	apidoc.init('api.json');
	
});