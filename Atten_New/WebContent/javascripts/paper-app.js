$(function(){

  /*window.Paper = Backbone.Model.extend({
    defaults: {
      paperId: null,
      paperName: null
    }
  });

  window.PapersCollection = Backbone.Collection.extend({
    model: Paper,
    localStorage: new Store("_papers"),
	  comparator: function(paper) {
		  return -paper.get(this.$('#manage').data('sort'));
		}
  });

  window.Papers = new PapersCollection;*/

  window.PaperView = Backbone.View.extend({
    tagName: "tr",

    events: {
    },

    template: $("#paper-list").template(),

    initialize: function(){
      _.bindAll(this, "render");
    },

    render: function(){
      var element = jQuery.tmpl(this.template, this.model.toJSON());
      $(this.el).html(element);
      return this;
    }
  });

  window.PaperAppView = Backbone.View.extend({
    el: $("#app"),
    events: {
      "click .tabs a": "tabs",
			"click #add-paper": "createPaper",
			"click .edit-paper": "editPaper",
			"click #update-paper": "updatePaper",			
			"click .delete-paper": "deletePaper",
			"click .sort": "sortPapers",
			"click #selectall": "selectAllPapers",
			"click .select": "selectPaperRow",	
			"click #manage tbody tr": "selectPaperRow",
			"click #deleteall": "deleteAll"													
    },

    initialize: function(){
      _.bindAll(this, "render", "tabs", "addAll", "addPaper", "createPaper", "editPaper", "deletePaper", "sortPapers");
			this.activePaperId = null;
			this.$("#create").show();
      Papers.bind('add', this.addPaper); 
      Papers.bind('reset', this.addAll);
      Papers.fetch();
    },

    selectAllPapers: function(el){
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

		selectPaperRow: function(el){
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
			if(Papers.length>0)
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
				Papers.get(that.data('id')).destroy();
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
		
		editPaper: function(el){
			var target = $(el.target), paper = Papers.get(target.data('id'));
			this.activePaperId = target.data('id');
			$('#paper-edit-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				self.val(paper.attributes[self.attr('name')]);
			});
			this.$('.content').hide();
			this.$('#manage-edit').show();
		},
		
		updatePaper: function(el){
			var target = $(el.target), data = {};
			$('#paper-edit-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				data[self.attr('name')] = self.val();
			});
			Papers.get(this.activePaperId).set(data).save();
			this.addAll();
			this.$('.content').hide();
			this.$('#manage').show();
		},

		deletePaper: function(el){
			var target = $(el.target);
			Papers.get(target.data('id')).destroy();
			target.parents('tr').remove();
		},		

	  addAll: function(){
		  this.$("#manage table tbody").empty(); 	
	    Papers.each(this.addPaper)
	  },
	  
	  addPaper: function(paper){
	    var view = new PaperView({model: paper});
	    this.$("#manage table tbody").prepend(view.render().el);
	  },
	
	  sortPapers: function(el){
		  var target = $(el.target);
		  $('#manage').data('sort', target.data('sort'));
		  Papers.sort();
			this.addAll();
	  },

	  createPaper: function(e){
			var data = {};
			$('#paper-form').find(':input[name]:enabled').each(function() {
				var self = $(this);
				data[self.attr('name')] = self.val();
				self.val("");
			});
			Papers.create(data);
	  }
  });

  window.PaperApp = new PaperAppView();

  // window.AppController = Backbone.Router.extend({
  // 	
  // 	  initialize: function(){
  // 		$('.tabs a').removeClass('active');
  // 		this.mainView = new window.AppView
  // 	  },
  // 
  // 	  routes: {
  // 	    "create":"create",
  // 	    "papers":"papers"
  // 	  },
  // 
  // 	  create: function() {
  // 	    $('.tabs a#create').addClass('active');
  // 	  },
  // 
  // 	  papers: function() {
  // 		$('.tabs a#papers').addClass('active');
  // 	  }
  // 
  // });

  // window.App = new AppController();
  // Backbone.history.start();

});