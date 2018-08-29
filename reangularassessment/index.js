
var app = angular.module('myapp',['ngRoute']);

app.config(function($routeProvider){
    $routeProvider.when("/",{
        templateUrl:'htmlfile/login.html',
        controller:'loginCtrl'
       
    }).when("/home",{
        template:'<h1>Welcome to Angular1.X</h1>',
        resolve:{
            'authLoginCheck':function(server){
                return server.loginCheck();
            }
        }
    }).when("/users",{
        templateUrl:'htmlfile/users.html',
        resolve:{
            'authLoginCheck':function(server){
                return server.loginCheck();
            }
        },
        controller:'userCtrl',
    }).when("/userlist",{
        templateUrl:'htmlfile/userlist.html',
        resolve:{
            'authLoginCheck':function(server){
                return server.loginCheck();
            }
        },
        controller:'userlistCtrl'
    })
});

app.factory('server',function($window, $location, $q, $rootScope){
    return {
        loginCheck:function(){
            console.log('logincheck');
            var defer = $q.defer();
            if($window.localStorage.getItem('login')){
                defer.resolve();
                $rootScope.$broadcast('loginboard',true);
            }else{
                defer.reject();
                alert("Please login with your valid credentials");
                $location.path('/');
            }
        },

        login:function(username,password){
            if(username==="admin"&&password==="admin") {
                $location.path('/home');
                $window.localStorage.setItem('login',true);
            } else {
                alert('Invaild user credentials');
            }
        },
        logout:function(){
            $window.localStorage.removeItem('login');
            $rootScope.$broadcast('loginboard',false);
            console.log("You have been logged out!!");
        },
        getUserlist:function(){
            return JSON.parse($window.localStorage.getItem('userlist')||"[]");
        },
        submitUser:function(user){
            var userlist=JSON.parse($window.localStorage.getItem('userlist')||"[]");
            userlist.push(user);
            $window.localStorage.setItem('userlist',JSON.stringify(userlist));
            console.log('ok');
            $location.path('userlist');
        },
        setUserlist(userlist){
            $window.localStorage.setItem('userlist',JSON.stringify(userlist));
        }
    }
});

app.controller('loginCtrl',function($scope,server){
    $scope.login=function(){
        return server.login($scope.username,$scope.password);
    }

});

app.controller('menuCtrl',function($scope,$rootScope,server){
    $scope.logined=false;
    $rootScope.$on('loginboard',function(event,payload){
        console.log("get it!");
        console.log(payload);
        $scope.logined=payload;
    });
    $scope.logout=function(){
        return server.logout();
    }
});

// app.factory('server',function($window,$location){
//     return{
//         getUserlist:function(){
//             return JSON.parse($window.localStorage.getItem('userlist')||"[]");
//         },
//         submitUser:function(user){
//             var userlist=JSON.parse($window.localStorage.getItem('userlist')||"[]");
//             userlist.push(user);
//             $window.localStorage.setItem('userlist',JSON.stringify(userlist));
//             console.log('ok');
//             $location.path('userlist');
//         },
//         setUserlist(userlist){
//             $window.localStorage.setItem('userlist',JSON.stringify(userlist));
//         }
//     }
// });

app.controller('userCtrl',function(server,$scope){
    $scope.submitFn=function(){
        var user={};
        user['username']=$scope.username;
        user['password']=$scope.password;
        user['email']=$scope.email;
        user['type']=$scope.type;
        user['gender']=$scope.gender;
        user['location']=$scope.location;
        console.log(user);
        return server.submitUser(user);
    };
})
app.controller('userlistCtrl',function($scope,server){
    $scope.userlist=server.getUserlist();
    $scope.deleteFn=function(idx){
        $scope.userlist.splice(idx, 1);
        server.setUserlist($scope.userlist);
    }
});
