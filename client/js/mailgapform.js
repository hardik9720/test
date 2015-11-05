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
        	
    //     $scope.download=function(){
    		
    // 	var doc = new jsPDF();
    //     doc.fromHTML($('.form').html(), 15, 15, {
    //         'width': 170
    //     });
    //     doc.save('mailgapp.pdf');
    		    
    // 	}
    })
    
    .controller('MailGapFormDownload',function($scope,$state,$ionicPopup,Mailgap,User,$rootScope){
    	Mailgap.get().success(function(mailgapformdata) {
            $scope.mailgap = mailgapformdata[0];
            console.log('the mailgapp data is'+$scope.mailgap+" "+mailgapformdata+" "+$scope.mailgap.id);
        });
        	
    	var doc = new jsPDF();
        doc.fromHTML($('#form').html(), 15, 15, {
            'width': 170
        });
        doc.save('mailgapp.pdf');
        console.log('file downloading');
		$state.go("app.mailgapformdetail");			

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

