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
        
        $scope.download=function(){
    		
//    		var doc = new jsPDF();
//            
//    		alert('html is '+$('#form').html());
//    		//doc.fromHTML($('#form').html(), 15, 15, {
//    		doc.addHTML($('#form').html(), 15, 15, {
//                'width': 170
//                
//            });
//            doc.save('sample-file.pdf');
    		
//    		var pdf = new jsPDF('l', 'pt', 'a4');
//    		 var options = {
//    		    pagesplit: true
//    		};
//
//    		pdf.addHTML($('#form').html(), 0, 0, options, function(){
//    			console.log('download method called');
//    		    pdf.save("test.pdf");
//    		});
    		
    		var 
    		form = $('.form'),
    		cache_width = form.width(),
    		a4  =[ 595.28,  841.89];  // for a4 size paper width and height
    		$('form').scrollTop(0);
    		console.log('download method called');
    		createPDF();
    		
    		//create pdf
    		function createPDF(){
    			getCanvas().then(function(canvas){
    				var 
    				img = canvas.toDataURL("image/png"),
    				doc = new jsPDF({
    		          unit:'px', 
    		          format:'a4'
    		        });     
    		        doc.addImage(img, 'JPEG', 20, 20);
    		        doc.save('techumber-html-to-pdf.pdf');
    		        form.width(cache_width);
    			});
    		}

    		// create canvas object
    		function getCanvas(){
    			form.width((a4[0]*1.33333) -80).css('max-width','none');
    			return html2canvas(form,{
    		    	imageTimeout:2000,
    		    	removeContainer:true
    		    });	
    		}
    		
    	}
    })

    .controller('MailGapCtrl', function ($scope,$ionicPopup,Mailgap,$rootScope) {
          $scope.mailgapform = {};

        // Mailgap.get($rootScope.user).success(function(mailgapformdata) {
        //       $scope.mailgapform = mailgapformdata;
        //       console.log('the mailgapp data is'+$scope.mailgapform);
        //   });

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

//    .controller('ProductDetailCtrl', function ($scope, $rootScope, $stateParams, $ionicPopup, Product, OpenFB, WishListItem, Activity, Status) {
//
//        Product.get($stateParams.productId).success(function(product) {
//            $scope.product = product;
//        });
//
//        $scope.shareOnFacebook = function () {
//            Status.show('Shared on Facebook!');
//            Activity.create({type: "Shared on Facebook", points: 1000, productId: $scope.product.sfid, name: $scope.product.name, image: $scope.product.image})
//                .success(function(status) {
//                    Status.checkStatus(status);
//                });
//        };
//
//        $scope.shareOnTwitter = function () {
//            Status.show('Shared on Twitter!');
//            Activity.create({type: "Shared on Twitter", points: 1000, productId: $scope.product.sfid, name: $scope.product.name, image: $scope.product.image})
//                .success(function(status) {
//                    Status.checkStatus(status);
//                });
//        };
//
//        $scope.shareOnGoogle = function () {
//            Status.show('Shared on Google+!');
//            Activity.create({type: "Shared on Google+", points: 1000, productId: $scope.product.sfid, name: $scope.product.name, image: $scope.product.image})
//                .success(function(status) {
//                    Status.checkStatus(status);
//                });
//        };
//
//        $scope.saveToWishList = function () {
//            WishListItem.create({productId: $scope.product.id}).success(function(status) {
//                Status.show('Added to your wish list!');
//                Activity.create({type: "Added to Wish List", points: 1000, productId: $scope.product.sfid, name: $scope.product.name, image: $scope.product.image})
//                    .success(function(status) {
//                        Status.checkStatus(status);
//                    });
//            });
//        };
//
//    });
