$(function(){

  window.departmentId=1;
  /*window.Department = Backbone.Model.extend({
    defaults: {
    	departmentId: null,
    	departmentName: null
    }
  });

  window.DepartmentsCollection = Backbone.Collection.extend({
    model: Department,
    localStorage: new Store("_departments"),
	  comparator: function(department) {
		  return -department.get(this.$('#manage').data('sort'));
		}
  });

  window.Departments = new DepartmentsCollection;*/

  window.DepartmentView = Backbone.View.extend({
    tagName: "tr",

    events: {
    },

    template: $("#department-list").template(),

    initialize: function(){
      _.bindAll(this, "render");
    },

    render: function(){
      var element = jQuery.tmpl(this.template, this.model.toJSON());
      $(this.el).html(element);
      return this;
    }
  });

  window.DepartmentAppView = Backbone.View.extend({
    el: $("#app"),
    events: {
      "click .tabs a": "tabs",
			"click #add-department": "createDepartment",
			"click .edit-department": "editDepartment",
			"click #update-department": "updateDepartment",			
			"click .delete-department": "deleteDepartment",
			"click .sort": "sortDepartments",
			"click #selectall": "selectAllDepartments",
			"click .select": "selectDepartmentRow",	
			"click #manage tbody tr": "selectDepartmentRow",
			"click #deleteall": "deleteAll"													
    },

    initialize: function(){
      _.bindAll(this, "render", "tabs", "addAll", "addDepartment", "createDepartment", "editDepartment", "deleteDepartment", "sortDepartments");
			this.activeDepartmentId = null;
			this.$("#create").show();
      Departments.bind('add', this.addDepartment); 
      Departments.bind('reset', this.addAll);
      Departments.fetch();
    },

    selectAllDepartments: function(el){
	    var target = $(el.target), rows = this.$('#manage tr:not(#select-info)');
			if(target.is(':checked'))
			{
				rows.css({background:"whiteSmoke"}).find('.select').prop("checked", true);
			}
			else
			{
				rows.css({background:"white"}).find('.select').prop("checked", false);
			}
			this.showSelected();
		},

		selectDepartmentRow: function(el){
			var target = $(el.target), row = target.parents("tr"), checkbox = row.find('.select');
			if(checkbox.is(':checked'))
			{
				row.css({background:"white"});
				checkbox.prop("checked", false);
			}
			else
			{
				row.css({background:"whiteSmoke"});
				checkbox.prop("checked", true);
			}
			this.showSelected();			
		},		
		
		showSelected: function(){
			var info = $('#select-info'), count = $('#manage .select:checked').length, word = count>1?"departments":"department",
			    html = '<tr id="select-info"><td colspan="6">('+count+') '+word+' selected. <a id="deleteall" href="javascript:void(0);">delete</a></td></tr>';
			if(Departments.length>0)
			{
				if(info.length === 0)
				{
				  $('#manage tbody').prepend(html);	
				}
				else if(count>0)
				{
					info.replaceWith($(html));
				}
				else
				{
					info.remove();
				}
			}	
		},
		
		deleteAll: function(){	
			$('#manage tbody').find('input:checked').each(function() {
				var that = $(this);
				Departments.get(that.data('id')).destroy();
				that.parents('tr').remove();
			});
			$('#select-info').hide();
			$('#selectall').prop("checked", false);
		},

		tabs: function(e){
		  var target = $(e.target);
		  $('.tabs a').removeClass('active');
		  target.addClass('active');
		  this.$('.content').hide();
		  if(target.attr('id') === "create-tab")
		  {
		    this.$("#create").show();	
		  }
		  else
		  {	
			  this.addAll();
				this.$('#selectall').prop("checked", false);
		    this.$("#manage").show();		
		  }
		},
		
		editDepartment: function(el){
			var target = $(el.target), department = Departments.get(target.data('id'));
			this.activeDepartmentId = target.data('id');
			$('#department-edit-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				self.val(department.attributes[self.attr('name')]);
			});
			this.$('.content').hide();
			this.$('#manage-edit').show();
		},
		
		updateDepartment: function(el){
			var target = $(el.target), data = {};
			$('#department-edit-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				data[self.attr('name')] = self.val();
			});
			Departments.get(this.activeDepartmentId).set(data).save();
			this.addAll();
			this.$('.content').hide();
			this.$('#manage').show();
		},

		deleteDepartment: function(el){
			var target = $(el.target);
			Departments.get(target.data('id')).destroy();
			target.parents('tr').remove();
		},		

	  addAll: function(){
		  this.$("#manage table tbody").empty(); 	
	    Departments.each(this.addDepartment)
	  },
	  
	  addDepartment: function(department){
	    var view = new DepartmentView({model: department});
	    this.$("#manage table tbody").prepend(view.render().el);
	  },
	
	  sortDepartments: function(el){
		  var target = $(el.target);
		  $('#manage').data('sort', target.data('sort'));
		  Departments.sort();
		  this.addAll();
	  },

	  createDepartment: function(e){
			var data = {};
			$('#department-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				data[self.attr('name')] = self.val();
				self.val("");
			});
			Departments.create(data);
	  }
  });

  window.DepartmentApp = new DepartmentAppView();

  // window.AppController = Backbone.Router.extend({
  // 	
  // 	  initialize: function(){
  // 		$('.tabs a').removeClass('active');
  // 		this.mainView = new window.AppView
  // 	  },
  // 
  // 	  routes: {
  // 	    "create":"create",
  // 	    "departments":"departments"
  // 	  },
  // 
  // 	  create: function() {
  // 	    $('.tabs a#create').addClass('active');
  // 	  },
  // 
  // 	  departments: function() {
  // 		$('.tabs a#departments').addClass('active');
  // 	  }
  // 
  // });

  // window.App = new AppController();
  // Backbone.history.start();

});