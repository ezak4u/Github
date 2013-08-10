$(function(){

  /*window.Staff = Backbone.Model.extend({
    defaults: {
    	staffId: null,
    	staffName: null,
    	staffdoj: null,
    	departName: null
    }
  });

  window.StaffsCollection = Backbone.Collection.extend({
    model: Staff,
    localStorage: new Store("_staffs"),
	  comparator: function(staff) {
		  return -staff.get(this.$('#manage').data('sort'));
		}
  });

  window.Staffs = new StaffsCollection;*/

  window.StaffView = Backbone.View.extend({
    tagName: "tr",

    events: {
    },

    template: $("#staff-list").template(),

    initialize: function(){
      _.bindAll(this, "render");
    },

    render: function(){
      var element = jQuery.tmpl(this.template, this.model.toJSON());
      $(this.el).html(element);
      return this;
    }
  });

  window.StaffAppView = Backbone.View.extend({
    el: $("#app"),
    events: {
      "click .tabs a": "tabs",
			"click #add-staff": "createStaff",
			"click .edit-staff": "editStaff",
			"click #update-staff": "updateStaff",			
			"click .delete-staff": "deleteStaff",
			"click .sort": "sortStaffs",
			"click #selectall": "selectAllStaffs",
			"click .select": "selectStaffRow",	
			"click #manage tbody tr": "selectStaffRow",
			"click #deleteall": "deleteAll"													
    },

    initialize: function(){
      _.bindAll(this, "render", "tabs", "addAll", "addStaff", "createStaff", "editStaff", "deleteStaff", "sortStaffs");
			this.activeStaffId = null;
			this.$("#create").show();
      Staffs.bind('add', this.addStaff); 
      Staffs.bind('reset', this.addAll);
      Staffs.fetch();
    },

    selectAllStaffs: function(el){
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

		selectStaffRow: function(el){
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
			var info = $('#select-info'), count = $('#manage .select:checked').length, word = count>1?"staffs":"staff",
			    html = '<tr id="select-info"><td colspan="6">('+count+') '+word+' selected. <a id="deleteall" href="javascript:void(0);">delete</a></td></tr>';
			if(Staffs.length>0)
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
				Staffs.get(that.data('id')).destroy();
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
		
		editStaff: function(el){
			var target = $(el.target), staff = Staffs.get(target.data('id'));
			this.activeStaffId = target.data('id');
			$('#staff-edit-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				self.val(staff.attributes[self.attr('name')]);
			});
			this.$('.content').hide();
			this.$('#manage-edit').show();
		},
		
		updateStaff: function(el){
			var target = $(el.target), data = {};
			$('#staff-edit-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				data[self.attr('name')] = self.val();
			});
			Staffs.get(this.activeStaffId).set(data).save();
			this.addAll();
			this.$('.content').hide();
			this.$('#manage').show();
		},

		deleteStaff: function(el){
			var target = $(el.target);
			Staffs.get(target.data('id')).destroy();
			target.parents('tr').remove();
		},		

	  addAll: function(){
		  this.$("#manage table tbody").empty(); 	
	    Staffs.each(this.addStaff)
	  },
	  
	  addStaff: function(staff){
	    var view = new StaffView({model: staff});
	    this.$("#manage table tbody").prepend(view.render().el);
	  },
	
	  sortStaffs: function(el){
		  var target = $(el.target);
		  $('#manage').data('sort', target.data('sort'));
		  Staffs.sort();
			this.addAll();
	  },

	  createStaff: function(e){
			var data = {};
			$('#staff-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				data[self.attr('name')] = self.val();
				self.val("");
			});
			Staffs.create(data);
	  }
  });

  window.StaffApp = new StaffAppView();

  // window.AppController = Backbone.Router.extend({
  // 	
  // 	  initialize: function(){
  // 		$('.tabs a').removeClass('active');
  // 		this.mainView = new window.AppView
  // 	  },
  // 
  // 	  routes: {
  // 	    "create":"create",
  // 	    "staffs":"staffs"
  // 	  },
  // 
  // 	  create: function() {
  // 	    $('.tabs a#create').addClass('active');
  // 	  },
  // 
  // 	  staffs: function() {
  // 		$('.tabs a#staffs').addClass('active');
  // 	  }
  // 
  // });

  // window.App = new AppController();
  // Backbone.history.start();

});