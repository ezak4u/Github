$(function(){

  /*window.Semester = Backbone.Model.extend({
    defaults: {
      semesterId: null,
      departName: null,
      staffName:null,
      paperName:null,
      semesterName:null
    }
  });

  window.SemestersCollection = Backbone.Collection.extend({
    model: Semester,
    localStorage: new Store("_semesters"),
	  comparator: function(semester) {
		  return -semester.get(this.$('#manage').data('sort'));
		}
  });

  window.Semesters = new SemestersCollection;*/

  window.SemesterView = Backbone.View.extend({
    tagName: "tr",

    events: {
    },

    template: $("#semester-list").template(),

    initialize: function(){
    	//Staffs.fetch();
      _.bindAll(this, "render");
    },

    render: function(){
    	//this.model.set('departName',);
     /* console.log('semester  : ');
      semModJSON=JSON.stringify(this.model);      
      semMod=JSON.parse(semModJSON);
      console.log(semMod.staffName);      
      stfSelect=Staffs.models.filter(function (semester,key,list) {
			var stfMod=list[key].toJSON();
			console.log('stfMod.staffId ',stfMod.staffId, ' semMod.staffName ',semMod.staffName);
			return stfMod.staffId==semMod.staffName;
			});
      stModJSON=JSON.stringify(stfSelect[0]);
      stParse=JSON.parse(stModJSON);
	  console.log('stfSelect : ',stParse,' staffName ',stParse['staffName']);
	  staffName=stParse['staffName'];
	  //this.model.set({'staffName':staffName});
*/      var element = jQuery.tmpl(this.template, this.model.toJSON());
      $(this.el).html(element);
      return this;
    }
  });

  window.SemesterAppView = Backbone.View.extend({
    el: $("#app"),
    events: {
      "click .tabs a": "tabs",
			"click #add-semester": "createSemester",
			"click .edit-semester": "editSemester",
			"click #update-semester": "updateSemester",			
			"click .delete-semester": "deleteSemester",
			"click .sort": "sortSemesters",
			"click #selectall": "selectAllSemesters",
			"click .select": "selectSemesterRow",	
			"click #manage tbody tr": "selectSemesterRow",
			"click #deleteall": "deleteAll"													
    },

    initialize: function(){
      _.bindAll(this, "render", "tabs", "addAll", "addSemester", "createSemester", "editSemester", "deleteSemester", "sortSemesters");
			this.activeSemesterId = null;
			this.$("#create").show();
      Semesters.bind('add', this.addSemester); 
      Semesters.bind('reset', this.addAll);
      Semesters.fetch();
    },

    selectAllSemesters: function(el){
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

		selectSemesterRow: function(el){
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
			var info = $('#select-info'), count = $('#manage .select:checked').length, word = count>1?"subjects":"subject",
			    html = '<tr id="select-info"><td colspan="6">('+count+') '+word+' selected. <a id="deleteall" href="javascript:void(0);">delete</a></td></tr>';
			if(Semesters.length>0)
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
				Semesters.get(that.data('id')).destroy();
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
		
		editSemester: function(el){
			var target = $(el.target), semester = Semesters.get(target.data('id'));
			this.activeSemesterId = target.data('id');
			$('#semester-edit-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				self.val(semester.attributes[self.attr('name')]);
			});
			this.$('.content').hide();
			this.$('#manage-edit').show();
		},
		
		updateSemester: function(el){
			var target = $(el.target), data = {};
			$('#semester-edit-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				data[self.attr('name')] = self.val();
			});
			Semesters.get(this.activeSemesterId).set(data).save();
			this.addAll();
			this.$('.content').hide();
			this.$('#manage').show();
		},

		deleteSemester: function(el){
			var target = $(el.target);
			Semesters.get(target.data('id')).destroy();
			target.parents('tr').remove();
		},		

	  addAll: function(){
		  this.$("#manage table tbody").empty(); 	
	    Semesters.each(this.addSemester)
	  },
	  
	  addSemester: function(semester){		
	    var view = new SemesterView({model: semester});
	    this.$("#manage table tbody").prepend(view.render().el);
	  },
	
	  sortSemesters: function(el){
		  var target = $(el.target);
		  $('#manage').data('sort', target.data('sort'));
		  Semesters.sort();
			this.addAll();
	  },

	  createSemester: function(e){
			var data = {};
			$('#semester-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				data[self.attr('name')] = self.val();
				self.val("");
			});
			Semesters.create(data);
	  }
  });

  window.SemesterApp = new SemesterAppView();

  // window.AppController = Backbone.Router.extend({
  // 	
  // 	  initialize: function(){
  // 		$('.tabs a').removeClass('active');
  // 		this.mainView = new window.AppView
  // 	  },
  // 
  // 	  routes: {
  // 	    "create":"create",
  // 	    "semesters":"semesters"
  // 	  },
  // 
  // 	  create: function() {
  // 	    $('.tabs a#create').addClass('active');
  // 	  },
  // 
  // 	  semesters: function() {
  // 		$('.tabs a#semesters').addClass('active');
  // 	  }
  // 
  // });

  // window.App = new AppController();
  // Backbone.history.start();

});