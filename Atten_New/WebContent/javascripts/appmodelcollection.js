$(function(){
//Department
window.Department = Backbone.Model.extend({
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

  window.Departments = new DepartmentsCollection;

  //Paper
  window.Paper = Backbone.Model.extend({
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

  window.Papers = new PapersCollection;
  
  
  //Student
  window.Student = Backbone.Model.extend({
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

  window.Students = new StudentsCollection;
  //Staff
  window.Staff = Backbone.Model.extend({
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

  window.Staffs = new StaffsCollection;
  //Semester
  window.Semester = Backbone.Model.extend({
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

  window.Semesters = new SemestersCollection;
  //AttendanceStaffModel
  window.AttendanceStaffModel=Backbone.Model.extend({
	  defaults: {
		  staffId:null,
		  staffName:null,
		  departName: null,
		  semesterName: null,	      
		  paperName:null
	 }
  });
  
   
  
//Attendance Single Period 
  window.AttendanceSinglePeriod = Backbone.Model.extend({
	  defaults: {
		  period:null,
		  attendance:StudentsCollection
	  }
  });
  window.AttendancePeriods=Backbone.Collection.extend({
	  model:window.AttendanceSinglePeriod
  });
  

  window.AttendanceClassPerDay = Backbone.Model.extend({	  
  });  
  
  
// Single Date List
    singleDate = Backbone.Model.extend({});
	singleDateCollection = Backbone.Collection.extend({
		model : singleDate,
		localStorage: new Store("_attendancestudent")
		
	});
	sDateColl = new singleDateCollection();
	
	refactorStudent = Backbone.Model.extend({});
	refactorStudentCollection = Backbone.Collection.extend({
		model : refactorStudent
	});


  
});