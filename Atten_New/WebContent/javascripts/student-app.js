$(function(){

  /*window.Student = Backbone.Model.extend({
    defaults: {
    	studentId: null,
    	studentName: null,
    	studentdob: null,
    	departName: null,
    	semesterName:null
    }
  });

  window.StudentsCollection = Backbone.Collection.extend({
    model: Student,
    localStorage: new Store("_students"),
	  comparator: function(student) {
		  return -student.get(this.$('#manage').data('sort'));
		}
  });

  window.Students = new StudentsCollection;*/

  window.StudentView = Backbone.View.extend({
    tagName: "tr",

    events: {
    },

    template: $("#student-list").template(),

    initialize: function(){
      _.bindAll(this, "render");
    },

    render: function(){
      var element = jQuery.tmpl(this.template, this.model.toJSON());
      $(this.el).html(element);
      return this;
    }
  });

  window.StudentAppView = Backbone.View.extend({
    el: $("#app"),
    events: {
      "click .tabs a": "tabs",
			"click #add-student": "createStudent",
			"click .edit-student": "editStudent",
			"click #update-student": "updateStudent",			
			"click .delete-student": "deleteStudent",
			"click .sort": "sortStudents",
			"click #selectall": "selectAllStudents",
			"click .select": "selectStudentRow",	
			"click #manage tbody tr": "selectStudentRow",
			"click #deleteall": "deleteAll"													
    },

    initialize: function(){
      _.bindAll(this, "render", "tabs", "addAll", "addStudent", "createStudent", "editStudent", "deleteStudent", "sortStudents");
			this.activeStudentId = null;
			this.$("#create").show();
      Students.bind('add', this.addStudent); 
      Students.bind('reset', this.addAll);
      Students.fetch();
    },

    selectAllStudents: function(el){
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

		selectStudentRow: function(el){
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
			var info = $('#select-info'), count = $('#manage .select:checked').length, word = count>1?"students":"student",
			    html = '<tr id="select-info"><td colspan="6">('+count+') '+word+' selected. <a id="deleteall" href="javascript:void(0);">delete</a></td></tr>';
			if(Students.length>0)
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
				Students.get(that.data('id')).destroy();
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
		
		editStudent: function(el){
			var target = $(el.target), student = Students.get(target.data('id'));
			this.activeStudentId = target.data('id');
			$('#student-edit-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				self.val(student.attributes[self.attr('name')]);
			});
			this.$('.content').hide();
			this.$('#manage-edit').show();
		},
		
		updateStudent: function(el){
			var target = $(el.target), data = {};
			$('#student-edit-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				data[self.attr('name')] = self.val();
			});
			Students.get(this.activeStudentId).set(data).save();
			this.addAll();
			this.$('.content').hide();
			this.$('#manage').show();
		},

		deleteStudent: function(el){
			var target = $(el.target);
			Students.get(target.data('id')).destroy();
			target.parents('tr').remove();
		},		

	  addAll: function(){
		  this.$("#manage table tbody").empty(); 	
	    Students.each(this.addStudent)
	  },
	  
	  addStudent: function(student){
	    var view = new StudentView({model: student});
	    this.$("#manage table tbody").prepend(view.render().el);
	  },
	
	  sortStudents: function(el){
		  var target = $(el.target);
		  $('#manage').data('sort', target.data('sort'));
		  Students.sort();
			this.addAll();
	  },

	  createStudent: function(e){
			var data = {};
			$('#student-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				data[self.attr('name')] = self.val();
				self.val("");
			});
			Students.create(data);
	  }
  });

  window.StudentApp = new StudentAppView();

  // window.AppController = Backbone.Router.extend({
  // 	
  // 	  initialize: function(){
  // 		$('.tabs a').removeClass('active');
  // 		this.mainView = new window.AppView
  // 	  },
  // 
  // 	  routes: {
  // 	    "create":"create",
  // 	    "students":"students"
  // 	  },
  // 
  // 	  create: function() {
  // 	    $('.tabs a#create').addClass('active');
  // 	  },
  // 
  // 	  students: function() {
  // 		$('.tabs a#students').addClass('active');
  // 	  }
  // 
  // });

  // window.App = new AppController();
  // Backbone.history.start();

});