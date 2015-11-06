angular.module('nibs.mailgapform', ['openfb', 'nibs.status', 'nibs.activity', 'nibs.wishlist'])

    .config(function ($stateProvider) {

        $stateProvider

            .state('app.mailgapform', {
                url: "/mailgapform",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/mailgapform.html",
                        controller: "MailGapCtrl"
                    }
                }
            })
            
            .state('app.mailgapformdetail',{
            	url:'/mailgapformdetail',
            	views:{
            		'menuContent':{
            			templateUrl:"templates/mailgapformdetail.html",
            			controller:"MailGapDetailCtrl"
            		}
            			
            	}
            })
            
            .state('app.mailgapformdownload',{
            	url:'/mailgapfordownload',
            	views:{
            		'menuContent':{
            			templateUrl:"templates/mailgapformdetail1.html",
            			controller:"MailGapFormDownload"
            		}
            			
            	}
            })

    })

    // REST resource for access to Products data
    
    .factory('Mailgap', function ($http, $rootScope) {
        return {
            mailgapsubmit: function(mailgappform) {
                return $http.post($rootScope.server.url + '/mailgapp',mailgappform);
            },
            get:function(){
            	return $http.post($rootScope.server.url + '/mailgappformdetail',$rootScope.user);
            	
            }

        };
    })
    
    
    
    .controller('MailGapDetailCtrl',function($scope,$ionicPopup,Mailgap,User,$rootScope){
    	Mailgap.get().success(function(mailgapformdata) {
            $scope.mailgap = mailgapformdata[0];
            console.log('the mailgapp data is'+$scope.mailgap+" "+mailgapformdata+" "+$scope.mailgap.id);
        });
        	
//         $scope.download=function(){
    		
//     	var doc = new jsPDF();
//         doc.fromHTML($('#form').html(), 20, 20, {
//             'width': 500
//         });
//         doc.save('mailgapp.pdf');
//    		    
//     	}
    })
    
    .controller('MailGapFormDownload',function($scope,$state,$ionicPopup,Mailgap,User,$rootScope){
    	Mailgap.get().success(function(mailgapformdata) {
            $scope.mailgap = mailgapformdata[0];
            console.log('the mailgapp data is'+$scope.mailgap+" "+mailgapformdata+" "+$scope.mailgap.id);
        });
        
    	var 
    	 form = $('.form'),
    	 cache_width = form.width(),
    	 a4  =[ 595.28,  841.89];  // for a4 size paper width and height
    	function createPDF(){
    		alert('in createpdf');
    		 getCanvas().then(function(canvas){
    			 alert('in createdpdf getcanvas');
    		  var img = canvas.toDataURL("image/png"),
    		  doc = new jsPDF({
    		          unit:'px', 
    		          format:'a4'
    		        });   
    		  alert('after jsPDF')
    		        doc.addImage(img, 'JPEG', 20, 20);
    		        doc.save('techumber-html-to-pdf.pdf');
    		        alert('file downloaded done');
    		        form.width(cache_width);
    		 });
    	}
    		 
    		// create canvas object
   		function getCanvas(){
   			alert('in getcanvas');
    		 form.width((a4[0]*1.33333) -80).css('max-width','none');
    		 alert('after form width');
    		 var x=html2canvas(form,{
    		        imageTimeout:2000,
    		        removeContainer:true
    		    }); 
    		 alert('canvas value'+x);   
    		 return html2canvas(form,{
    		     imageTimeout:2000,
    		     removeContainer:true
    		    }); 
    		    
   		}
    	
    	$scope.download=function(){
    		createPDF();
    		
    	}
    			

    })


    .controller('MailGapCtrl', function ($scope,$ionicPopup,$state,Mailgap,$rootScope) {
          $scope.mailgapform = {};

        $scope.mailgapformclick = function() {
               Mailgap.mailgapsubmit($scope.mailgapform)
                   .success(function (data) {
                        $ionicPopup.alert({title: 'Success', content: "The Mailgapp form submitted"});
                        $state.go("app.mailgapformdetail");
                   })
                   .error(function () {
                         $ionicPopup.alert({title: 'Oops', content: 'There is some error'});
               });

        }

    });

